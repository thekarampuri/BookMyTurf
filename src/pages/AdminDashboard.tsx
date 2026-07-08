import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  MapPin, 
  LogOut,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TURFS } from '../data/turfs';
import { subscribeToBookings, updateBookingStatus as updateDbStatus } from '../services/bookingService';
import type { Booking, BookingStatus } from '../types';
import AdminLogin from './AdminLogin';
import './AdminDashboard.css';

type Tab = 'overview' | 'bookings' | 'turfs';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Derived Stats
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + b.amount, 0);
  }, [bookings]);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateDbStatus(id, newStatus);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const renderSidebar = () => (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <MapPin size={24} color="var(--accent)" />
        <span>BookMyTurf</span>
      </div>
      
      <nav className="admin-nav">
        <button 
          className={`admin-nav__item ${activeTab === 'overview' ? 'admin-nav__item--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>
        <button 
          className={`admin-nav__item ${activeTab === 'bookings' ? 'admin-nav__item--active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <CalendarDays size={20} />
          <span>Bookings</span>
        </button>
        <button 
          className={`admin-nav__item ${activeTab === 'turfs' ? 'admin-nav__item--active' : ''}`}
          onClick={() => setActiveTab('turfs')}
        >
          <MapPin size={20} />
          <span>Turf Management</span>
        </button>
      </nav>

      <div className="admin-sidebar__footer">
        <button className="admin-nav__item" onClick={() => {
          sessionStorage.removeItem('adminAuth');
          setIsAuthenticated(false);
        }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <button className="admin-nav__item" onClick={() => navigate('/')}>
          <LogOut size={20} />
          <span>Back to Site</span>
        </button>
      </div>
    </aside>
  );

  const renderOverview = () => (
    <div className="tab-content">
      <div className="admin-header">
        <h1 className="admin-header__title serif">Dashboard Overview</h1>
        <p className="admin-header__subtitle">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon-wrap success">
            <IndianRupee size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Total Revenue</span>
            <h3 className="stat-card__value">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card__icon-wrap info">
            <CalendarDays size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Total Bookings</span>
            <h3 className="stat-card__value">{totalBookings}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon-wrap" style={{ color: '#ff9800', backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Pending Requests</span>
            <h3 className="stat-card__value">{pendingBookings}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon-wrap">
            <MapPin size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Active Turfs</span>
            <h3 className="stat-card__value">{TURFS.length}</h3>
          </div>
        </div>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h3>Recent Bookings</h3>
          <button className="btn btn-sm" onClick={() => setActiveTab('bookings')}>View All</button>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Turf</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.userName}</td>
                  <td>{b.turfName}</td>
                  <td>{new Date(b.date).toLocaleDateString('en-IN')} <br/><span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{b.time}</span></td>
                  <td>₹{b.amount}</td>
                  <td>
                    <span className={`status-badge status-badge--${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="tab-content">
      <div className="admin-header">
        <h1 className="admin-header__title serif">Manage Bookings</h1>
        <p className="admin-header__subtitle">View, approve, or cancel user bookings.</p>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h3>All Bookings</h3>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User info</th>
                <th>Turf & Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>
                    <div>{b.userName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{b.userPhone}</div>
                  </td>
                  <td>
                    <div>{b.turfName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
                      {new Date(b.date).toLocaleDateString('en-IN')} @ {b.time}
                    </div>
                  </td>
                  <td>₹{b.amount}</td>
                  <td>
                    <span className={`status-badge status-badge--${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {b.status === 'Pending' && (
                        <>
                          <button 
                            className="action-btn action-btn--approve"
                            title="Approve"
                            onClick={() => handleStatusChange(b.id, 'Confirmed')}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            className="action-btn action-btn--cancel"
                            title="Cancel"
                            onClick={() => handleStatusChange(b.id, 'Cancelled')}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button 
                          className="action-btn action-btn--cancel"
                          title="Cancel Booking"
                          onClick={() => handleStatusChange(b.id, 'Cancelled')}
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state__icon">📄</div>
                      <p>No bookings found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTurfs = () => (
    <div className="tab-content">
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="admin-header__title serif">Turf Management</h1>
            <p className="admin-header__subtitle">Manage your venues and pricing.</p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Add new turf flow coming soon!')}>
            + Add New Turf
          </button>
        </div>
      </div>

      <div className="data-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Turf Name</th>
                <th>Size</th>
                <th>Pricing (Morning/Evening)</th>
                <th>Amenities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TURFS.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500 }}>{t.name}</td>
                  <td>{t.size}</td>
                  <td>₹{t.morningPrice} / ₹{t.eveningPrice}</td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
                      {t.amenities.length} amenities
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => alert(`Edit ${t.name}`)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <AdminLogin onLogin={() => {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
      }} />
    );
  }

  return (
    <div className="admin-layout">
      {renderSidebar()}
      <main className="admin-main">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'turfs' && renderTurfs()}
      </main>
    </div>
  );
}
