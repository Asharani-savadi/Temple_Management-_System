import React from 'react';
import './Receipt.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { GiTempleGate } from 'react-icons/gi';

function Receipt({ booking, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const generateReceiptNumber = () => {
    return `RCP${Date.now().toString().slice(-8)}`;
  };

  const getBookingTypeLabel = () => {
    if (booking.type === 'Donation' || booking.category || booking.purpose) {
      return 'E-Hundi Donation';
    }
    switch(booking.type) {
      case 'Room': return 'Room Booking';
      case 'Marriage Hall': return 'Marriage Hall Booking';
      default: return 'Booking';
    }
  };

  const isDonation = booking.type === 'Donation' || booking.category || booking.purpose;

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-container" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-content">
          {/* Header */}
          <div className="receipt-header">
            <div className="receipt-logo">
              <GiTempleGate className="receipt-temple-icon" />
            </div>
            <h1 className="receipt-title">Temple Management System</h1>
            <p className="receipt-subtitle">Official Receipt</p>
            <div className="receipt-divider"></div>
          </div>

          {/* Receipt Info */}
          <div className="receipt-info-section">
            <div className="receipt-info-row">
              <div className="receipt-info-item">
                <span className="receipt-label">Receipt No:</span>
                <span className="receipt-value">{generateReceiptNumber()}</span>
              </div>
              <div className="receipt-info-item">
                <span className="receipt-label">Date & Time:</span>
                <span className="receipt-value">{getCurrentDateTime()}</span>
              </div>
            </div>
            <div className="receipt-info-row">
              <div className="receipt-info-item">
                <span className="receipt-label">Booking Type:</span>
                <span className="receipt-value receipt-type">{getBookingTypeLabel()}</span>
              </div>
              <div className="receipt-info-item">
                <span className="receipt-label">Status:</span>
                <span className={`receipt-status ${booking.status.toLowerCase()}`}>
                  <FaCheckCircle /> {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="receipt-section">
            <h3 className="receipt-section-title">{isDonation ? 'Donor Details' : 'Customer Details'}</h3>
            <div className="receipt-details-grid">
              <div className="receipt-detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{booking.name || booking.donor}</span>
              </div>
              {booking.email && (
                <div className="receipt-detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{booking.email}</span>
                </div>
              )}
              {booking.phone && (
                <div className="receipt-detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{booking.phone}</span>
                </div>
              )}
              {!isDonation && (
                <div className="receipt-detail-item">
                  <span className="detail-label">Guests:</span>
                  <span className="detail-value">{booking.guests || booking.devotees || '2'}</span>
                </div>
              )}
              {isDonation && booking.panNumber && (
                <div className="receipt-detail-item">
                  <span className="detail-label">PAN Number:</span>
                  <span className="detail-value">{booking.panNumber}</span>
                </div>
              )}
              {isDonation && booking.address && (
                <div className="receipt-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{booking.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="receipt-section">
            <h3 className="receipt-section-title">{isDonation ? 'Donation Details' : 'Booking Details'}</h3>
            <div className="receipt-details-grid">
              {isDonation ? (
                <>
                  <div className="receipt-detail-item">
                    <span className="detail-label">Donation Category:</span>
                    <span className="detail-value">{booking.purpose || booking.category}</span>
                  </div>
                  <div className="receipt-detail-item">
                    <span className="detail-label">Donation Date:</span>
                    <span className="detail-value">{booking.date}</span>
                  </div>
                  <div className="receipt-detail-item">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">{booking.paymentMethod || 'Online'}</span>
                  </div>
                  <div className="receipt-detail-item">
                    <span className="detail-label">Transaction ID:</span>
                    <span className="detail-value">{booking.transactionId || 'TXN' + Date.now().toString().slice(-10)}</span>
                  </div>
                  {booking.message && (
                    <div className="receipt-detail-item" style={{ gridColumn: '1 / -1' }}>
                      <span className="detail-label">Message/Purpose:</span>
                      <span className="detail-value">{booking.message}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {booking.type === 'Room' && (
                    <>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Room Name:</span>
                        <span className="detail-value">{booking.roomName}</span>
                      </div>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Room Type:</span>
                        <span className="detail-value">{booking.roomType}</span>
                      </div>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Room Number:</span>
                        <span className="detail-value">{booking.roomNumber}</span>
                      </div>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Check-in Date:</span>
                        <span className="detail-value">{booking.date}</span>
                      </div>
                    </>
                  )}
                  
                  {booking.type === 'Marriage Hall' && (
                    <>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Hall Name:</span>
                        <span className="detail-value">{booking.hallName}</span>
                      </div>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Event Date:</span>
                        <span className="detail-value">{booking.date}</span>
                      </div>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Capacity:</span>
                        <span className="detail-value">{booking.capacity}</span>
                      </div>
                      <div className="receipt-detail-item">
                        <span className="detail-label">Amenities:</span>
                        <span className="detail-value">{booking.amenities}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            {booking.specialRequests && !isDonation && (
              <div className="receipt-special-requests">
                <span className="detail-label">Special Requests:</span>
                <p className="detail-value">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="receipt-section receipt-payment-section">
            <h3 className="receipt-section-title">Payment Details</h3>
            <div className="receipt-payment-table">
              <div className="payment-row">
                <span className="payment-label">{isDonation ? 'Donation Amount:' : 'Booking Amount:'}</span>
                <span className="payment-value">{booking.amount}</span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Tax (0%):</span>
                <span className="payment-value">₹0</span>
              </div>
              <div className="payment-row payment-total">
                <span className="payment-label">Total Amount:</span>
                <span className="payment-value">{booking.amount}</span>
              </div>
            </div>
            {isDonation && (
              <div className="receipt-tax-note">
                <p>* This donation is eligible for tax exemption under Section 80G of the Income Tax Act.</p>
                <p>* Please retain this receipt for tax filing purposes.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="receipt-footer">
            <div className="receipt-footer-divider"></div>
            <div className="receipt-contact">
              <p><FaPhone /> +91 XXXXXXXXXX</p>
              <p><FaEnvelope /> info@temple.org</p>
              <p><FaMapMarkerAlt /> Temple Street, City, State - 000000</p>
            </div>
            <p className="receipt-thank-you">{isDonation ? 'Thank you for your generous donation!' : 'Thank you for your booking!'}</p>
            <p className="receipt-note">This is a computer-generated receipt and does not require a signature.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions no-print">
          <button className="receipt-btn receipt-btn-print" onClick={handlePrint}>
            Print Receipt
          </button>
          <button className="receipt-btn receipt-btn-download" onClick={handleDownload}>
            Download PDF
          </button>
          <button className="receipt-btn receipt-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
