import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Cashfree } from "cashfree-pg";

admin.initializeApp();
const db = admin.firestore();

// Configure Cashfree
Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID || "SET_YOUR_CASHFREE_CLIENT_ID";
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET || "SET_YOUR_CASHFREE_CLIENT_SECRET";
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

export const createPaymentSession = onCall(async (request) => {
  const { amount, customerPhone, customerName, customerEmail, turfId, turfName, date, time } = request.data;

  if (!amount || !customerPhone || !turfId || !date || !time) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  // 1. CONCURRENCY CHECK
  // Check if slot is already booked
  const existingBookings = await db.collection("bookings")
    .where("turfId", "==", turfId)
    .where("date", "==", date)
    .where("time", "==", time)
    .get();

  const isBooked = existingBookings.docs.some(doc => doc.data().status !== "Cancelled");
  
  if (isBooked) {
    throw new HttpsError("already-exists", "This time slot has just been booked by someone else.");
  }

  // 2. CREATE CASHFREE SESSION
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  let paymentSessionId = "";

  try {
    const requestData = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${customerPhone}`,
        customer_phone: customerPhone,
        customer_name: customerName || "Guest",
        customer_email: customerEmail || "guest@bookmyturf.local",
      },
      order_meta: {
        return_url: "https://bookmyturf.local/payment-callback?order_id={order_id}"
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", requestData);
    paymentSessionId = response.data.payment_session_id;
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error.response?.data || error);
    throw new HttpsError("internal", "Failed to create payment session");
  }

  // 3. CREATE PENDING BOOKING
  const bookingRef = await db.collection("bookings").add({
    turfId,
    turfName,
    date,
    time,
    userName: customerName,
    userPhone: customerPhone,
    amount: amount,
    status: 'Pending',
    orderId: orderId,
    createdAt: new Date().toISOString()
  });

  return {
    paymentSessionId,
    orderId,
    bookingId: bookingRef.id
  };
});

import { onDocumentUpdated } from "firebase-functions/v2/firestore";

export const sendBookingConfirmationEmail = onDocumentUpdated("bookings/{bookingId}", async (event) => {
  const newValue = event.data?.after.data();
  const previousValue = event.data?.before.data();

  if (!newValue || !previousValue) return null;

  // Only trigger if status changed to 'Confirmed'
  if (newValue.status === 'Confirmed' && previousValue.status !== 'Confirmed') {
    const mailData = {
      to: newValue.customerEmail || newValue.userPhone + "@fake.local", // We only capture phone and optional email in the UI. If email exists, send it.
      message: {
        subject: `Booking Confirmed: ${newValue.turfName}`,
        html: `
          <h1>Your Booking is Confirmed!</h1>
          <p>Hi ${newValue.userName},</p>
          <p>Your booking at <strong>${newValue.turfName}</strong> for <strong>${newValue.date}</strong> at <strong>${newValue.time}</strong> is confirmed.</p>
          <p>Amount Paid (Advance): ₹${newValue.amount}</p>
          <p>Thank you for choosing BookMyTurf!</p>
        `
      }
    };
    
    // In a real scenario without the Trigger Email extension, you would use Nodemailer here.
    // Assuming the user will use "Trigger Email from Firestore" extension:
    return db.collection("mail").add(mailData);
  }

  return null;
});
