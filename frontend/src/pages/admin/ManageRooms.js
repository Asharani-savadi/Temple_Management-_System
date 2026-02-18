import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { apiClient } from '../../apiClient';
import Receipt from '../../components/Receipt';
import './AdminManage.css';

function ManageRooms() {
  const { rooms, bookings, refreshData } = useData();
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoomType, setCurrentRoomType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    total: '',
    lift: false,
    floor: '',
    occupancy: '',
    commode_type: '',
    ac: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Flatten rooms for display in admin panel
  useEffect(() => {
    // Flatten the grouped rooms structure for admin display
    const flatRooms = [];
    rooms.forEach(roomGroup => {
      if (roomGroup.types && roomGroup.types.length > 0) {
        roomGroup.types.forEach(type => {
          flatRooms.push({
            id: type.id,
            name: roomGroup.name,
            type: type.name,
            price: type.price,
            available: type.available,
            total: type.total,
            lift: roomGroup.lift,
            floor: type.floor,
            occupancy: type.occupancy,
            commode_type: type.commode_type,
            ac: type.ac,
            image: roomGroup.image
          });
        });
      }
    });
    setRoomTypes(flatRooms);
  }, [rooms]);

  const handleAdd = () => {
    setFormData({
      name: '',
      type: '',
      price: '',
      total: '',
      lift: false,
      floor: '',
      occupancy: '',
      commode_type: '',
      ac: false
    });
    setShowAddModal(true);
  };

  const handleEdit = (room) => {
    setCurrentRoomType(room);
    setFormData({
      name: room.name,
      type: room.type,
      price: room.price,
      total: room.total,
      lift: room.lift,
      floor: room.floor || '',
      occupancy: room.occupancy || '',
      commode_type: room.commode_type || '',
      ac: room.ac || false
    });
    setShowEditModal(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await apiClient.deleteRoom(roomId);
      await refreshData();
      alert('Room deleted successfully!');
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room: ' + error.message);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    try {
      const roomData = {
        name: formData.name,
        type: formData.type,
        price: parseInt(formData.price),
        total: parseInt(formData.total),
        available: parseInt(formData.total),
        lift: formData.lift,
        floor: formData.floor,
        occupancy: formData.occupancy,
        commode_type: formData.commode_type,
        ac: formData.ac,
        image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Room'
      };

      await apiClient.createRoom(roomData);
      await refreshData();
      setShowAddModal(false);
      setFormData({ 
        name: '', 
        type: '', 
        price: '', 
        total: '', 
        lift: false,
        floor: '',
        occupancy: '',
        commode_type: '',
        ac: false
      });
      alert('Room added successfully!');
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room: ' + error.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const updates = {
        name: formData.name,
        type: formData.type,
        price: parseInt(formData.price),
        total: parseInt(formData.total),
        available: parseInt(formData.total),
        lift: formData.lift,
        floor: formData.floor,
        occupancy: formData.occupancy,
        commode_type: formData.commode_type,
        ac: formData.ac
      };

      await apiClient.updateRoom(currentRoomType.id, updates);
      await refreshData();
      setShowEditModal(false);
      alert('Room updated successfully!');
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Filter room bookings
  const roomBookings = bookings.filter(booking => 
    booking.booking_type === 'room' || booking.type === 'Room'
  );

  const filteredBookings = roomBookings.filter(booking => {
    const matchesSearch = 
      (booking.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (booking.status || '').toLowerCase() === filterStatus;
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await apiClient.updateBooking(bookingId, { status: newStatus });
      await refreshData();
      setShowBookingModal(false);
      alert(`Booking status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status: ' + error.message);
    }
  };

  const totalRooms = roomTypes.reduce((sum, type) => sum + (type.total || 0), 0);
  const availableRooms = roomTypes.reduce((sum, type) => sum + (type.available || 0), 0);

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Rooms</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="stats-row">
          <div className="stat-box">
            <h3>Total Rooms</h3>
            <p className="stat-value">{totalRooms}</p>
          </div>
          <div className="stat-box">
            <h3>Available</h3>
            <p className="stat-value">{availableRooms}</p>
          </div>
          <div className="stat-box">
            <h3>Total Bookings</h3>
            <p className="stat-value">{roomBookings.length}</p>
          </div>
          <div className="stat-box">
            <h3>Pending</h3>
            <p className="stat-value">
              {roomBookings.filter(b => (b.status || '').toLowerCase() === 'pending').length}
            </p>
          </div>
        </div>

        <div className="management-section">
          <h2>Rooms</h2>
          <button className="btn-add" onClick={handleAdd}>+ Add Room</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Name</th>
                <th>Type</th>
                <th>Price (₹)</th>
                <th>Available/Total</th>
                <th>Lift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.length > 0 ? (
                roomTypes.map(room => (
                  <tr key={room.id}>
                    <td>#{room.id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>₹{room.price}</td>
                    <td>{room.available}/{room.total}</td>
                    <td>
                      <span className={`status-badge ${room.lift ? 'confirmed' : 'cancelled'}`}>
                        {room.lift ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => handleEdit(room)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDelete(room.id)}
                        style={{ marginLeft: '5px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="management-section" style={{ marginTop: '3rem' }}>
          <h2>Room Bookings</h2>
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
                <th>Check-in</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.check_in_date || booking.date}</td>
                    <td>₹{booking.amount}</td>
                    <td>
                      <span className={`status-badge ${(booking.status || '').toLowerCase()}`}>
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
                    No room bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Room</h2>
            <form className="modal-form" onSubmit={handleSubmitAdd}>
              <input 
                type="text" 
                name="name"
                placeholder="Room Name (e.g., Dheerendra Vasathi Gruha)" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="type"
                placeholder="Type (e.g., NON-AC | 2-Occupancy | First Floor | Western Commode)" 
                value={formData.type}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="price"
                placeholder="Price per night" 
                value={formData.price}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="total"
                placeholder="Total rooms available" 
                value={formData.total}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="floor"
                placeholder="Floor (e.g., First Floor, Ground Floor)" 
                value={formData.floor}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="occupancy"
                placeholder="Occupancy (e.g., 2-Occupancy)" 
                value={formData.occupancy}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="commode_type"
                placeholder="Commode Type (e.g., Western, Indian)" 
                value={formData.commode_type}
                onChange={handleChange}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="ac"
                  checked={formData.ac}
                  onChange={handleChange}
                />
                <span>AC Available</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="lift"
                  checked={formData.lift}
                  onChange={handleChange}
                />
                <span>Has Lift</span>
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">Add</button>
                <button 
                  type="button" 
                  className="btn-action btn-delete" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Room</h2>
            <form className="modal-form" onSubmit={handleSubmitEdit}>
              <input 
                type="text" 
                name="name"
                placeholder="Room Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="type"
                placeholder="Type" 
                value={formData.type}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="price"
                placeholder="Price per night" 
                value={formData.price}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="total"
                placeholder="Total rooms available" 
                value={formData.total}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="floor"
                placeholder="Floor" 
                value={formData.floor}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="occupancy"
                placeholder="Occupancy" 
                value={formData.occupancy}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="commode_type"
                placeholder="Commode Type" 
                value={formData.commode_type}
                onChange={handleChange}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="ac"
                  checked={formData.ac}
                  onChange={handleChange}
                />
                <span>AC Available</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="lift"
                  checked={formData.lift}
                  onChange={handleChange}
                />
                <span>Has Lift</span>
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">Update</button>
                <button 
                  type="button" 
                  className="btn-action btn-delete" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Room Booking Details</h2>
            <div className="booking-details">
              <p><strong>Booking ID:</strong> #{selectedBooking.id}</p>
              <p><strong>Guest Name:</strong> {selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Check-in Date:</strong> {selectedBooking.check_in_date || selectedBooking.date}</p>
              <p><strong>Check-out Date:</strong> {selectedBooking.check_out_date || 'N/A'}</p>
              <p><strong>Room Type:</strong> {selectedBooking.room_type || 'N/A'}</p>
              <p><strong>Number of Guests:</strong> {selectedBooking.guests || 'N/A'}</p>
              <p><strong>Amount:</strong> ₹{selectedBooking.amount}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${(selectedBooking.status || '').toLowerCase()}`}>{selectedBooking.status}</span></p>
              {selectedBooking.special_requests && (
                <p><strong>Special Requests:</strong> {selectedBooking.special_requests}</p>
              )}
            </div>

            <div className="status-buttons">
              <button 
                className="btn-action btn-view"
                onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
              >
                Confirm
              </button>
              <button 
                className="btn-action btn-edit"
                onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}
              >
                Complete
              </button>
              <button 
                className="btn-action btn-delete"
                onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}
              >
                Cancel
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

      {/* Receipt Modal */}
      {showReceipt && selectedBooking && (
        <Receipt booking={selectedBooking} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
}

export default ManageRooms;
