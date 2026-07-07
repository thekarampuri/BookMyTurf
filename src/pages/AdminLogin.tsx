import { useState } from 'react';
import { Lock } from 'lucide-react';
import './AdminLogin.css';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-page page-bg">
      <div className="admin-login-card card">
        <div className="admin-login-icon">
          <Lock size={32} />
        </div>
        <h1 className="admin-login-title serif">Admin Portal</h1>
        <p className="admin-login-subtitle">Sign in to manage your turfs and bookings</p>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <div className="admin-login-error">{error}</div>}
          
          <button type="submit" className="btn btn-primary btn-lg admin-login-btn">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
