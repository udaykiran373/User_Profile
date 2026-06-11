import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">N</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="logo-text">Profile App</span>
              <span className="logo-tag">v1.0</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Honeycomb Architecture &bull; React Router &bull; MongoDB
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
        </div>
      </header>

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
