import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import BookingFlow from './pages/BookingFlow';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingFlow />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
