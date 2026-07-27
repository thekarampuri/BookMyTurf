import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Cashfree } from "cashfree-pg";

admin.initializeApp();

// Configure Cashfree
// The user MUST provide real keys for production.
Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID || "SET_YOUR_CASHFREE_CLIENT_ID";
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET || "SET_YOUR_CASHFREE_CLIENT_SECRET";
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION; // Force production as requested by user

export const createPaymentSession = onCall(async (request) => {
  const { amount, customerPhone, customerName, customerEmail } = request.data;

  if (!amount || !customerPhone) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  // Ensure unique order ID for Cashfree
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

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
    
    return {
      paymentSessionId: response.data.payment_session_id,
      orderId: orderId,
    };
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error.response?.data || error);
    throw new HttpsError("internal", "Failed to create payment session");
  }
});
