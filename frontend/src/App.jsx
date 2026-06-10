import React, { useState, useEffect } from 'react';
import { Sun, Moon, Users, RefreshCw } from 'lucide-react';
import UserProfileForm from './components/UserProfileForm';
import UserProfileCard from './components/UserProfileCard';

const API_URL = 'http://localhost:5166/api/user-profiles';

export default function App() {
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

  // Show visual toast notification
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

  const handleProfileCreated = (newProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
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
              
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Honeycomb Architecture &bull; React &bull; MongoDB
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="status-badge">
            <div className={`status-dot ${dbConnected ? 'connected' : 'disconnected'}`} />
            <span>{dbConnected ? 'API Connected' : 'API Offline'}</span>
          </div>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-grid">
        {/* Left Side: Form */}
        <UserProfileForm 
          onProfileCreated={handleProfileCreated} 
          showToast={showToast} 
        />

        {/* Right Side: Profiles List */}
        <section className="profiles-section">
          <div className="section-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'var(--primary)' }} />
              Registered Profiles ({profiles.length})
            </h2>
            <button 
              onClick={fetchProfiles} 
              disabled={loading}
              className="theme-toggle-btn"
              style={{ borderRadius: '8px', padding: '0.5rem 0.8rem', fontSize: '0.85rem', display: 'flex', gap: '6px' }}
              title="Refresh profiles list"
            >
              <RefreshCw size={14} className={loading ? 'spinner' : ''} />
              Refresh
            </button>
          </div>

          <div className="cards-grid">
            {loading && profiles.length === 0 ? (
              <div className="empty-state" style={{ borderStyle: 'solid' }}>
                <div className="spinner" style={{ width: '2rem', height: '2rem', borderTopColor: 'var(--primary)' }} />
                <p>Loading database profiles...</p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="empty-state">
                <Users className="empty-state-icon" />
                <h3>No Profiles Found</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Submit the form on the left to add your first user profile to MongoDB!
                </p>
              </div>
            ) : (
              profiles.map((profile) => (
                <UserProfileCard key={profile.id} profile={profile} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Visual Toast Alerts */}
      {toast.show && (
        <div className={`notification-toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
