import React from 'react';

export default function AppHeader({ theme, onToggleTheme, statusText, isConnected }) {
  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-icon">N</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="logo-text">Profile App</span>
            
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Honeycomb Architecture &bull; React Router &bull; MongoDB
          </p>
        </div>
      </div>

      <div className="header-actions">
        {statusText && (
          <div className="status-badge">
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
            <span>{statusText}</span>
          </div>
        )}

        <button
          onClick={onToggleTheme}
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
  );
}
