import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { apiClient } from '../../apiClient';
import Receipt from '../../components/Receipt';
import './AdminManage.css';

function ManageHalls() {
  const { marriageHalls, setMarriageHalls, bookings } = useData();
  const [halls, setHalls] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentHall, setCurrentHall] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    price: '',
    amenities: '',
    availableTime: '',
    imageUrl: ''
  });
  
  // Sync halls with marriageHalls from Supabase
  React.useEffect(() => {
    setHalls(marriageHalls.map(hall => ({
      ...hall,
      bookings: bookings.filter(b => b.type === 'Marriage Hall' && b.hallName === hall.name).length
    })));
  }, [marriageHalls, bookings]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleAdd = () => {
    setFormData({ name: '', capacity: '', price: '', amenities: '', availableTime: '', imageUrl: '' });
    setShowAddModal(true);
  };

  const handleEdit = (hall) => {
    setCurrentHall(hall);
    setFormData({
      name: hall.name,
      capacity: hall.capacity,
      price: hall.price,
      amenities: hall.amenities,
      availableTime: hall.availableTime || '',
      imageUrl: hall.imageUrl || hall.image || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hall?')) {
      try {
        await apiClient.deleteMarriageHall(id);
        setHalls(halls.filter(hall => hall.id !== id));
        setMarriageHalls(marriageHalls.filter(hall => hall.id !== id));
        alert('Hall deleted successfully from database!');
      } catch (error) {
        console.error('Error deleting hall:', error);
        alert('Failed to delete hall: ' + error.message);
      }
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    
    try {
      const hallData = {
        name: formData.name,
        image: formData.imageUrl || 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Hall',
        capacity: formData.capacity,
        amenities: formData.amenities,
        price: parseInt(formData.price),
        available: true
      };
      
      const data = await apiClient.createMarriageHall(hallData);
      
      // Update local state
      setMarriageHalls([...marriageHalls, data]);
      setHalls([...halls, { ...data, bookings: 0 }]);
      
      setShowAddModal(false);
      alert('Hall added successfully and saved to database!');
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error adding hall:', error);
      alert('Failed to add hall: ' + error.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      const hallData = {
        name: formData.name,
        capacity: formData.capacity,
        amenities: formData.amenities,
        price: parseInt(formData.price),
        image: formData.imageUrl || currentHall.image
      };
      
      await apiClient.updateMarriageHall(currentHall.id, hallData);
      
      // Update local state
      const updatedHalls = halls.map(hall => 
        hall.id === currentHall.id 
          ? { ...hall, ...formData, price: parseInt(formData.price), image: formData.imageUrl || hall.image }
          : hall
      );
      setHalls(updatedHalls);
      setMarriageHalls(marriageHalls.map(hall => 
        hall.id === currentHall.id 
          ? { ...hall, ...hallData }
          : hall
      ));
      
      setShowEditModal(false);
      alert('Hall updated successfully in database!');
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error updating hall:', error);
      alert('Failed to update hall: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter marriage hall bookings
  const hallBookings = bookings.filter(booking => booking.type === 'Marriage Hall');

  const filteredBookings = hallBookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleGenerateReceipt = (booking) => {
    setSelectedBooking(booking);
    setShowReceipt(true);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    console.log(`Updating booking ${bookingId} to ${newStatus}`);
    setShowBookingModal(false);
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Marriage Halls</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="stats-row">
          <div className="stat-box">
            <h3>Total Halls</h3>
            <p className="stat-value">{halls.length}</p>
          </div>
          <div className="stat-box">
            <h3>Total Bookings</h3>
            <p className="stat-value">{hallBookings.length}</p>
          </div>
          <div className="stat-box">
            <h3>Pending</h3>
            <p className="stat-value">{hallBookings.filter(b => b.status === 'Pending').length}</p>
          </div>
          <div className="stat-box">
            <h3>Confirmed</h3>
            <p className="stat-value">{hallBookings.filter(b => b.status === 'Confirmed').length}</p>
          </div>
        </div>

        <div className="management-section">
          <h2>Marriage Halls</h2>
          <button className="btn-add" onClick={handleAdd}>+ Add New Hall</button>
        </div>

        <div className="manage-actions">
          <input type="text" placeholder="Search halls..." className="search-input" />
        </div>

        <div className="cards-grid">
          {halls.map(hall => (
            <div key={hall.id} className="info-card">
              <div className="card-header">
                <h3>{hall.name}</h3>
                <span className="badge">💒</span>
              </div>
              <div className="card-body">
                <p><strong>Capacity:</strong> {hall.capacity}</p>
                <p><strong>Price:</strong> ₹{hall.price.toLocaleString()}/-</p>
                <p><strong>Amenities:</strong> {hall.amenities}</p>
                {hall.availableTime && <p><strong>Available Time:</strong> {hall.availableTime}</p>}
                <p><strong>Total Bookings:</strong> {hall.bookings}</p>
              </div>
              <div className="card-actions">
                <button className="btn-action btn-view" onClick={() => alert('Calendar view coming soon!')}>View Calendar</button>
                <button className="btn-action btn-edit" onClick={() => handleEdit(hall)}>Edit Details</button>
                <button className="btn-action btn-delete" onClick={() => handleDelete(hall.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="management-section" style={{ marginTop: '3rem' }}>
          <h2>Marriage Hall Bookings</h2>
        </div>

        <div className="manage-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={index}>
                    <td>#{index + 1}</td>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.date}</td>
                    <td>{booking.amount}</td>
                    <td>
                      <span className={`status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-action btn-view"
                        onClick={() => handleViewBooking(booking)}
                      >
                        View
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleGenerateReceipt(booking)}
                        style={{ marginLeft: '5px' }}
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No marriage hall bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Marriage Hall Booking Details</h2>
            <div className="booking-details">
              <p><strong>Booking ID:</strong> #{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
              <p><strong>Customer Name:</strong> {selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Hall Name:</strong> {selectedBooking.hallName || 'Kalyana Mandapa - Main Hall'}</p>
              <p><strong>Hall Capacity:</strong> {selectedBooking.capacity || '500 Guests'}</p>
              <p><strong>Event Date:</strong> {selectedBooking.date}</p>
              <p><strong>Event Type:</strong> {selectedBooking.eventType || 'Marriage Ceremony'}</p>
              <p><strong>Expected Guests:</strong> {selectedBooking.expectedGuests || selectedBooking.guests || '300-400'}</p>
              <p><strong>Amenities:</strong> {selectedBooking.amenities || 'AC, Stage, Dining, Parking'}</p>
              <p><strong>Amount:</strong> {selectedBooking.amount}</p>
              <p><strong>Advance Paid:</strong> {selectedBooking.advancePaid || '₹5,000'}</p>
              <p><strong>Balance:</strong> {selectedBooking.balance || 'Pending'}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>{selectedBooking.status}</span></p>
              {selectedBooking.specialRequests && (
                <p><strong>Special Requirements:</strong> {selectedBooking.specialRequests}</p>
              )}
            </div>

            <div className="status-buttons">
              <button 
                className="btn-action btn-view"
                onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
              >
                Confirm Booking
              </button>
              <button 
                className="btn-action btn-edit"
                onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}
              >
                Mark Completed
              </button>
              <button 
                className="btn-action btn-delete"
                onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}
              >
                Cancel Booking
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn-action" onClick={() => setShowBookingModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Hall</h2>
            <form className="modal-form" onSubmit={handleSubmitAdd}>
              <input 
                type="text" 
                name="name"
                placeholder="Hall Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="capacity"
                placeholder="Capacity (e.g., 500 Guests)" 
                value={formData.capacity}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="price"
                placeholder="Price" 
                value={formData.price}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="amenities"
                placeholder="Amenities (comma separated)" 
                value={formData.amenities}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="availableTime"
                placeholder="Available Time (e.g., 9:00 AM - 11:00 PM)" 
                value={formData.availableTime}
                onChange={handleChange}
              />
              <input 
                type="url" 
                name="imageUrl"
                placeholder="Image URL (optional)" 
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">Add Hall</button>
                <button type="button" className="btn-action btn-delete" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Hall</h2>
            <form className="modal-form" onSubmit={handleSubmitEdit}>
              <input 
                type="text" 
                name="name"
                placeholder="Hall Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="capacity"
                placeholder="Capacity" 
                value={formData.capacity}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="price"
                placeholder="Price" 
                value={formData.price}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="amenities"
                placeholder="Amenities" 
                value={formData.amenities}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="availableTime"
                placeholder="Available Time (e.g., 9:00 AM - 11:00 PM)" 
                value={formData.availableTime}
                onChange={handleChange}
              />
              <input 
                type="url" 
                name="imageUrl"
                placeholder="Image URL (optional)" 
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">Update Hall</button>
                <button type="button" className="btn-action btn-delete" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showReceipt && selectedBooking && (
        <Receipt booking={selectedBooking} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
}

export default ManageHalls;
