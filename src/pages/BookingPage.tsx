import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingStepper from '../components/BookingStepper';
import { TURFS, generateSlots } from '../data/turfs';
import type { Turf, TimeSlot } from '../types';
import './BookingPage.css';

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

function getFlatDates(days: number = 21): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

// Format "06:00 AM" → "6AM"
function fmtCompact(t: string): string {
  return t.replace(':00 ', '').replace(/^0/, '');
}

export default function BookingPage() {
  const navigate = useNavigate();
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [duration, setDuration] = useState<number>(1);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

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

  const canContinue = selectedTurf && selectedDate && combinedSlot;

  const handleContinue = () => {
    if (!canContinue) return;
    navigate('/details', {
      state: { turf: selectedTurf, date: selectedDate.toISOString(), duration, slot: combinedSlot },
    });
  };

  return (
    <div className="page-bg">
      <Navbar />
      <BookingStepper currentStep={1} />

      <div className="booking-page container">
        {/* Hero text */}
        <div className="booking-page__header">
          <h1 className="booking-page__title serif">Book Your Turf</h1>
          <p className="booking-page__desc">Reserve premium synthetic turf in Pune, Maharashtra</p>
          <p className="booking-page__ist">All timings are in Indian Standard Time (IST)</p>
        </div>

        {/* Contact banner */}
        <div className="contact-banner">
          <span className="contact-banner__label">📞 For Booking Assistance Contact:</span>
          <div className="contact-banner__numbers">
            <span>☎ <span style={{ color: '#8C7B75' }}>7822008270</span></span>
            <span>☎ <span style={{ color: '#8C7B75' }}>7387954545</span></span>
          </div>
        </div>

        {/* ── MAIN BOOKING CARD ── */}
        <div className="booking-main-card card">
          {/* Section 1: Choose Turf */}
        <section className="booking-section">
          <h2 className="section-heading">Choose Turf</h2>
          <div className={`turf-carousel ${selectedTurf ? 'turf-carousel--has-selection' : ''}`}>
            {TURFS.map((turf) => (
              <div
                key={turf.id}
                className={`turf-card card ${selectedTurf?.id === turf.id ? 'turf-card--selected' : ''}`}
                onClick={() => { setSelectedTurf(turf); setSelectedSlotId(null); }}
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

        {/* Section 2: Select Date — Horizontal Carousel */}
        <section className="booking-section">
          <h2 className="section-heading">Select Date</h2>
          <div className="date-carousel">
            {dates.map((date) => {
              const isToday = date.getTime() === today.getTime();
              const isSelected = selectedDate.getTime() === date.getTime();
              const dayStr = isToday ? 'Today' : DAYS[date.getDay()];
              return (
                <button
                  key={date.toISOString()}
                  className={`date-carousel-btn${isSelected ? ' date-carousel-btn--selected' : ''}`}
                  onClick={() => { setSelectedDate(date); setSelectedSlotId(null); }}
                >
                  <span className="date-carousel-btn__day">{dayStr}</span>
                  <span className="date-carousel-btn__num">{date.getDate()}</span>
                  <span className="date-carousel-btn__month">{MONTHS[date.getMonth()]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Duration */}
        <section className="booking-section">
          <h2 className="section-heading">Select Duration</h2>
          <div className="duration-pills">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                className={`duration-pill ${duration === d.value ? 'duration-pill--selected' : ''}`}
                onClick={() => { setDuration(d.value); setSelectedSlotId(null); }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Time Slots */}
        {selectedTurf ? (
          <section className="booking-section">
            <h2 className="section-heading">Select Time Slots ({duration} {duration === 1 ? 'hour' : 'hours'})</h2>
            <div className="slots-grid-wrap">
              <div className="slots-grid">
                {slots.map((slot, index) => {
                  const label = `${fmtCompact(slot.time)} to ${fmtCompact(slot.endTime)}`;
                  const isSelected = selectedIndices.includes(index);
                  
                  // Can this slot be selected? Check if it has enough consecutive available slots
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
                      className={`slot-card${slot.isBooked || !isSelectable ? ' slot-card--booked' : ''}${isSelected ? ' slot-card--selected' : ''}${positionClass}`}
                      disabled={slot.isBooked || !isSelectable}
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      <span className="slot-card__time">{label}</span>
                      {slot.isBooked ? (
                        <span className="badge-booked">Booked</span>
                      ) : !isSelectable ? (
                        <span className="badge-booked" style={{color: 'var(--text-muted)'}}>N/A</span>
                      ) : (
                        <span className="slot-card__price">₹{slot.price}/hr</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <div className="select-turf-prompt">
            👆 Please select a turf above to view available time slots.
          </div>
        )}

        </div> {/* End of booking-main-card */}
        
        {/* Sticky Floating Footer */}
        {combinedSlot && (
          <div className="floating-summary-bar">
            <div className="floating-summary-bar__inner">
              <div className="floating-summary-bar__info">
                <span className="floating-summary-bar__label">Selected:</span>
                <span className="floating-summary-bar__value">
                  {selectedTurf?.name} · {fmtCompact(combinedSlot.time)} to {fmtCompact(combinedSlot.endTime)}
                </span>
                <span className="floating-summary-bar__price">₹{combinedSlot.price}</span>
              </div>
              <button
                className="btn btn-primary btn-lg booking-continue-btn"
                disabled={!canContinue}
                onClick={handleContinue}
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
