import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon">⚽</span>
            <span className="footer__logo-text serif">BookMyTurf</span>
          </Link>
          <p className="footer__desc">
            Premier synthetic turf facilities offering professional-grade fields for training, leagues, and casual games. Book your perfect pitch today.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social-link" aria-label="Instagram">IG</a>
            <a href="#" className="footer__social-link" aria-label="Facebook">FB</a>
            <a href="#" className="footer__social-link" aria-label="Twitter">X</a>
          </div>
        </div>
        
        <div className="footer__links-group">
          <h4 className="footer__heading">Quick Links</h4>
          <ul className="footer__list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/booking">Book a Turf</Link></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#amenities">Amenities</a></li>
          </ul>
        </div>
        
        <div className="footer__links-group">
          <h4 className="footer__heading">Legal</h4>
          <ul className="footer__list">
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#refund">Cancellation Policy</a></li>
          </ul>
        </div>
        
        <div className="footer__links-group">
          <h4 className="footer__heading">Contact Us</h4>
          <ul className="footer__list footer__list--contact">
            <li>📍 123 Sports Arena, Mumbai, Maharashtra</li>
            <li>📞 <a href="tel:+919876543210">+91 98765 43210</a></li>
            <li>✉️ <a href="mailto:hello@bookmyturf.in">hello@bookmyturf.in</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>&copy; {new Date().getFullYear()} BookMyTurf. All rights reserved.</span>
          <span>Made for champions 🏆</span>
        </div>
      </div>
    </footer>
  );
}
