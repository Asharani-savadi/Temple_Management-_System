import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MdRestaurant } from 'react-icons/md';
import { GiCow } from 'react-icons/gi';
import { FaHome, FaHardHat, FaBook, FaHeart, FaCheckCircle } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';
import './Services.css';

function Services() {
  const { addDonation } = useData();
  const [step, setStep] = useState('donation'); // donation, form, confirmation
  const [donations, setDonations] = useState({
    annadhana: '',
    godana: '',
    goshala: '',
    constructions: '',
    vidhyadhana: '',
    goGrasa: '',
    others: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    panNumber: ''
  });

  const donationItems = [
    { id: 'annadhana', name: 'Annadhana', icon: MdRestaurant },
    { id: 'godana', name: 'Godana', icon: GiCow },
    { id: 'goshala', name: 'Goshala', icon: FaHome },
    { id: 'constructions', name: 'Constructions', icon: FaHardHat },
    { id: 'vidhyadhana', name: 'Vidhyadhana', icon: FaBook },
    { id: 'goGrasa', name: 'Go-Grasa', icon: GiWheat },
    { id: 'others', name: 'Others', icon: FaHeart }
  ];

  const handleChange = (id, value) => {
    setDonations({
      ...donations,
      [id]: value
    });
  };

  const calculateTotal = () => {
    return Object.values(donations).reduce((sum, val) => {
      const num = parseFloat(val) || 0;
      return sum + num;
    }, 0);
  };

  const handleProceed = () => {
    const total = calculateTotal();
    if (total > 0) {
      setStep('form');
    } else {
      alert('Please enter donation amount');
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const total = calculateTotal();
    
    // Get donation purposes
    const purposes = Object.entries(donations)
      .filter(([key, value]) => value && parseFloat(value) > 0)
      .map(([key, value]) => {
        const item = donationItems.find(d => d.id === key);
        return `${item.name}: ₹${value}`;
      })
      .join(', ');

    // Add donation to global state
    const donationData = {
      name: formData.name,
      purpose: purposes,
      amount: `₹${total}`,
      date: new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      status: 'Completed'
    };
    
    try {
      await addDonation(donationData);
      setStep('confirmation');
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Failed to submit donation. Please try again.');
    }
  };

  const handleBackToDonations = () => {
    setStep('donation');
  };

  const handleNewDonation = () => {
    setDonations({
      annadhana: '',
      godana: '',
      goshala: '',
      constructions: '',
      vidhyadhana: '',
      goGrasa: '',
      others: ''
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      panNumber: ''
    });
    setStep('donation');
  };

  return (
    <div className="services-page">
      <section className="page-header">
        <div className="container">
          <h1>Donations</h1>
          <p>Support our spiritual and charitable activities</p>
        </div>
      </section>

      {step === 'donation' && (
        <section className="section">
          <div className="container">
            <div className="donations-list">
              {donationItems.map(item => (
                <div key={item.id} className="donation-item">
                  <div className="donation-name">
                    <span className="donation-icon"><item.icon /></span>
                    <span className="donation-title">{item.name}</span>
                  </div>
                  <div className="donation-input">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={donations[item.id]}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="donation-total">
              <div className="total-display">
                <span className="total-label">Total:</span>
                <span className="total-amount">₹ {calculateTotal()}/-</span>
              </div>
              <button className="btn btn-proceed" onClick={handleProceed}>
                Proceed to Donate
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 'form' && (
        <section className="section">
          <div className="container">
            <div className="booking-form-container">
              <div className="form-header">
                <h2>Donor Information</h2>
                <button className="btn-back" onClick={handleBackToDonations}>
                  ← Back to Donations
                </button>
              </div>

              <div className="booking-summary">
                <h3>Donation Summary</h3>
                {Object.entries(donations)
                  .filter(([key, value]) => value && parseFloat(value) > 0)
                  .map(([key, value]) => {
                    const item = donationItems.find(d => d.id === key);
                    return (
                      <p key={key}>
                        <strong>{item.name}:</strong> ₹{value}/-
                      </p>
                    );
                  })}
                <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#28a745' }}>
                  <strong>Total Amount: ₹{calculateTotal()}/-</strong>
                </p>
              </div>

              <form className="booking-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>PAN Number (Optional - for 80G certificate)</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleFormChange}
                    placeholder="ABCDE1234F"
                  />
                </div>

                <button type="submit" className="btn btn-submit-booking">
                  Submit Donation
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {step === 'confirmation' && (
        <section className="section">
          <div className="container">
            <div className="confirmation-container">
              <div className="confirmation-icon"><FaCheckCircle /></div>
              <h2>Donation Successful!</h2>
              <p className="confirmation-message">
                Thank you for your generous contribution. A receipt has been sent to {formData.email}
              </p>
              
              <div className="confirmation-details">
                <h3>Donation Details</h3>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Total Amount:</strong> ₹{calculateTotal()}/-</p>
                <p><strong>Transaction ID:</strong> #{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>

              <button className="btn" onClick={handleNewDonation}>
                Make Another Donation
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Services;
