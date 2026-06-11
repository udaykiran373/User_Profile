import React, { useState, useRef } from 'react';

const API_URL = 'http://localhost:5166/api/user-profiles';

export default function UserProfileForm({ onProfileCreated, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
    }

    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!photo) newErrors.photo = 'Profile photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Only JPG, JPEG, PNG, WEBP and GIF images are allowed.'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'File size must be less than 5MB.'
      }));
      return;
    }

    setPhoto(file);
    setErrors((prev) => ({ ...prev, photo: '' }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhoto(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const submitData = new FormData();
    submitData.append('Name', formData.name);
    submitData.append('Email', formData.email);
    submitData.append('Phone', formData.phone);
    submitData.append('Location', formData.location);
    submitData.append('ProfilePhoto', photo);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit profile.');
      }

      const newProfile = await response.json();
      showToast('Profile created successfully!', 'success');
      
      setFormData({ name: '', email: '', phone: '', location: '' });
      setPhoto(null);
      setPhotoPreview('');
      
      onProfileCreated(newProfile);
    } catch (error) {
      console.error('Submit error:', error);
      showToast(error.message || 'Error connecting to the backend API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="panel-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-info-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
        Create Profile
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <div className="input-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="form-input"
              disabled={loading}
            />
          </div>
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              className="form-input"
              disabled={loading}
            />
          </div>
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number</label>
          <div className="input-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className="form-input"
              disabled={loading}
            />
          </div>
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="location">Location</label>
          <div className="input-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="San Francisco, CA"
              className="form-input"
              disabled={loading}
            />
          </div>
          {errors.location && <span className="form-error">{errors.location}</span>}
        </div>

        {/* Photo Upload Zone */}
        <div className="form-group">
          <label className="form-label">Profile Photo</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div 
            className={`dropzone-container ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <div className="dropzone-preview">
                <div className="preview-img-wrapper">
                  <img src={photoPreview} alt="Preview" className="preview-img" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {photo.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button 
                  type="button" 
                  className="preview-remove-btn" 
                  onClick={removePhoto}
                  disabled={loading}
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dropzone-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Drag & Drop profile image
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  or click to browse from system (PNG, JPG, WEBP up to 5MB)
                </p>
              </div>
            )}
          </div>
          {errors.photo && <span className="form-error">{errors.photo}</span>}
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" /> Saving Details...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </form>
    </div>
  );
}
