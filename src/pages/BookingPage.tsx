import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingStepper from '../components/BookingStepper';
import { TURFS, generateSlots } from '../data/turfs';
import type { Turf, TimeSlot } from '../types';
import './BookingPage.css';

const DURATIONS = [
  { label: '30 min', value: 0.5 },
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
];

function getDateRange(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates: Date[] = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function BookingPage() {
  const navigate = useNavigate();
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [duration, setDuration] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const dates = useMemo(() => getDateRange(), []);
  const slots = useMemo(() => {
    if (!selectedTurf) return [];
    return generateSlots(selectedTurf, selectedDate, duration);
  }, [selectedTurf, selectedDate, duration]);

  const canContinue = selectedTurf && selectedDate && selectedSlot;

  const handleContinue = () => {
    if (!canContinue) return;
    navigate('/details', {
      state: {
        turf: selectedTurf,
        date: selectedDate.toISOString(),
        duration,
        slot: selectedSlot,
      },
    });
  };

  return (
    <div className="page-bg">
      <Navbar />
      <BookingStepper currentStep={1} />

      <div className="booking-page container">
        {/* Contact banner */}
        <div className="contact-banner">
          <span className="contact-banner__icon">📞</span>
          <p className="contact-banner__text">
            Need help? Call us: <strong style={{ color: 'var(--burgundy)' }}>+91 98765 43210</strong>
          </p>
        </div>

        <div className="booking-page__subtitle">
          <h1 className="booking-page__title serif">Reserve Your Slot</h1>
          <p className="booking-page__desc">Reserve premium synthetic turf in Pune, Maharashtra</p>
          <p className="booking-page__ist">🕐 All timings are in Indian Standard Time (IST)</p>
        </div>

        {/* Section 1: Choose Turf */}
        <section className="booking-section">
          <h2 className="section-heading">① Choose Turf</h2>
          <div className="turf-cards">
            {TURFS.map((turf) => (
              <div
                key={turf.id}
                className={`turf-card card ${selectedTurf?.id === turf.id ? 'turf-card--selected' : ''}`}
                onClick={() => { setSelectedTurf(turf); setSelectedSlot(null); }}
              >
                <div className="turf-card__header">
                  <div>
                    <h3 className="turf-card__name">{turf.name}</h3>
                    <p className="turf-card__size">{turf.size} · {turf.surface}</p>
                  </div>
                  <div className="turf-card__price-wrap">
                    <span className="turf-card__price">₹{turf.morningPrice}<small>/hr</small></span>
                    <span className="turf-card__price-note">morning</span>
                  </div>
                </div>
                <div className="turf-card__amenities">
                  {turf.amenities.map((a) => (
                    <span key={a} className="turf-card__amenity">✓ {a}</span>
                  ))}
                </div>
                {selectedTurf?.id === turf.id && (
                  <div className="turf-card__selected-badge">Selected ✓</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Select Date */}
        <section className="booking-section">
          <h2 className="section-heading">② Select Date</h2>
          <div className="date-grid-wrap">
            <div className="date-grid">
              {dates.map((date) => {
                const isSunday = date.getDay() === 0;
                const isToday = date.getTime() === today.getTime();
                const isSelected = selectedDate.getTime() === date.getTime();
                return (
                  <button
                    key={date.toISOString()}
                    className={`date-cell ${isSelected ? 'date-cell--selected' : ''} ${isSunday ? 'date-cell--sunday' : ''} ${isToday ? 'date-cell--today' : ''}`}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                  >
                    <span className="date-cell__day">{DAYS[date.getDay()]}</span>
                    <span className="date-cell__num">{date.getDate()}</span>
                    <span className="date-cell__month">{MONTHS[date.getMonth()]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Duration */}
        <section className="booking-section">
          <h2 className="section-heading">③ Select Duration</h2>
          <div className="duration-pills">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                className={`duration-pill ${duration === d.value ? 'duration-pill--selected' : ''}`}
                onClick={() => { setDuration(d.value); setSelectedSlot(null); }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Time Slots */}
        {selectedTurf ? (
          <section className="booking-section">
            <h2 className="section-heading">④ Choose Time Slot</h2>
            <div className="slots-legend">
              <span className="legend-item"><span className="legend-dot dot-available" />Available</span>
              <span className="legend-item"><span className="legend-dot dot-booked" />Booked</span>
              <span className="legend-item"><span className="legend-dot dot-selected" />Selected</span>
            </div>
            <div className="slots-grid">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  className={`slot-card ${slot.isBooked ? 'slot-card--booked' : ''} ${selectedSlot?.id === slot.id ? 'slot-card--selected' : ''}`}
                  disabled={slot.isBooked}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <span className="slot-card__time">{slot.time}</span>
                  <span className="slot-card__end">→ {slot.endTime}</span>
                  {slot.isBooked ? (
                    <span className="badge-booked">Booked</span>
                  ) : (
                    <span className="slot-card__price">₹{slot.price}</span>
                  )}
                  {slot.isPrime && !slot.isBooked && (
                    <span className="slot-card__prime">Prime</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="select-turf-prompt">
            <span>👆 Please select a turf above to view available time slots.</span>
          </div>
        )}

        {/* Continue Button */}
        <div className="booking-page__footer">
          {selectedSlot && (
            <div className="selected-summary">
              <span className="selected-summary__label">Selected:</span>
              <span className="selected-summary__value">{selectedTurf?.name} · {selectedSlot.time} → {selectedSlot.endTime} · <strong>₹{selectedSlot.price}</strong></span>
            </div>
          )}
          <button
            className="btn btn-primary btn-lg booking-continue-btn"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue to Details →
          </button>
        </div>
      </div>
    </div>
  );
}
