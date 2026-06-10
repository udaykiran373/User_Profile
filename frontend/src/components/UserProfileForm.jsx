
import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, UploadCloud, X } from 'lucide-react';

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
    // Clear validation error when typing
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
    }  else {
  // Removes spaces, hyphens, and parentheses for a clean check
  const cleanedPhone = formData.phone.replace(/[\s\-()]+/g, '');
  
  // Validates standard 10 digits starting with 6-9, with optional +91 or 0 prefix
  const indianPhoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
  
  if (!indianPhoneRegex.test(cleanedPhone)) {
    newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
  }
}

    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!photo) newErrors.photo = 'Profile photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Only JPG, JPEG, PNG, WEBP and GIF images are allowed.'
      }));
      return;
    }

    // Validate size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'File size must be less than 5MB.'
      }));
      return;
    }

    setPhoto(file);
    setErrors((prev) => ({ ...prev, photo: '' }));

    // Generate Preview URL
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
      
      // Reset Form
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
        <User size={20} className="card-info-icon" /> Create Profile
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <div className="input-container">
            <User size={16} className="input-icon" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
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
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
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
            <Phone size={16} className="input-icon" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 9999999999"
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
            <MapPin size={16} className="input-icon" />
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Place"
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
                <UploadCloud className="dropzone-icon" />
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
