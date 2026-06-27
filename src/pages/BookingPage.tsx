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

function get3WeekGrid(): (Date | null)[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build 3 weeks (21 days) starting from today
  const allDates: Date[] = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    allDates.push(d);
  }

  // Pad the start so first date aligns to its weekday column
  const firstDay = allDates[0].getDay(); // 0=Sun
  const grid: (Date | null)[][] = [];
  let row: (Date | null)[] = Array(firstDay).fill(null);

  for (const d of allDates) {
    row.push(d);
    if (row.length === 7) {
      grid.push(row);
      row = [];
    }
  }
  // Pad last row
  if (row.length > 0) {
    while (row.length < 7) row.push(null);
    grid.push(row);
  }
  return grid;
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

  const grid = useMemo(() => get3WeekGrid(), []);
  
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
          <div className="turf-cards">
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

        {/* Section 2: Select Date — 7-column calendar grid */}
        <section className="booking-section">
          <h2 className="section-heading">Select Date</h2>
          <div className="cal-grid-wrap">
            {/* Day headers */}
            <div className="cal-header">
              {DAYS.map((d) => (
                <span key={d} className={`cal-header__day ${d === 'Sun' ? 'cal-header__day--sun' : ''}`}>{d}</span>
              ))}
            </div>
            {/* Date rows */}
            {grid.map((week, wi) => (
              <div key={wi} className="cal-row">
                {week.map((date, di) => {
                  if (!date) return <div key={di} className="date-cell date-cell--empty" />;
                  const isSunday = date.getDay() === 0;
                  const isToday = date.getTime() === today.getTime();
                  const isSelected = selectedDate.getTime() === date.getTime();
                  return (
                    <button
                      key={date.toISOString()}
                      className={`date-cell${isSelected ? ' date-cell--selected' : ''}${isSunday ? ' date-cell--sunday' : ''}${isToday ? ' date-cell--today' : ''}`}
                      onClick={() => { setSelectedDate(date); setSelectedSlotId(null); }}
                    >
                      <span className="date-cell__num">{date.getDate()}</span>
                      <span className="date-cell__month">{MONTHS[date.getMonth()]}</span>
                    </button>
                  );
                })}
              </div>
            ))}
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

                  return (
                    <button
                      key={slot.id}
                      className={`slot-card${slot.isBooked || !isSelectable ? ' slot-card--booked' : ''}${isSelected ? ' slot-card--selected' : ''}`}
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

        {/* Continue */}
        <div className="booking-page__footer">
          {combinedSlot && (
            <div className="selected-summary">
              <span className="selected-summary__label">Selected:</span>
              <span className="selected-summary__value">
                {selectedTurf?.name} · {fmtCompact(combinedSlot.time)} to {fmtCompact(combinedSlot.endTime)} · <strong>₹{combinedSlot.price}</strong>
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button
              className="btn btn-primary btn-lg booking-continue-btn"
              disabled={!canContinue}
              onClick={handleContinue}
              style={{ padding: '0.6rem 3rem' }}
            >
              Continue
            </button>
          </div>
        </div>
        </div> {/* End of booking-main-card */}
      </div>
    </div>
  );
}
