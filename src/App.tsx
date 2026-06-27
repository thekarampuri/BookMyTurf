import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="hero">
        <nav className="navbar">
          <div className="logo">TurfSpot</div>
          <div className="nav-links">
            <button className="nav-link">Home</button>
            <button className="nav-link">Turfs</button>
            <button className="btn-primary">Book Now</button>
          </div>
        </nav>
        <div className="hero-content">
          <h1 className="hero-title">Play Anytime, Anywhere.</h1>
          <p className="hero-subtitle">Book premium turfs instantly and elevate your game with ease.</p>
          <div className="hero-actions">
            <button className="btn-primary large">Explore Turfs</button>
            <button className="btn-secondary large">How it Works</button>
          </div>
        </div>
      </header>

      <section className="features-section">
        <h2 className="section-title">Why Choose TurfSpot?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏟️</div>
            <h3>Premium Venues</h3>
            <p>Access handpicked, top-quality turfs near you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>No more waiting. See real-time availability and book in seconds.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Payments</h3>
            <p>Fast, easy, and secure online transactions.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
