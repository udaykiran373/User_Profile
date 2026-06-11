import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UserProfileForm from '../components/UserProfileForm';

export default function CreateProfile() {
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleProfileCreated = (newProfile) => {
    // Navigate back to Home page after a short delay so user can see toast success
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="app-container">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="btn-nav" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Profiles
          </Link>
        </div>

        <UserProfileForm 
          onProfileCreated={handleProfileCreated} 
          showToast={showToast} 
        />
      </div>

      {/* Visual Toast Alerts */}
      {toast.show && (
        <div className={`notification-toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
