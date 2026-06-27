import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingStepper from '../components/BookingStepper';
import type { Turf, TimeSlot, UserDetails } from '../types';
import './PaymentPage.css';

interface LocationState {
  turf: Turf;
  date: string;
  duration: number;
  slot: TimeSlot;
  userDetails: UserDetails;
  advanceAmount: number;
  totalAmount: number;
}

const TOTAL_SECONDS = 600; // 10 minutes

const PAYMENT_METHODS = ['💳 Cards', '🏦 Net Banking', '📱 UPI', '👛 Wallets'];

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ps = state as LocationState | null;

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [expired, setExpired] = useState(false);

  const handleExpire = useCallback(() => {
    setExpired(true);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) { handleExpire(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, handleExpire]);

  if (!ps) {
    return (
      <div className="page-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No booking found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/booking')}>Go to Booking</button>
        </div>
      </div>
    );
  }

  const { turf, date, slot, userDetails, advanceAmount, totalAmount } = ps;
  const bookingDate = new Date(date);
  const remainingAmount = totalAmount - advanceAmount;
  const progress = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handlePay = () => {
    // In production: redirect to Cashfree payment gateway
    alert(`Redirecting to Cashfree payment of ₹${advanceAmount}...`);
  };

  return (
    <div className="page-bg">
      <Navbar />
      <BookingStepper currentStep={3} />

      <div className="payment-page container">
        {expired ? (
          <div className="expired-card card">
            <div className="expired-card__icon">⏰</div>
            <h2 className="expired-card__title serif">Slot Hold Expired</h2>
            <p className="expired-card__desc">
              Your 10-minute slot hold has expired. Please start a new booking.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/booking')}>
              Book Again
            </button>
          </div>
        ) : (
          <div className="payment-card card">
            {/* Icon */}
            <div className="payment-card__icon-wrap">
              <div className="payment-card__icon">💳</div>
            </div>

            <h1 className="payment-card__title serif">Complete Your Payment</h1>
            <p className="payment-card__subtitle">
              Pay the advance to confirm your booking instantly.
            </p>

            {/* Countdown */}
            <div className="countdown-wrap">
              <div className="countdown-header">
                <span className="countdown-label">Slot held for</span>
                <span className="countdown-timer">{minutes}:{seconds}</span>
              </div>
              <div className="countdown-bar-track">
                <div
                  className="countdown-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="countdown-note">
                ⚡ Your slot will be auto-released after this timer expires.
              </p>
            </div>

            {/* Booking Details */}
            <div className="payment-details">
              <h3 className="payment-details__heading">Booking Details</h3>
              <div className="payment-details__rows">
                <div className="payment-detail-row">
                  <span>Name</span><span>{userDetails.name}</span>
                </div>
                <div className="payment-detail-row">
                  <span>Turf</span>
                  <span style={{ color: 'var(--burgundy)', fontWeight: 600 }}>{turf.name}</span>
                </div>
                <div className="payment-detail-row">
                  <span>Date</span><span>{bookingDate.toDateString()}</span>
                </div>
                <div className="payment-detail-row">
                  <span>Time</span><span>{slot.time} → {slot.endTime}</span>
                </div>
                <div className="payment-detail-row">
                  <span>Full Amount</span><span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Advance highlight */}
            <div className="advance-highlight">
              <div className="advance-highlight__row">
                <span className="advance-highlight__label">Advance Payment (25%)</span>
                <span className="advance-highlight__amount">₹{advanceAmount}</span>
              </div>
              <p className="advance-highlight__note">
                Remaining ₹{remainingAmount} to be paid at the turf.
              </p>
            </div>

            {/* Pay Button */}
            <button className="btn btn-primary btn-lg payment-pay-btn" onClick={handlePay}>
              💳 Pay ₹{advanceAmount} Securely
            </button>

            {/* Security Note */}
            <p className="payment-security-note">
              🔒 Secured by Cashfree · 256-bit SSL encryption
            </p>

            {/* Payment Methods */}
            <div className="payment-methods">
              <p className="payment-methods__label">Accepted</p>
              <div className="payment-methods__pills">
                {PAYMENT_METHODS.map((m) => (
                  <span key={m} className="payment-method-pill">{m}</span>
                ))}
              </div>
            </div>

            {/* Back */}
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button className="btn btn-outlined" onClick={() => navigate('/details', { state: ps })}>
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
