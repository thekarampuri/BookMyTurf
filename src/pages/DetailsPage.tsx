import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingStepper from '../components/BookingStepper';
import type { Turf, TimeSlot, UserDetails } from '../types';
import './DetailsPage.css';

interface LocationState {
  turf: Turf;
  date: string;
  duration: number;
  slot: TimeSlot;
}

const TERMS = [
  'बुकिंग केल्यानंतर स्लॉट बदलण्यास परवानगी नाही. No slot changes after booking.',
  'मैदानावर येताना बुकिंग कन्फर्मेशन स्क्रीनशॉट दाखवणे आवश्यक. Show booking confirmation on arrival.',
  'स्पोर्ट्स शूज घालणे अनिवार्य आहे. Sports shoes are mandatory on the turf.',
  'मैदानावर अन्न व पाणी सोडून इतर पदार्थ आणू नयेत. No outside food except water.',
  'खेळाडूंनी स्वतःच्या जबाबदारीवर खेळणे आवश्यक. Play at your own risk.',
];

export default function DetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingState = state as LocationState | null;

  const [details, setDetails] = useState<UserDetails>({
    name: '',
    phone: '',
    email: '',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  if (!bookingState) {
    return (
      <div className="page-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No booking found. Please start over.</p>
          <button className="btn btn-primary" onClick={() => navigate('/booking')}>Go to Booking</button>
        </div>
      </div>
    );
  }

  const { turf, date, slot, duration } = bookingState;
  const bookingDate = new Date(date);
  const totalAmount = slot.price;
  const advanceAmount = Math.round(totalAmount * 0.25);
  const remainingAmount = totalAmount - advanceAmount;

  const validate = (): boolean => {
    const e: Partial<UserDetails> = {};
    if (!details.name.trim()) (e as any).name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(details.phone)) (e as any).phone = 'Enter a valid 10-digit Indian mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) (e as any).email = 'Enter a valid email address';
    if (!details.agreedToTerms) (e as any).agreedToTerms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    navigate('/payment', {
      state: {
        turf,
        date,
        duration,
        slot,
        userDetails: details,
        advanceAmount,
        totalAmount,
      },
    });
  };

  return (
    <div className="page-bg">
      <Navbar />
      <BookingStepper currentStep={2} />

      <div className="details-page container">
        <h1 className="booking-page__title serif">Your Details</h1>
        <p className="booking-page__desc" style={{ marginBottom: '2rem' }}>
          We need a few details to confirm your booking.
        </p>

        <div className="details-layout">
          {/* Form */}
          <div className="details-form-wrap">
            <div className="details-form card">
              <h2 className="details-form__heading">Contact Information</h2>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className={`form-input ${(errors as any).name ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                />
                {(errors as any).name && <span className="form-error">{(errors as any).name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  className={`form-input ${(errors as any).phone ? 'form-input--error' : ''}`}
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value.replace(/\D/g, '') })}
                />
                {(errors as any).phone && <span className="form-error">{(errors as any).phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className={`form-input ${(errors as any).email ? 'form-input--error' : ''}`}
                  type="email"
                  placeholder="e.g. rahul@email.com"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
                {(errors as any).email && <span className="form-error">{(errors as any).email}</span>}
              </div>

              {/* Terms */}
              <div className="terms-box">
                <div className="terms-box__header">
                  <span className="terms-box__icon">⚠️</span>
                  <h3 className="terms-box__heading">महत्वपूर्ण नियम व अटी (Important Terms &amp; Conditions)</h3>
                </div>
                <ul className="terms-box__list">
                  {TERMS.map((t, i) => (
                    <li key={i} className="terms-box__item">{t}</li>
                  ))}
                </ul>
                <div className="terms-box__no-refund">
                  ❌ No Refunds — Once booked, payments are non-refundable.
                </div>
              </div>

              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={details.agreedToTerms}
                    onChange={(e) => setDetails({ ...details, agreedToTerms: e.target.checked })}
                  />
                  <span>I have read and agreed to the Terms &amp; Conditions above.</span>
                </label>
                {(errors as any).agreedToTerms && (
                  <span className="form-error">{(errors as any).agreedToTerms}</span>
                )}
              </div>
            </div>

            <div className="details-actions">
              <button className="btn btn-outlined" onClick={() => navigate('/booking')}>
                ← Back
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                💳 Pay Advance &amp; Confirm
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="booking-summary card-sand">
            <h3 className="booking-summary__heading">Booking Summary</h3>
            <div className="booking-summary__rows">
              <div className="summary-row">
                <span className="summary-row__label">Turf</span>
                <span className="summary-row__value">{turf.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-row__label">Date</span>
                <span className="summary-row__value">{bookingDate.toDateString()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-row__label">Time</span>
                <span className="summary-row__value">{slot.time} → {slot.endTime}</span>
              </div>
              <div className="summary-row">
                <span className="summary-row__label">Duration</span>
                <span className="summary-row__value">{duration} hr{duration !== 1 ? 's' : ''}</span>
              </div>
              <div className="summary-row">
                <span className="summary-row__label">Total Amount</span>
                <span className="summary-row__value">₹{totalAmount}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-row--highlight">
                <span className="summary-row__label">Advance Payment (25%)</span>
                <span className="summary-row__value--highlight">₹{advanceAmount}</span>
              </div>
              <div className="summary-row">
                <span className="summary-row__label">Remaining (at turf)</span>
                <span className="summary-row__value">₹{remainingAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
