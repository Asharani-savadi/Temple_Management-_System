import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { GiTempleGate } from 'react-icons/gi';
import Receipt from '../../components/Receipt';
import './AdminManage.css';

function ManageSevas() {
  const navigate = useNavigate();
  const { bookings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showAddSevaModal, setShowAddSevaModal] = useState(false);
  const [sevaList, setSevaList] = useState([
    { id: 1, name: 'PANCHAMRUTHAM', price: 100, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 2, name: 'KSHEERABHI SHEKAM', price: 100, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 3, name: 'ARCHANA SAHITA HASTODAKA', price: 150, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 4, name: 'PHALA PANCHAMRUTHA', price: 200, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 5, name: 'SARVA SEVA', price: 300, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 6, name: 'TAILA NANDA DEEPAM (1 MONTH)', price: 300, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 7, name: 'UTSAVARAYARA PADAPOOJA', price: 300, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 8, name: 'MAHA POOJA', price: 500, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 9, name: 'UNJAL SEVA', price: 500, time: '06:45 PM Evening', description: 'Sevakartha to be present at Poojamandira in Prakara by 6:45pm for sankalpa.' },
    { id: 10, name: 'ABHISHEK', price: 1000, time: '07:30 AM Morning', description: 'Sevakartha to be present at Poojamandira in Prakara by 7:30am for sankalpa.' },
    { id: 11, name: 'ARATI', price: 500, time: '06:45 PM Evening', description: 'Sevakartha to be present at Poojamandira in Prakara by 6:45pm for sankalpa.' }
  ]);
  const [newSeva, setNewSeva] = useState({
    name: '',
    price: '',
    time: '07:30 AM Morning',
    description: ''
  });
  const [editingSeva, setEditingSeva] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  // Filter only seva bookings
  const sevaBookings = bookings.filter(booking => booking.type === 'Seva');

  const filteredBookings = sevaBookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleGenerateReceipt = (booking) => {
    setSelectedBooking(booking);
    setShowReceipt(true);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    // In a real app, this would update the booking status in the database
    console.log(`Updating booking ${bookingId} to ${newStatus}`);
    setShowModal(false);
  };

  const handleAddSeva = () => {
    setNewSeva({
      name: '',
      price: '',
      time: '07:30 AM Morning',
      description: ''
    });
    setEditingSeva(null);
    setShowAddSevaModal(true);
  };

  const handleEditSeva = (seva) => {
    setNewSeva(seva);
    setEditingSeva(seva);
    setShowAddSevaModal(true);
  };

  const handleDeleteSeva = (sevaId) => {
    if (window.confirm('Are you sure you want to delete this seva?')) {
      setSevaList(sevaList.filter(seva => seva.id !== sevaId));
    }
  };

  const handleSevaFormChange = (e) => {
    setNewSeva({
      ...newSeva,
      [e.target.name]: e.target.value
    });
  };

  const handleSevaFormSubmit = (e) => {
    e.preventDefault();
    if (editingSeva) {
      // Update existing seva
      setSevaList(sevaList.map(seva => 
        seva.id === editingSeva.id ? { ...newSeva, id: editingSeva.id } : seva
      ));
    } else {
      // Add new seva
      const newId = Math.max(...sevaList.map(s => s.id), 0) + 1;
      setSevaList([...sevaList, { ...newSeva, id: newId }]);
    }
    setShowAddSevaModal(false);
    setNewSeva({
      name: '',
      price: '',
      time: '07:30 AM Morning',
      description: ''
    });
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1><GiTempleGate /> Seva Bookings Management</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="manage-container">
        <div className="stats-row">
          <div className="stat-box">
            <h3>Total Sevas</h3>
            <p className="stat-value">{sevaList.length}</p>
          </div>
          <div className="stat-box">
            <h3>Total Bookings</h3>
            <p className="stat-value">{sevaBookings.length}</p>
          </div>
          <div className="stat-box">
            <h3>Pending</h3>
            <p className="stat-value">{sevaBookings.filter(b => b.status === 'Pending').length}</p>
          </div>
          <div className="stat-box">
            <h3>Confirmed</h3>
            <p className="stat-value">{sevaBookings.filter(b => b.status === 'Confirmed').length}</p>
          </div>
        </div>

        <div className="management-section">
          <h2>Available Sevas</h2>
          <button className="btn-add" onClick={handleAddSeva}>
            + Add New Seva
          </button>
        </div>

        <div className="cards-grid">
          {sevaList.map((seva) => (
            <div key={seva.id} className="info-card">
              <div className="card-header">
                <h3>{seva.name}</h3>
                <span className="badge"><GiTempleGate /></span>
              </div>
              <div className="card-body">
                <p><strong>Price:</strong> ₹{seva.price}/-</p>
                <p><strong>Time:</strong> {seva.time}</p>
                <p><strong>Description:</strong> {seva.description}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="btn-action btn-edit"
                  onClick={() => handleEditSeva(seva)}
                >
                  Edit
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDeleteSeva(seva.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="management-section" style={{ marginTop: '3rem' }}>
          <h2>Seva Bookings</h2>
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
                <th>Seva Date</th>
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
                        onClick={() => handleViewDetails(booking)}
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
                    No seva bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Seva Booking Details</h2>
            <div className="booking-details">
              <p><strong>Booking ID:</strong> #{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
              <p><strong>Devotee Name:</strong> {selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Seva Name:</strong> {selectedBooking.sevaName || 'PANCHAMRUTHAM'}</p>
              <p><strong>Seva Type:</strong> {selectedBooking.sevaType || 'Daily Pooja'}</p>
              <p><strong>Seva Date:</strong> {selectedBooking.date}</p>
              <p><strong>Seva Time:</strong> {selectedBooking.sevaTime || '07:30 AM Morning'}</p>
              <p><strong>Sankalpa Location:</strong> {selectedBooking.sankalpaLocation || 'Poojamandira in Prakara'}</p>
              <p><strong>Number of Devotees:</strong> {selectedBooking.devotees || selectedBooking.guests || '2'}</p>
              <p><strong>Amount:</strong> {selectedBooking.amount}</p>
              <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus || 'Paid'}</p>
              <p><strong>Prasada Counter:</strong> {selectedBooking.prasadaCounter || 'Counter No. 10'}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>{selectedBooking.status}</span></p>
              {selectedBooking.specialRequests && (
                <p><strong>Special Instructions:</strong> {selectedBooking.specialRequests}</p>
              )}
            </div>

            <div className="status-buttons">
              <button 
                className="btn-action btn-view"
                onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
              >
                Confirm Seva
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
                Cancel Seva
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn-action" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSevaModal && (
        <div className="modal-overlay" onClick={() => setShowAddSevaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSeva ? 'Edit Seva' : 'Add New Seva'}</h2>
            <form className="modal-form" onSubmit={handleSevaFormSubmit}>
              <div className="form-group">
                <label>Seva Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newSeva.name}
                  onChange={handleSevaFormChange}
                  placeholder="Enter seva name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={newSeva.price}
                  onChange={handleSevaFormChange}
                  placeholder="Enter price"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Seva Time *</label>
                <input
                  type="text"
                  name="time"
                  value={newSeva.time}
                  onChange={handleSevaFormChange}
                  placeholder="e.g., 07:30 AM Morning"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={newSeva.description}
                  onChange={handleSevaFormChange}
                  placeholder="Enter seva description"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">
                  {editingSeva ? 'Update Seva' : 'Add Seva'}
                </button>
                <button 
                  type="button" 
                  className="btn-action" 
                  onClick={() => setShowAddSevaModal(false)}
                >
                  Cancel
                </button>
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

export default ManageSevas;
