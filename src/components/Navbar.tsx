import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', newTheme);
  };

  const isHero = transparent && !scrolled;

  return (
    <nav className={`navbar ${isHero ? 'navbar--transparent' : 'navbar--solid'}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚽</span>
          <span className="navbar__logo-text serif">BookMyTurf</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </button>
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
      </div>
    </nav>
  );
}
