import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home page-bg">
      <Navbar transparent />

      {/* ── HERO ── */}
      <section className="hero">
        {/* Background Turf Image with dark warm overlay */}
        <div className="hero__bg" style={{ backgroundImage: "url('/turf_hero.png')" }}>
          <div className="hero__overlay" />
          <div className="hero__painted-text">TURF NINE</div>
        </div>
        
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-main">TurfNine</span><br />
            <span className="hero__title-accent">Experience</span>
          </h1>
          <p className="hero__subtitle">
            Premier synthetic turf facilities offering professional-grade fields for training, leagues, and events
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
          <div className="mouse-icon">
            <div className="mouse-wheel"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
