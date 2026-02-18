import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminManage.css';

function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Temple Management',
    email: 'info@example.org',
    phone: '+91 XXXXXXXXXX',
    address: 'City, State',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Settings</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="settings-container">
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>System Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Currency</label>
                <select name="currency" value={settings.currency} onChange={handleChange}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select name="timezone" value={settings.timezone} onChange={handleChange}>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Notifications</h3>
            <div className="settings-form">
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                  />
                  Enable Email Notifications
                </label>
              </div>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={handleChange}
                  />
                  Enable SMS Notifications
                </label>
              </div>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                  />
                  Maintenance Mode
                </label>
              </div>
            </div>
          </div>

          <button className="btn-add" onClick={handleSave}>Save All Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
