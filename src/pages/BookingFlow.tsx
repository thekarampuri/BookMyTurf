import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Stepper, { Step } from '../components/Stepper';
import { TURFS, generateSlots } from '../data/turfs';
import type { Turf, TimeSlot } from '../types';
import './BookingPage.css';
import './DetailsPage.css';
import './PaymentPage.css';

const DURATIONS = [
  { label: '1 hour', value: 1 },
  { label: '2 hours', value: 2 },
  { label: '3 hours', value: 3 },
  { label: '4 hours', value: 4 },
  { label: '5 hours', value: 5 },
  { label: '6 hours', value: 6 },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PAYMENT_METHODS = ['💳 Cards', '🏦 Net Banking', '📱 UPI', '👛 Wallets'];
const EVENT_TYPES = ['Football', 'Cricket', 'Badminton', 'Volleyball', 'Corporate Event', 'Other'];
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

function getFlatDates(days: number = 21): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

function fmtCompact(t: string): string {
  return t.replace(':00 ', '').replace(/^0/, '');
}

function useSessionState<T>(key: string, initialValue: T, reviver?: (val: any) => T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        return reviver ? reviver(parsed) : parsed;
      }
    } catch(e) {}
    return initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default function BookingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useSessionState('bf_step', 1);

  // --- Step 1 State ---
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [selectedTurf, setSelectedTurf] = useSessionState<Turf | null>('bf_turf', null);
  const [selectedDate, setSelectedDate] = useSessionState<Date>('bf_date', today, (v) => new Date(v));
  const [duration, setDuration] = useSessionState<number>('bf_duration', 1);
  const [selectedSlotId, setSelectedSlotId] = useSessionState<string | null>('bf_slot', null);

  const dates = useMemo(() => getFlatDates(), []);
  
  const { slots, combinedSlot, selectedIndices } = useMemo(() => {
    if (!selectedTurf) return { slots: [], combinedSlot: null, selectedIndices: [] };
    const s = generateSlots(selectedTurf, selectedDate);
    
    let combined: TimeSlot | null = null;
    let indices: number[] = [];

    if (selectedSlotId) {
      const idx = s.findIndex(slot => slot.id === selectedSlotId);
      if (idx !== -1) {
        const chunk = s.slice(idx, idx + duration);
        if (chunk.length === duration && !chunk.some(c => c.isBooked)) {
          indices = chunk.map((_, i) => idx + i);
          combined = {
            id: selectedSlotId,
            time: chunk[0].time,
            endTime: chunk[chunk.length - 1].endTime,
            price: chunk.reduce((sum, c) => sum + c.price, 0),
            isBooked: false,
            isPrime: chunk[0].isPrime
          };
        }
      }
    }
    return { slots: s, combinedSlot: combined, selectedIndices: indices };
  }, [selectedTurf, selectedDate, duration, selectedSlotId]);

  // --- Step 2 State ---
  const [details, setDetails] = useSessionState('bf_details', {
    name: '', phone: '', email: '', participants: '', eventType: '', specialRequests: '', agreedToTerms: false
  });
  const [errors, setErrors] = useState<{name?: string; phone?: string; email?: string}>({});
  const isPhoneValid = details.phone.length === 10 && /^[6-9]\d{9}$/.test(details.phone);
  const isEmailValid = !details.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email);

  const advanceAmount = combinedSlot ? Math.round(combinedSlot.price * 0.25) : 0;
  
  // --- Step 3 State ---
  const TOTAL_SECONDS = 600;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [expired, setExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (currentStep !== 3 || isProcessing) return;
    if (secondsLeft <= 0) { setExpired(true); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [currentStep, secondsLeft, isProcessing]);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(4);
    }, 2000);
  };

  // --- Stepper Navigation Control ---
  let isNextDisabled = false;
  if (currentStep === 1) isNextDisabled = !selectedTurf || !combinedSlot;
  if (currentStep === 2) isNextDisabled = !details.agreedToTerms || !isPhoneValid || !details.name || !isEmailValid;
  if (currentStep === 3) isNextDisabled = true; // Handled manually by "Pay" button
  if (currentStep === 4) isNextDisabled = true; // Completed

  const handleStepChange = (newStep: number) => {
    // Basic validation to prevent skipping forward
    if (newStep === 2 && (!selectedTurf || !combinedSlot)) return;
    if (newStep === 3 && (!details.agreedToTerms || !isPhoneValid || !details.name || !isEmailValid)) {
      if (!details.name) setErrors(e => ({ ...e, name: 'Name is required' }));
      if (!isPhoneValid) setErrors(e => ({ ...e, phone: 'Valid 10-digit number required' }));
      if (!isEmailValid) setErrors(e => ({ ...e, email: 'Enter a valid email address' }));
      return;
    }
    setCurrentStep(newStep);
  };

  return (
    <div className="page-bg">
      <Navbar />
      <div className="booking-flow-container container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <Stepper
          initialStep={1}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          stepLabels={['Choose Time', 'Your Details', 'Payment', 'Confirmation']}
          disableStepIndicators={isProcessing || currentStep === 4}
          backButtonText="Back"
          nextButtonText={currentStep === 1 ? "Proceed to Details" : "Proceed to Payment"}
          nextButtonProps={{ disabled: isNextDisabled, style: currentStep >= 3 ? {display: 'none'} : {} }}
          backButtonProps={{ style: currentStep >= 3 ? {display: 'none'} : {} }}
        >
          {/* STEP 1: CHOOSE TIME */}
          <Step>
            <div className="booking-main-card">
              <section className="booking-section">
                <h2 className="section-heading">Choose Turf</h2>
                <div className={`turf-carousel ${selectedTurf ? 'turf-carousel--has-selection' : ''}`}>
                  {TURFS.map((turf) => (
                    <div
                      key={turf.id}
                      className={`turf-card ${selectedTurf?.id === turf.id ? 'turf-card--selected' : ''}`}
                      onClick={() => { setSelectedTurf(turf); setSelectedSlotId(null); }}
                    >
                      <div className="turf-card__header">
                        <div>
                          <h3 className="turf-card__name">{turf.name}</h3>
                          <span className="turf-card__size">{turf.size}</span>
                        </div>
                        <div className="turf-card__price-wrap">
                          <span className="turf-card__price">₹{turf.basePrice}<small>/hr</small></span>
                          <span className="turf-card__price-note">Starting</span>
                        </div>
                      </div>
                      <div className="turf-card__amenities">
                        {turf.amenities.map(am => <span key={am} className="turf-card__amenity">{am}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="booking-section">
                <h2 className="section-heading">Select Date</h2>
                <div className="date-carousel">
                  {dates.map((date) => {
                    const isToday = date.getTime() === today.getTime();
                    const isSelected = selectedDate.getTime() === date.getTime();
                    return (
                      <button
                        key={date.toISOString()}
                        className={`date-carousel-btn${isSelected ? ' date-carousel-btn--selected' : ''}`}
                        onClick={() => { setSelectedDate(date); setSelectedSlotId(null); }}
                      >
                        <span className="date-carousel-btn__day">{isToday ? 'Today' : DAYS[date.getDay()]}</span>
                        <span className="date-carousel-btn__num">{date.getDate()}</span>
                        <span className="date-carousel-btn__month">{MONTHS[date.getMonth()]}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="booking-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                  <h2 className="section-heading" style={{ margin: 0 }}>Duration</h2>
                  {combinedSlot && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Total: <strong style={{ color: 'var(--burgundy)', fontSize: '1rem' }}>₹{combinedSlot.price}</strong>
                    </span>
                  )}
                </div>
                <div className="duration-pills">
                  {DURATIONS.map((dur) => (
                    <button
                      key={dur.value}
                      className={`duration-pill ${duration === dur.value ? 'duration-pill--selected' : ''}`}
                      onClick={() => { setDuration(dur.value); setSelectedSlotId(null); }}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="booking-section">
                <h2 className="section-heading">Available Slots</h2>
                {!selectedTurf ? (
                  <p className="select-turf-prompt">Please choose a turf above to see available time slots.</p>
                ) : (
                  <div className="slots-grid-wrap">
                    <div className="slots-grid">
                      {slots.map((slot, index) => {
                        const label = `${fmtCompact(slot.time)} to ${fmtCompact(slot.endTime)}`;
                        const isSelected = selectedIndices.includes(index);
                        const chunk = slots.slice(index, index + duration);
                        const isSelectable = chunk.length === duration && !chunk.some(c => c.isBooked);
                        
                        let positionClass = '';
                        if (isSelected && duration > 1) {
                          if (index === selectedIndices[0]) positionClass = ' slot-card--selected-start';
                          else if (index === selectedIndices[selectedIndices.length - 1]) positionClass = ' slot-card--selected-end';
                          else positionClass = ' slot-card--selected-middle';
                        }

                        return (
                          <button
                            key={slot.id}
                            className={`slot-card${slot.isBooked ? ' slot-card--booked' : ''}${isSelected ? ' slot-card--selected' : ''}${positionClass}`}
                            onClick={() => {
                              if (slot.isBooked) return;
                              if (!isSelectable) {
                                if (index + duration > slots.length) {
                                  alert(`Cannot book ${duration} hours starting at ${fmtCompact(slot.time)} because the turf closes before your session ends.`);
                                } else {
                                  alert(`Cannot book ${duration} hours starting at ${fmtCompact(slot.time)} because subsequent slots are already booked.`);
                                }
                                return;
                              }
                              setSelectedSlotId(slot.id);
                            }}
                          >
                            <span className="slot-card__time">{label}</span>
                            {slot.isBooked ? (
                              <span className="badge-booked">Booked</span>
                            ) : (
                              <span className="slot-card__price">₹{slot.price}/hr</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </Step>

          {/* STEP 2: YOUR DETAILS */}
          <Step>
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
                    onChange={(e) => {
                      setDetails({ ...details, name: e.target.value });
                      if (e.target.value) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className={`form-input${errors.email ? ' form-input--error' : ''}`}
                    type="email"
                    placeholder="Enter your email (optional)"
                    value={details.email}
                    onChange={(e) => {
                      setDetails({ ...details, email: e.target.value });
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className={`form-input${errors.phone ? ' form-input--error' : (isPhoneValid ? ' form-input--valid' : '')}`}
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    maxLength={10}
                    value={details.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setDetails({ ...details, phone: val });
                      if (val.length === 10 && /^[6-9]\d{9}$/.test(val)) setErrors(prev => ({ ...prev, phone: undefined }));
                    }}
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
              
              <div className="booking-summary-box">
                <h3 className="booking-summary__heading">Booking Summary</h3>
                <div className="booking-summary__rows">
                  <div className="summary-row">
                    <span className="summary-row__label">Turf</span>
                    <span className="summary-row__value">{selectedTurf?.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-row__label">Date</span>
                    <span className="summary-row__value">{selectedDate.toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-row__label">Time</span>
                    <span className="summary-row__value">{combinedSlot ? `${fmtCompact(combinedSlot.time)} to ${fmtCompact(combinedSlot.endTime)}` : ''}</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row summary-row--highlight">
                    <span className="summary-row__label">Advance Payable (25%)</span>
                    <span className="summary-row__value summary-row__value--highlight">₹{advanceAmount}</span>
                  </div>
                </div>
              </div>

              <div className="terms-box">
                <div className="terms-box__header">
                  <span className="terms-box__icon">⚠️</span>
                  <span className="terms-box__heading">Important Rules & Terms (Marathi)</span>
                </div>
                <ul className="terms-box__list">
                  {TERMS_MARATHI.map((term, i) => (
                    <li key={i} className="terms-box__item">{term}</li>
                  ))}
                </ul>
                <div className="terms-box__no-refund">
                  ❌ No Cancellation & No Refund Policy Applicable
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
                  <span>I have read and agree to the rules, terms and conditions, and understand the no-refund policy.</span>
                </label>
              </div>
            </div>
          </Step>

          {/* STEP 3: PAYMENT */}
          <Step>
            {expired ? (
              <div className="expired-card card">
                <div className="expired-card__icon">⏰</div>
                <h2 className="expired-card__title serif">Slot Hold Expired</h2>
                <p className="expired-card__desc">Your 10-minute slot hold has expired.</p>
                <button className="btn btn-primary btn-lg" onClick={() => { setSecondsLeft(TOTAL_SECONDS); setExpired(false); setCurrentStep(1); }}>
                  Start New Booking
                </button>
              </div>
            ) : (
              <div className="payment-card card" style={{ margin: '0 auto' }}>
                <div className="payment-card__icon-wrap">
                  <div className="payment-card__icon">💳</div>
                </div>
                <h1 className="payment-card__title serif">Complete Payment</h1>
                <p className="payment-card__subtitle">Secure advance payment for your turf booking</p>

                <div className="countdown-wrap">
                  <div className="countdown-header">
                    <span className="countdown-label">Complete Payment Within</span>
                    <span className={`countdown-timer ${secondsLeft < 120 ? 'countdown-timer--pulse' : ''}`}>
                      {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="countdown-bar-track">
                    <div
                      className={`countdown-bar-fill ${secondsLeft < 120 ? 'countdown-bar-fill--urgent' : ''}`}
                      style={{ width: `${((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100}%` }}
                    />
                  </div>
                  <p className="countdown-note" style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                    Your slot is temporarily reserved. Complete payment to confirm your booking.
                  </p>
                </div>

                <div className="advance-highlight">
                  <div className="advance-highlight__row">
                    <span className="advance-highlight__label">Advance Payment (25%)</span>
                    <span className="advance-highlight__amount">₹{advanceAmount}</span>
                  </div>
                  <p className="advance-highlight__note">Remaining amount to be paid at the turf</p>
                </div>

                <button 
                  className="btn btn-primary btn-lg payment-pay-btn" 
                  onClick={handlePay}
                  disabled={isProcessing}
                >
                  {isProcessing ? '🔄 Processing...' : `💳 Pay ₹${advanceAmount} Securely`}
                </button>
                <p className="payment-security-note">🔒 Secured by Cashfree</p>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button className="btn" style={{ color: '#c0392b', fontSize: '0.9rem' }} onClick={() => setCurrentStep(2)} disabled={isProcessing}>
                    Cancel & Go Back
                  </button>
                </div>
              </div>
            )}
          </Step>

          {/* STEP 4: CONFIRMATION */}
          <Step>
            <div className="expired-card card" style={{ borderColor: '#2e7d32', backgroundColor: 'rgba(46, 125, 50, 0.05)', margin: '0 auto' }}>
              <div className="expired-card__icon">✅</div>
              <h2 className="expired-card__title serif" style={{ color: '#2e7d32' }}>Booking Confirmed!</h2>
              <p className="expired-card__desc">
                Your payment of ₹{advanceAmount} was successful. A confirmation email has been sent to {details.email || 'your email'}.
              </p>
              <div className="payment-details__rows" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', textAlign: 'left', width: '100%' }}>
                <div className="payment-detail-row">
                  <span>Field:</span><span style={{ fontWeight: 600 }}>{selectedTurf?.name}</span>
                </div>
                <div className="payment-detail-row">
                  <span>Date:</span><span>{selectedDate.toLocaleDateString('en-IN')}</span>
                </div>
                <div className="payment-detail-row">
                  <span>Time:</span><span>{combinedSlot ? `${fmtCompact(combinedSlot.time)} to ${fmtCompact(combinedSlot.endTime)}` : ''}</span>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          </Step>

        </Stepper>
      </div>
      <Footer />
    </div>
  );
}
