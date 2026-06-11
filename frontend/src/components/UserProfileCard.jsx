import React from 'react';

const BASE_API = 'http://localhost:5166';

export default function UserProfileCard({ profile }) {
  const photoUrl = profile.profilePhotoUrl.startsWith('http')
    ? profile.profilePhotoUrl
    : `${BASE_API}${profile.profilePhotoUrl}`;

  const formattedDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="profile-card">
      <div className="card-avatar-wrapper">
        <img 
          src={photoUrl} 
          alt={`${profile.name}'s Avatar`} 
          className="card-avatar"
          onError={(e) => {
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;
          }}
        />
      </div>
      
      <h3 className="card-name">{profile.name}</h3>
      
      <div className="card-location" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        {profile.location}
      </div>

      <div className="card-details-divider" />

      <div className="card-info-list">
        <div className="card-info-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-info-icon"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>{profile.email}</span>
        </div>
        <div className="card-info-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-info-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>{profile.phone}</span>
        </div>
      </div>

      <div className="card-date">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          Registered: {formattedDate}
        </span>
      </div>
    </div>
  );
}
