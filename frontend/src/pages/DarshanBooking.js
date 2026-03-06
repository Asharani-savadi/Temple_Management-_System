import React, { useState, useEffect } from 'react';
import { apiClient } from '../apiClient';
import './DarshanBooking.css';

const DarshanBooking = () => {
  const [step, setStep] = useState(1);
  const [darshanTypes, setDarshanTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [devoteeDetails, setDevoteeDetails] = useState({
    devotee_name: '',
    devotee_phone: '',
    devotee_email: '',
    devotee_address: '',
    number_of_persons: 1,
    special_requests: '',
    payment_method: 'online'
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch darshan types on mount
  useEffect(() => {
    fetchDarshanTypes();
  }, []);

  const fetchDarshanTypes = async () => {
    try {
      const response = await apiClient.getDarshanTypes();
      setDarshanTypes(response.data);
    } catch (err) {
      setError('Failed to load darshan types');
      console.error(err);
    }
  };

  const fetchAvailableSlots = async (date, type) => {
    try {
      setLoading(true);
      const response = await apiClient.getDarshanSlots(date, type);
      setAvailableSlots(response.data.slots);
      setError('');
    } catch (err) {
      setError('Failed to load available slots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSelectedSlot(null);
    setAvailableSlots([]);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBookingDate(date);
    if (selectedType && date) {
      fetchAvailableSlots(date, selectedType.type_code);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleDevoteeChange = (e) => {
    const { name, value } = e.target;
    setDevoteeDetails(prev => ({
      ...prev,
      [name]: name === 'number_of_persons' ? parseInt(value) : value
    }));
  };

  const handleProceedToStep2 = () => {
    if (!selectedType) {
      setError('Please select a darshan type');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleProceedToStep3 = () => {
    if (!bookingDate) {
      setError('Please select a booking date');
      return;
    }
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }
    setStep(3);
    setError('');
  };

  const handleSubmitBooking = async () => {
    // Validation
    if (!devoteeDetails.devotee_name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!devoteeDetails.devotee_phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (devoteeDetails.number_of_persons < 1 || devoteeDetails.number_of_persons > 10) {
      setError('Number of persons must be between 1 and 10');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        ...devoteeDetails,
        darshan_type: selectedType.type_code,
        booking_date: bookingDate,
        time_slot: selectedSlot.time
      };

      const response = await apiClient.createDarshanBooking(bookingData);
      
      setBookingConfirmation(response.data);
      setStep(4);
      setSuccess('Booking confirmed successfully!');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    setStep(1);
    setSelectedType(null);
    setBookingDate('');
    setSelectedSlot(null);
    setAvailableSlots([]);
    setDevoteeDetails({
      devotee_name: '',
      devotee_phone: '',
      devotee_email: '',
      devotee_address: '',
      number_of_persons: 1,
      special_requests: '',
      payment_method: 'online'
    });
    setBookingConfirmation(null);
    setError('');
    setSuccess('');
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="darshan-booking-container">
      <div className="booking-header">
        <h1>Darshan Booking</h1>
        <p>Book your sacred temple visit</p>
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Type</div>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Choose Date & Time</div>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Your Details</div>
        </div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Step 1: Select Darshan Type */}
      {step === 1 && (
        <div className="booking-step">
          <h2>Select Darshan Type</h2>
          <div className="darshan-types-grid">
            {darshanTypes.map(type => (
              <div
                key={type.id}
                className={`darshan-type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                onClick={() => handleTypeSelect(type)}
              >
                <h3>{type.type_name}</h3>
                <p className="description">{type.description}</p>
                <div className="type-details">
                  <div className="detail">
                    <span className="label">Price:</span>
                    <span className="value">
                      {type.price_per_person === 0 ? 'Free' : `₹${type.price_per_person}`}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">Duration:</span>
                    <span className="value">{type.duration_minutes} min</span>
                  </div>
                  <div className="detail">
                    <span className="label">Capacity:</span>
                    <span className="value">{type.max_persons_per_slot} persons</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleProceedToStep2}>
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Select Date and Time */}
      {step === 2 && (
        <div className="booking-step">
          <h2>Select Date & Time Slot</h2>
          <div className="selected-type-info">
            <p><strong>Selected:</strong> {selectedType?.type_name}</p>
            <p><strong>Price:</strong> ₹{selectedType?.price_per_person} per person</p>
          </div>

          <div className="date-time-section">
            <div className="form-group">
              <label htmlFor="booking-date">Select Date:</label>
              <input
                type="date"
                id="booking-date"
                value={bookingDate}
                onChange={handleDateChange}
                min={getMinDate()}
                max={getMaxDate()}
              />
            </div>

            {bookingDate && (
              <div className="time-slots-section">
                <h3>Available Time Slots</h3>
                {loading ? (
                  <p className="loading">Loading slots...</p>
                ) : availableSlots.length > 0 ? (
                  <div className="time-slots-grid">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.id}
                        className={`time-slot ${selectedSlot?.id === slot.id ? 'selected' : ''} ${slot.isFull ? 'full' : ''}`}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={slot.isFull}
                      >
                        <div className="slot-time">{slot.time}</div>
                        <div className="slot-availability">
                          {slot.isFull ? (
                            <span className="full-text">Full</span>
                          ) : (
                            <span className="available-text">{slot.available} available</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="no-slots">No available slots for this date</p>
                )}
              </div>
            )}
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleProceedToStep3}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Devotee Details */}
      {step === 3 && (
        <div className="booking-step">
          <h2>Your Details</h2>
          <div className="booking-summary">
            <p><strong>Darshan Type:</strong> {selectedType?.type_name}</p>
            <p><strong>Date:</strong> {new Date(bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedSlot?.time}</p>
          </div>

          <form className="devotee-form">
            <div className="form-group">
              <label htmlFor="devotee_name">Full Name *</label>
              <input
                type="text"
                id="devotee_name"
                name="devotee_name"
                value={devoteeDetails.devotee_name}
                onChange={handleDevoteeChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="devotee_phone">Phone Number *</label>
              <input
                type="tel"
                id="devotee_phone"
                name="devotee_phone"
                value={devoteeDetails.devotee_phone}
                onChange={handleDevoteeChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="devotee_email">Email Address</label>
              <input
                type="email"
                id="devotee_email"
                name="devotee_email"
                value={devoteeDetails.devotee_email}
                onChange={handleDevoteeChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="devotee_address">Address</label>
              <textarea
                id="devotee_address"
                name="devotee_address"
                value={devoteeDetails.devotee_address}
                onChange={handleDevoteeChange}
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="number_of_persons">Number of Persons *</label>
              <select
                id="number_of_persons"
                name="number_of_persons"
                value={devoteeDetails.number_of_persons}
                onChange={handleDevoteeChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="special_requests">Special Requests</label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={devoteeDetails.special_requests}
                onChange={handleDevoteeChange}
                placeholder="Any special requests or dedications"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="payment_method">Payment Method</label>
              <select
                id="payment_method"
                name="payment_method"
                value={devoteeDetails.payment_method}
                onChange={handleDevoteeChange}
              >
                <option value="online">Online Payment</option>
                <option value="at_temple">Pay at Temple</option>
              </select>
            </div>
          </form>

          <div className="price-summary">
            <div className="summary-row">
              <span>Price per person:</span>
              <span>₹{selectedType?.price_per_person}</span>
            </div>
            <div className="summary-row">
              <span>Number of persons:</span>
              <span>{devoteeDetails.number_of_persons}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{selectedType?.price_per_person * devoteeDetails.number_of_persons}</span>
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmitBooking}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && bookingConfirmation && (
        <div className="booking-step confirmation">
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your darshan booking has been successfully confirmed</p>
          </div>

          <div className="confirmation-details">
            <div className="detail-section">
              <h3>Booking Reference</h3>
              <p className="reference-code">{bookingConfirmation.booking_id}</p>
              <p className="confirmation-code">Confirmation: {bookingConfirmation.confirmation_code}</p>
            </div>

            <div className="detail-section">
              <h3>Booking Details</h3>
              <div className="detail-row">
                <span>Darshan Type:</span>
                <span>{bookingConfirmation.darshan_type}</span>
              </div>
              <div className="detail-row">
                <span>Date:</span>
                <span>{new Date(bookingConfirmation.booking_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span>Time:</span>
                <span>{bookingConfirmation.time_slot}</span>
              </div>
              <div className="detail-row">
                <span>Number of Persons:</span>
                <span>{bookingConfirmation.number_of_persons}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Devotee Information</h3>
              <div className="detail-row">
                <span>Name:</span>
                <span>{bookingConfirmation.devotee_name}</span>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <span>{bookingConfirmation.devotee_phone}</span>
              </div>
              {bookingConfirmation.devotee_email && (
                <div className="detail-row">
                  <span>Email:</span>
                  <span>{bookingConfirmation.devotee_email}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3>Payment Information</h3>
              <div className="detail-row">
                <span>Amount:</span>
                <span>₹{bookingConfirmation.total_amount}</span>
              </div>
              <div className="detail-row">
                <span>Payment Status:</span>
                <span className={`status ${bookingConfirmation.payment_status}`}>
                  {bookingConfirmation.payment_status.toUpperCase()}
                </span>
              </div>
              <div className="detail-row">
                <span>Booking Status:</span>
                <span className={`status ${bookingConfirmation.booking_status}`}>
                  {bookingConfirmation.booking_status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="important-note">
              <p>
                <strong>Important:</strong> Please save your booking reference number. 
                You will need it to check-in at the temple on your visit date.
              </p>
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleNewBooking}>
              Make Another Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarshanBooking;
