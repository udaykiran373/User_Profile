import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import AppHeader from '../components/AppHeader';

const API_URL = 'http://localhost:5166/api/user-profiles';

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Toggle Theme
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

  // Fetch Profiles
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setProfiles(data);
      setDbConnected(true);
    } catch (err) {
      console.error('Connection failure:', err);
      setDbConnected(false);
      showToast('Could not sync with MongoDB backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="app-container">
      <AppHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        statusText={dbConnected ? 'API Connected' : 'API Offline'}
        isConnected={dbConnected}
      />

      {/* Main Content Area */}
      <section className="profiles-section">
        <div className="section-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Registered Profiles ({profiles.length})
          </h2>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={fetchProfiles} 
              disabled={loading}
              className="theme-toggle-btn"
              style={{ borderRadius: '8px', padding: '0.5rem 0.8rem', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}
              title="Refresh list"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spinner' : ''}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
              Refresh
            </button>

            <Link to="/create" className="btn-nav" style={{ textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create Profile
            </Link>
          </div>
        </div>

        <div className="cards-grid">
          {loading && profiles.length === 0 ? (
            <div className="empty-state" style={{ borderStyle: 'solid' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem', borderTopColor: 'var(--primary)' }} />
              <p>Loading database profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3>No Profiles Found</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                MongoDB is empty. Click the button above to register your first profile!
              </p>
            </div>
          ) : (
            profiles.map((profile) => (
              <UserProfileCard key={profile.id} profile={profile} />
            ))
          )}
        </div>
      </section>

      {/* Visual Toast Alerts */}
      {toast.show && (
        <div className={`notification-toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
