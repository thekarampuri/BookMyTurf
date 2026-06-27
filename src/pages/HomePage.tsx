import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

const FEATURES = [
  {
    icon: '🏟️',
    title: 'Premium Venues',
    desc: 'Handpicked FIFA-grade synthetic turfs in Pune — maintained to the highest standards.',
  },
  {
    icon: '⚡',
    title: 'Instant Booking',
    desc: 'Check real-time availability and lock your slot in under 60 seconds.',
  },
  {
    icon: '🛡️',
    title: 'Secure Payments',
    desc: 'Pay just 25% advance online via Cashfree. Remaining at the ground.',
  },
];

const PREVIEW_TURFS = [
  { id: 'turf-1', name: 'Grand Arena', size: '60 × 40 ft', tag: 'Most Popular', price: '₹900/hr' },
  { id: 'turf-2', name: 'The Pitch', size: '80 × 50 ft', tag: 'FIFA Grade', price: '₹1,000/hr' },
  { id: 'turf-3', name: 'Mini Field', size: '40 × 30 ft', tag: 'Budget Pick', price: '₹700/hr' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar transparent />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__eyebrow">Welcome to Pune's Premier Turf</p>
          <h1 className="hero__title serif">
            Play Hard.<br />
            <span className="hero__title--accent">Book Smart.</span>
          </h1>
          <p className="hero__subtitle">
            Reserve premium synthetic turf in Pune, Maharashtra.<br />
            Morning or evening — your game, your schedule.
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/booking')}>
              Book Your Field →
            </button>
            <button className="btn btn-outlined-white btn-lg">
              ▶ Watch Tour
            </button>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <span className="hero__scroll-text">Scroll</span>
          <span className="hero__scroll-arrow">↓</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="container">
          <div className="features__header">
            <h2 className="features__heading serif">Why TurfSpot?</h2>
            <p className="features__sub">Everything you need for the perfect match.</p>
          </div>
          <div className="features__grid">
            {FEATURES.map((f) => (
              <div className="features__card card" key={f.title}>
                <div className="features__icon">{f.icon}</div>
                <h3 className="features__card-title">{f.title}</h3>
                <p className="features__card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TURF PREVIEW ── */}
      <section className="turfs-preview">
        <div className="container">
          <div className="features__header">
            <h2 className="features__heading serif">Our Turfs</h2>
            <p className="features__sub">Pick the field that fits your game.</p>
          </div>
          <div className="turfs-preview__grid">
            {PREVIEW_TURFS.map((t) => (
              <div
                className="turf-preview-card card"
                key={t.id}
                onClick={() => navigate('/booking')}
              >
                <div className="turf-preview-card__img-wrap">
                  <div className="turf-preview-card__img-placeholder">⚽</div>
                  <span className="turf-preview-card__tag">{t.tag}</span>
                </div>
                <div className="turf-preview-card__body">
                  <h3 className="turf-preview-card__name">{t.name}</h3>
                  <p className="turf-preview-card__size">{t.size}</p>
                  <div className="turf-preview-card__footer">
                    <span className="turf-preview-card__price">From {t.price}</span>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="footer__logo serif">TurfSpot.</span>
            <p className="footer__tagline">Pune's favourite turf platform.</p>
          </div>
          <p className="footer__copy">© 2025 TurfSpot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
