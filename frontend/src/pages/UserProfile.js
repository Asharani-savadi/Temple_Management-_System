import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { apiClient } from '../apiClient';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.getUserProfile(user.id);
      if (res.success) {
        setProfile(res.user);
        setBookings(res.bookings || []);
        setEditData({ name: res.user.name, phone: res.user.phone });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiClient.updateUserProfile(user.id, editData);
      if (res.success) {
        setProfile(res.user);
        setEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <FaUser />
            </div>
            {editing ? (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                </div>
                <div className="edit-actions">
                  <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button className="btn-cancel-edit" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="profile-name">{profile?.name}</h2>
                <div className="profile-info">
                  <div className="info-item"><FaEnvelope /><span>{profile?.email}</span></div>
                  <div className="info-item"><FaPhone /><span>{profile?.phone}</span></div>
                  <div className="info-item"><FaCalendarAlt /><span>Member since {new Date(profile?.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span></div>
                </div>
                <button className="btn-edit-profile" onClick={() => setEditing(true)}><FaEdit /> Edit Profile</button>
              </>
            )}
            <button className="btn-logout" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
          </div>

          {/* Bookings History */}
          <div className="profile-bookings">
            <h3>My Bookings</h3>
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <p>No bookings yet.</p>
                <button className="btn-book-now" onClick={() => navigate('/booking')}>Book Now</button>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-type">{booking.type}</span>
                      <span className={`booking-status status-${(booking.status || '').toLowerCase()}`}>{booking.status}</span>
                    </div>
                    <div className="booking-details">
                      <span><FaCalendarAlt /> {booking.date}</span>
                      <span className="booking-amount">{booking.amount}</span>
                    </div>
                    {booking.room_name && <div className="booking-extra">{booking.room_name} — {booking.room_type}</div>}
                    {booking.hall_name && <div className="booking-extra">{booking.hall_name}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;
