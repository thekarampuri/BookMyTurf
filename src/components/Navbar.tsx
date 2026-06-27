import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  const isHero = transparent && !scrolled;

  return (
    <nav className={`navbar ${isHero ? 'navbar--transparent' : 'navbar--solid'}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚽</span>
          <span className="navbar__logo-text serif">TurfNine</span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <a href="#about" className="navbar__link">About</a>
          <Link to="/booking" className={`navbar__link ${location.pathname.startsWith('/booking') || location.pathname.startsWith('/details') || location.pathname.startsWith('/payment') ? 'active' : ''}`}>
            Booking
          </Link>
          <a href="#contact" className="navbar__link">Contact</a>
          <button className="btn btn-primary btn-nav" onClick={() => navigate('/booking')}>
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}
