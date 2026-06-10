import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

const BASE_API = 'http://localhost:5166';

export default function UserProfileCard({ profile }) {
  // Ensure the photo URL points to the backend server if it's stored as a relative path
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
            // Fallback avatar if loading fails
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;
          }}
        />
      </div>
      
      <h3 className="card-name">{profile.name}</h3>
      
      <div className="card-location">
        <MapPin size={12} /> {profile.location}
      </div>

      <div className="card-details-divider" />

      <div className="card-info-list">
        <div className="card-info-item">
          <Mail className="card-info-icon" />
          <span>{profile.email}</span>
        </div>
        <div className="card-info-item">
          <Phone className="card-info-icon" />
          <span>{profile.phone}</span>
        </div>
      </div>

      <div className="card-date">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} /> Registered: {formattedDate}
        </span>
      </div>
    </div>
  );
}
