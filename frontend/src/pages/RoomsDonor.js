import React, { useState } from 'react';
import './Services.css';
import { apiClient } from '../apiClient';

function RoomsDonor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    roomType: 'standard',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await apiClient.createDonation({
        donor: formData.name,
        category: `Room Donor - ${formData.roomType} (${formData.phone}${formData.email ? ', ' + formData.email : ''}${formData.message ? ' | ' + formData.message : ''})`,
        amount: parseInt(formData.amount, 10),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });

      alert('Thank you for your generous donation! We will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', amount: '', roomType: 'standard', message: '' });
    } catch (err) {
      setError('Failed to submit donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="container">
          <h1>🏦 Rooms Donor</h1>
          <p>Support our mission by donating towards room construction and maintenance</p>
        </div>
      </section>

      <section className="service-content">
        <div className="container">
          <div className="donation-info">
            <h2>Why Donate?</h2>
            <p>Your generous contribution helps us provide comfortable accommodation for devotees visiting our temple. By donating towards room construction, you become part of our spiritual community.</p>
            
            <div className="donation-benefits">
              <h3>Donation Benefits:</h3>
              <ul>
                <li>Room naming rights for major donations</li>
                <li>Tax exemption certificate</li>
                <li>Priority booking privileges</li>
                <li>Recognition in our donor wall</li>
              </ul>
            </div>
          </div>

          <form className="donation-form" onSubmit={handleSubmit}>
            <h2>Make a Donation</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Donation Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="1000"
                required
              />
            </div>

            <div className="form-group">
              <label>Room Type Preference</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
              >
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <button type="submit" className="btn btn-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default RoomsDonor;
