import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingStepper from '../components/BookingStepper';
import type { Turf, TimeSlot } from '../types';
import './DetailsPage.css';

interface LocationState {
  turf: Turf;
  date: string;
  duration: number;
  slot: TimeSlot;
}

const TERMS_MARATHI = [
  'ग्राउंड मध्ये पुढल्यास टीमला बाहेर काढण्यात येईल.',
  'बुकिंग करताना कंपल्सरी ऐडव्हान्स करणे.',
  'बुकिंग कॅन्सल होणार नाही.',
  'ग्राउंड बाँड देत नाही.',
  'ग्राउंड मध्ये बाहेर अलाउंड नाहीये.',
  'ग्राउंड मध्ये बाहेरून आणून काही पदार्थ खाऊ नये.',
  'ग्राउंड मध्ये तुमची कोणती वस्तू राहिली तरी ग्राउंड जबाबदार राहणार नाही.',
  'ग्राउंड क्रिकेट फुटबॉल खेळण्यासाठी आहे कोणतेही इतर इव्हेंट करण्यासाठी ग्राउंड देत नाही.',
  'ग्राउंड ची पूर्ण माहिती बुकिंग करताना पूर्णपणे समजून घेणे नंतर तक्रार चालणार नाही.',
  'ग्राउंड बुक करताना जो वेळ दिला आहे त्या वेळेतच तुम्ही पोहोचणे - बाहेर येण्याचा टाइमिंग जो आहे त्या बाहेर येणे.',
  'Turf मध्ये जाण्याच्या आधी पेमेंट ऑफिसमध्ये जमा करणे.',
];

const EVENT_TYPES = ['Football', 'Cricket', 'Badminton', 'Volleyball', 'Corporate Event', 'Other'];

interface UserDetailsForm {
  name: string;
  phone: string;
  email: string;
  participants: string;
  eventType: string;
  specialRequests: string;
  agreedToTerms: boolean;
}

export default function DetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingState = state as LocationState | null;

  const [details, setDetails] = useState<UserDetailsForm>({
    name: '',
    phone: '',
    email: '',
    participants: '',
    eventType: '',
    specialRequests: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserDetailsForm, string>>>({});

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

  // Compact format: "06:00 AM" → "6AM"
  const fmt = (t: string) => t.replace(':00 ', '').replace(/^0/, '');

  const validate = (): boolean => {
    const e: Partial<Record<keyof UserDetailsForm, string>> = {};
    if (!details.name.trim()) e.name = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(details.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!details.agreedToTerms) e.agreedToTerms = 'You must accept the terms & conditions';
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
        <div className="details-layout">
          {/* ── FORM ── */}
          <div className="details-form-wrap">
            <div className="details-form card">
              <h2 className="details-form__heading">Your Details</h2>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className={`form-input${errors.name ? ' form-input--error' : ''}`}
                    type="text"
                    placeholder="Enter your full name"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Enter your email (optional)"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className={`form-input${errors.phone ? ' form-input--error' : ''}`}
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    maxLength={10}
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value.replace(/\D/g, '') })}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Participants</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="How many people? (optional)"
                    min="1"
                    value={details.participants}
                    onChange={(e) => setDetails({ ...details, participants: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select
                  className="form-input"
                  value={details.eventType}
                  onChange={(e) => setDetails({ ...details, eventType: e.target.value })}
                >
                  <option value="">Select event type (optional)</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Special Requests</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Any special requirements or equipment needed?"
                  rows={3}
                  value={details.specialRequests}
                  onChange={(e) => setDetails({ ...details, specialRequests: e.target.value })}
                />
              </div>

              {/* Terms */}
              <div className="terms-box">
                <div className="terms-box__header">
                  <span className="terms-box__icon">⚠</span>
                  <h3 className="terms-box__heading">
                    महत्वपूर्ण नियम व अटी (Important Terms &amp; Conditions)
                  </h3>
                </div>
                <ul className="terms-box__list">
                  {TERMS_MARATHI.map((t, i) => (
                    <li key={i} className="terms-box__item">{t}</li>
                  ))}
                </ul>
                <div className="terms-box__no-refund">
                  ⊘ कुठल्याही परिस्थितीत बुकिंग रक्कम परत केली जाणार नाही (No refunds under any circumstances)
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
                  <span>मी वरील सर्व नियम व अटी वाचल्या आहेत आणि त्या मान्य आहेत (I have read and accept all the above terms and conditions) *</span>
                </label>
                {errors.agreedToTerms && <span className="form-error">{errors.agreedToTerms}</span>}
              </div>
            </div>

            {/* Booking Summary (below form on mobile) */}
            <div className="booking-summary card-sand details-summary-mobile">
              <BookingSummary
                turf={turf}
                bookingDate={bookingDate}
                slot={slot}
                duration={duration}
                totalAmount={totalAmount}
                advanceAmount={advanceAmount}
                remainingAmount={remainingAmount}
                fmt={fmt}
              />
            </div>

            <div className="details-actions">
              <button className="btn btn-outlined" onClick={() => navigate('/booking')}>
                Back
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                💳 Pay Advance &amp; Confirm
              </button>
            </div>
          </div>

          {/* ── SUMMARY SIDEBAR ── */}
          <div className="booking-summary card-sand details-summary-desktop">
            <BookingSummary
              turf={turf}
              bookingDate={bookingDate}
              slot={slot}
              duration={duration}
              totalAmount={totalAmount}
              advanceAmount={advanceAmount}
              remainingAmount={remainingAmount}
              fmt={fmt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Summary sub-component ──
interface SummaryProps {
  turf: Turf;
  bookingDate: Date;
  slot: TimeSlot;
  duration: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  fmt: (t: string) => string;
}

function BookingSummary({ turf, bookingDate, slot, duration, totalAmount, advanceAmount, remainingAmount, fmt }: SummaryProps) {
  return (
    <>
      <h3 className="booking-summary__heading">Booking Summary</h3>
      <div className="booking-summary__rows">
        <div className="summary-row">
          <span className="summary-row__label">Field:</span>
          <span className="summary-row__value">{turf.name}</span>
        </div>
        <div className="summary-row">
          <span className="summary-row__label">Date:</span>
          <span className="summary-row__value">{bookingDate.toLocaleDateString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span className="summary-row__label">Time Slots:</span>
          <span className="summary-row__value">{fmt(slot.time)} to {fmt(slot.endTime)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-row__label">Duration:</span>
          <span className="summary-row__value">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-row">
          <span className="summary-row__label">Total Amount:</span>
          <span className="summary-row__value">₹{totalAmount}</span>
        </div>
        <div className="summary-row summary-row--highlight">
          <span>Advance Payment (25%):</span>
          <span className="summary-row__value--highlight">₹{advanceAmount}</span>
        </div>
        <div className="summary-row">
          <span className="summary-row__label">Remaining (Pay at turf):</span>
          <span className="summary-row__value">₹{remainingAmount}</span>
        </div>
      </div>
    </>
  );
}
