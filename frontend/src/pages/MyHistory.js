import React, { useState } from 'react';
import './Services.css';

function MyHistory() {
  const [activeTab, setActiveTab] = useState('bookings');

  const bookingHistory = [
    { id: 1, date: 'Nov 15, 2025', type: 'Room Booking', status: 'Completed', amount: '₹600' },
    { id: 2, date: 'Oct 20, 2025', type: 'Marriage Hall', status: 'Completed', amount: '₹25,000' },
    { id: 3, date: 'Sep 10, 2025', type: 'Room Booking', status: 'Completed', amount: '₹450' }
  ];

  const donationHistory = [
    { id: 1, date: 'Dec 1, 2025', purpose: 'Goshala', amount: '₹5,000' },
    { id: 2, date: 'Nov 1, 2025', purpose: 'E-Hundi', amount: '₹1,000' },
    { id: 3, date: 'Oct 15, 2025', purpose: 'Room Donor', amount: '₹10,000' }
  ];

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="container">
          <h1>📖 My History</h1>
          <p>View your booking and donation history</p>
        </div>
      </section>

      <section className="service-content">
        <div className="container">
          <div className="history-tabs">
            <button 
              className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              Donations
            </button>
          </div>

          {activeTab === 'bookings' && (
            <div className="history-content">
              <h2>Booking History</h2>
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingHistory.map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{booking.date}</td>
                        <td>{booking.type}</td>
                        <td><span className="status-badge completed">{booking.status}</span></td>
                        <td>{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="history-content">
              <h2>Donation History</h2>
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Purpose</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.map((donation) => (
                      <tr key={donation.id}>
                        <td>#{donation.id}</td>
                        <td>{donation.date}</td>
                        <td>{donation.purpose}</td>
                        <td>{donation.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MyHistory;
