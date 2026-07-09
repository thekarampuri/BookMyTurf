import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { subscribeToTurfs } from '../services/turfService';
import type { Turf } from '../types';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTurfs((data) => {
      setTurfs(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="home page-bg">
      <Navbar transparent />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: "url('/turf_hero.png')" }}>
          <div className="hero__overlay" />
          <div className="hero__painted-text">BOOK MY TURF</div>
        </div>
        
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-main">BookMyTurf</span><br />
            <span className="hero__title-accent">Experience</span>
          </h1>
          <p className="hero__subtitle">
            Premier synthetic turf facilities offering professional-grade fields for training, leagues, and events
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/booking')}>
              Book Your Field →
            </button>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <div className="mouse-icon">
            <div className="mouse-wheel"></div>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section className="section" id="amenities">
        <div className="section__header">
          <h2 className="section__title serif">Premium Facilities</h2>
          <p className="section__subtitle">Everything you need for the perfect match, built to professional standards.</p>
        </div>
        <div className="amenities-grid">
          <div className="amenity-card">
            <div className="amenity-card__icon">🏟️</div>
            <h3 className="amenity-card__title">FIFA Approved Turf</h3>
            <p className="amenity-card__desc">Professional-grade synthetic grass imported for maximum performance and safety.</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-card__icon">💡</div>
            <h3 className="amenity-card__title">LED Floodlights</h3>
            <p className="amenity-card__desc">State-of-the-art 1000W LED lighting for crystal clear visibility during night matches.</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-card__icon">🚿</div>
            <h3 className="amenity-card__title">Locker & Showers</h3>
            <p className="amenity-card__desc">Clean, hygienic changing rooms and hot showers available for all players.</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-card__icon">🚗</div>
            <h3 className="amenity-card__title">Ample Parking</h3>
            <p className="amenity-card__desc">Dedicated secure parking space for 2-wheelers and 4-wheelers on the premises.</p>
          </div>
        </div>
      </section>

      {/* ── OUR FIELDS (PREVIEW) ── */}
      <section className="section section--alt" id="fields">
        <div className="section__header">
          <h2 className="section__title serif">Our Playing Fields</h2>
          <p className="section__subtitle">Choose from our selection of premium turfs sized perfectly for your squad.</p>
        </div>
        <div className="fields-preview">
          {isLoading ? (
            <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>Loading fields...</p>
          ) : turfs.length === 0 ? (
            <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>No fields available right now.</p>
          ) : (
            turfs.map(turf => (
              <Link to="/booking" key={turf.id} className="field-card">
                <div className="field-card__img">
                  ⚽
                </div>
                <div className="field-card__content">
                  <h3 className="field-card__title">{turf.name}</h3>
                  <span className="field-card__size">{turf.size}</span>
                  <div className="field-card__footer">
                    <span className="field-card__price">₹{turf.morningPrice || 0}<small>/hr</small></span>
                    <span className="field-card__action">Book Now →</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" id="reviews">
        <div className="section__header">
          <h2 className="section__title serif">Player Reviews</h2>
          <p className="section__subtitle">Don't just take our word for it. Here is what our community says.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-card__stars">★★★★★</div>
            <p className="testimonial-card__text">"The best turf in the city! The grass quality is exceptional and the floodlights make night games feel like a professional stadium."</p>
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar">R</div>
              <div>
                <div className="testimonial-card__name">Rahul M.</div>
                <div className="testimonial-card__role">Sunday League Captain</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-card__stars">★★★★★</div>
            <p className="testimonial-card__text">"We play here every weekend. The booking process is super smooth, and they actually enforce the rules which keeps the ground clean."</p>
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar">S</div>
              <div>
                <div className="testimonial-card__name">Siddharth K.</div>
                <div className="testimonial-card__role">Regular Player</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-card__stars">★★★★★</div>
            <p className="testimonial-card__text">"Great amenities! Having clean locker rooms and parking space makes a huge difference. Highly recommended for corporate events."</p>
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar">A</div>
              <div>
                <div className="testimonial-card__name">Amit P.</div>
                <div className="testimonial-card__role">Event Organizer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
