import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { FaPrayingHands, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import './AdminManage.css';

const EMPTY_SLOT = {
  templeId: '',
  templeName: '',
  darshanType: '',
  date: '',
  timeSlot: '',
  maxCapacity: '',
  price: '',
  status: 'Active'
};

function ManageDarshan() {
  const [slots, setSlots] = useState(() => {
    try { return JSON.parse(localStorage.getItem('darshanSlots')) || []; } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_SLOT);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('darshanSlots', JSON.stringify(slots));
  }, [slots]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setSlots(slots.map(s => s.id === editId ? { ...form, id: editId } : s));
    } else {
      setSlots([...slots, { ...form, id: Date.now() }]);
    }
    setForm(EMPTY_SLOT);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (slot) => {
    setForm(slot);
    setEditId(slot.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this darshan slot?')) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  const filtered = slots.filter(s =>
    s.templeName.toLowerCase().includes(search.toLowerCase()) ||
    s.darshanType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-manage-page">
      <AdminNavbar />
      <div className="manage-container">
        <div className="manage-header">
          <h1><FaPrayingHands /> Manage Darshan Bookings</h1>
        </div>

        <div className="manage-toolbar">
          <input
            className="manage-search"
            placeholder="Search by temple or darshan type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="manage-add-btn" onClick={() => { setForm(EMPTY_SLOT); setEditId(null); setShowForm(true); }}>
            <FaPlus /> Add Darshan Slot
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="manage-modal-overlay" onClick={() => setShowForm(false)}>
            <div className="manage-modal" onClick={e => e.stopPropagation()}>
              <div className="manage-modal-header">
                <h2>{editId ? 'Edit Darshan Slot' : 'Add Darshan Slot'}</h2>
                <button className="modal-close-btn" onClick={() => setShowForm(false)}><FaTimes /></button>
              </div>
              <form className="manage-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Temple Name</label>
                    <input required value={form.templeName} onChange={e => setForm({ ...form, templeName: e.target.value })} placeholder="e.g. Ganesh Temple" />
                  </div>
                  <div className="form-group">
                    <label>Darshan Type</label>
                    <select required value={form.darshanType} onChange={e => setForm({ ...form, darshanType: e.target.value })}>
                      <option value="">Select type</option>
                      <option>General Darshan</option>
                      <option>VIP Darshan</option>
                      <option>Special Pooja</option>
                      <option>Abhishekam</option>
                      <option>Seva Darshan</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Time Slot</label>
                    <input required value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} placeholder="e.g. 6:00 AM - 8:00 AM" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Max Capacity</label>
                    <input type="number" required min="1" value={form.maxCapacity} onChange={e => setForm({ ...form, maxCapacity: e.target.value })} placeholder="e.g. 50" />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" required min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0 for free" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option>Active</option>
                      <option>Full</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-save">{editId ? 'Update' : 'Add Slot'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="manage-table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Temple</th>
                <th>Darshan Type</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No darshan slots found. Click "+ Add Darshan Slot" to create one.</td></tr>
              ) : (
                filtered.map((slot, i) => (
                  <tr key={slot.id}>
                    <td>#{i + 1}</td>
                    <td>{slot.templeName}</td>
                    <td>{slot.darshanType}</td>
                    <td>{slot.date}</td>
                    <td>{slot.timeSlot}</td>
                    <td>{slot.maxCapacity}</td>
                    <td>{slot.price === '0' || slot.price === 0 ? 'Free' : `₹${slot.price}`}</td>
                    <td>
                      <span className={`status-badge status-${slot.status.toLowerCase()}`}>{slot.status}</span>
                    </td>
                    <td className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(slot)}><FaEdit /> Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(slot.id)}><FaTrash /> Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageDarshan;
