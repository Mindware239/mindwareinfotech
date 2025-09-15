import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bio: '',
    profilePicture: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        updateUser(response.data);
        setEditing(false);
        showSuccess('Profile updated successfully!');
      } else {
        showError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || null
    });
    setEditing(false);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
          )}
          {editing && (
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                name="profilePicture"
                onChange={handleChange}
              />
              <i className="fas fa-camera"></i>
            </label>
          )}
        </div>
        <div className="profile-info">
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p className="user-email">{user?.email}</p>
          <p className="user-role">Student</p>
          {!editing && (
            <button 
              className="btn btn-primary"
              onClick={() => setEditing(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>About Me</h3>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name</label>
                  <p>{user?.firstName} {user?.lastName}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label>Date of Birth</label>
                  <p>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label>Gender</label>
                  <p>{user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Address Information</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Address</label>
                  <p>{user?.address || 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label>City</label>
                  <p>{user?.city || 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <p>{user?.state || 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label>Pincode</label>
                  <p>{user?.pincode || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {user?.bio && (
              <div className="detail-section">
                <h3>About Me</h3>
                <p className="bio-text">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
