import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingStepper from '../components/BookingStepper';
import type { Turf, TimeSlot } from '../types';
import './PaymentPage.css';

interface UserInfo {
  name: string;
  phone: string;
  email?: string;
  participants?: string;
  eventType?: string;
  specialRequests?: string;
}

interface LocationState {
  turf: Turf;
  date: string;
  duration: number;
  slot: TimeSlot;
  userDetails: UserInfo;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExpire = useCallback(() => {
    setExpired(true);
  }, []);

  useEffect(() => {
    if (isSuccess || isProcessing) return;
    if (secondsLeft <= 0) { handleExpire(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, handleExpire, isSuccess, isProcessing]);

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
  const fmt = (t: string) => t.replace(':00 ', '').replace(/^0/, '');

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="page-bg">
      <Navbar />
      <BookingStepper currentStep={3} />

      <div className="payment-page container">
        {isSuccess ? (
          <div className="expired-card card" style={{ borderColor: '#2e7d32', backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
            <div className="expired-card__icon">✅</div>
            <h2 className="expired-card__title serif" style={{ color: '#2e7d32' }}>Booking Confirmed!</h2>
            <p className="expired-card__desc">
              Your payment of ₹{advanceAmount} was successful. A confirmation email has been sent to {userDetails.email || 'your email'}.
            </p>
            <div className="payment-details__rows" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', textAlign: 'left', width: '100%' }}>
              <div className="payment-detail-row">
                <span>Field:</span><span style={{ fontWeight: 600 }}>{turf.name}</span>
              </div>
              <div className="payment-detail-row">
                <span>Date:</span><span>{bookingDate.toLocaleDateString('en-IN')}</span>
              </div>
              <div className="payment-detail-row">
                <span>Time:</span><span>{fmt(slot.time)} to {fmt(slot.endTime)}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        ) : expired ? (
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="payment-card card">
              {/* Icon */}
              <div className="payment-card__icon-wrap">
                <div className="payment-card__icon">💳</div>
              </div>

              <h1 className="payment-card__title serif">Complete Payment</h1>
              <p className="payment-card__subtitle">
                Secure advance payment for your turf booking
              </p>

              {/* Countdown */}
              <div className="countdown-wrap">
                <div className="countdown-header">
                  <span className="countdown-label">Complete Payment Within</span>
                  <span className={`countdown-timer ${secondsLeft < 120 ? 'countdown-timer--pulse' : ''}`}>{minutes}:{seconds}</span>
                </div>
                <div className="countdown-bar-track">
                  <div
                    className={`countdown-bar-fill ${secondsLeft < 120 ? 'countdown-bar-fill--urgent' : ''}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="countdown-note" style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                  Your slot is temporarily reserved. Complete payment to confirm your booking.
                </p>
              </div>

              {/* Booking Details */}
              <div className="payment-details">
                <h3 className="payment-details__heading">Booking Details</h3>
                <div className="payment-details__rows">
                  <div className="payment-detail-row">
                    <span>Field:</span><span style={{ color: 'var(--burgundy)', fontWeight: 600 }}>{turf.name}</span>
                  </div>
                  <div className="payment-detail-row">
                    <span>Date:</span><span>{bookingDate.toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="payment-detail-row">
                    <span>Time:</span><span>{fmt(slot.time)} to {fmt(slot.endTime)}</span>
                  </div>
                  <div className="payment-detail-row">
                    <span>Customer:</span><span>{userDetails.name}</span>
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
                  Remaining amount to be paid at the turf
                </p>
              </div>

              {/* Pay Button */}
              <button 
                className="btn btn-primary btn-lg payment-pay-btn" 
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? '🔄 Processing Payment...' : `💳 Pay ₹${advanceAmount} Securely`}
              </button>

              {/* Security Note */}
              <p className="payment-security-note">
                🔒 Secured by Cashfree · Your payment information is encrypted and secure
              </p>

              {/* Payment Methods */}
              <div className="payment-methods">
                <p className="payment-methods__label">Accepted Payment Methods:</p>
                <div className="payment-methods__pills">
                  {PAYMENT_METHODS.map((m) => (
                    <span key={m} className="payment-method-pill">{m}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Cancel */}
            <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '520px', display: 'flex', justifyContent: 'center' }}>
              <button 
                className="btn" 
                style={{ color: '#c0392b', fontSize: '0.9rem', padding: '0.5rem 1rem' }} 
                onClick={() => navigate('/details', { state: ps })}
                disabled={isProcessing}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
