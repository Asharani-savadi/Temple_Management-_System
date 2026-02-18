import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import './AdminManage.css';

function ManageBookings() {
  const { bookings } = useData();
  const [localBookings, setLocalBookings] = useState([]);
  
  // Sync with Supabase bookings
  React.useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const handleView = (booking) => {
    setCurrentBooking(booking);
    setShowViewModal(true);
  };

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setLocalBookings(localBookings.filter(b => b.id !== id));
      alert('Booking deleted successfully!');
    }
  };

  const handleStatusChange = (status) => {
    setLocalBookings(localBookings.map(b => 
      b.id === currentBooking.id ? { ...b, status } : b
    ));
    setShowEditModal(false);
    alert(`Booking status updated to ${status}!`);
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Bookings</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="manage-actions">
          <input type="text" placeholder="Search bookings..." className="search-input" />
          <select className="filter-select">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {localBookings.map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.name}</td>
                  <td>{booking.type}</td>
                  <td>{booking.date}</td>
                  <td>{booking.amount}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-view" onClick={() => handleView(booking)}>View</button>
                    <button className="btn-action btn-edit" onClick={() => handleEdit(booking)}>Edit</button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(booking.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && currentBooking && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Booking Details</h2>
            <div className="booking-details">
              <p><strong>ID:</strong> #{currentBooking.id}</p>
              <p><strong>Name:</strong> {currentBooking.name}</p>
              <p><strong>Type:</strong> {currentBooking.type}</p>
              <p><strong>Date:</strong> {currentBooking.date}</p>
              <p><strong>Amount:</strong> {currentBooking.amount}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${currentBooking.status.toLowerCase()}`}>{currentBooking.status}</span></p>
            </div>
            <div className="modal-actions">
              <button className="btn-action btn-view" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && currentBooking && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Booking Status</h2>
            <div className="booking-details">
              <p><strong>Booking ID:</strong> #{currentBooking.id}</p>
              <p><strong>Customer:</strong> {currentBooking.name}</p>
              <p><strong>Current Status:</strong> {currentBooking.status}</p>
            </div>
            <div className="status-buttons">
              <button className="btn-action btn-view" onClick={() => handleStatusChange('Confirmed')}>Confirm</button>
              <button className="btn-action btn-edit" onClick={() => handleStatusChange('Pending')}>Set Pending</button>
              <button className="btn-action btn-delete" onClick={() => handleStatusChange('Cancelled')}>Cancel</button>
            </div>
            <div className="modal-actions">
              <button className="btn-action btn-view" onClick={() => setShowEditModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;
