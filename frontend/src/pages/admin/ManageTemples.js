import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { GiTempleGate } from 'react-icons/gi';
import './AdminManage.css';

function ManageTemples() {
  const navigate = useNavigate();
  const { temples, addTemple, updateTemple, deleteTemple } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTemple, setCurrentTemple] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
    contact: '',
    timings: ''
  });

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

  const handleAdd = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      image: '',
      contact: '',
      timings: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (temple) => {
    setCurrentTemple(temple);
    setFormData({
      name: temple.name,
      location: temple.location,
      description: temple.description || '',
      image: temple.image || '',
      contact: temple.contact || '',
      timings: temple.timings || ''
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await addTemple(formData);
      setShowAddModal(false);
      alert('Temple added successfully!');
    } catch (error) {
      alert('Error adding temple: ' + error.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateTemple(currentTemple.id, formData);
      setShowEditModal(false);
      alert('Temple updated successfully!');
    } catch (error) {
      alert('Error updating temple: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this temple?')) {
      try {
        await deleteTemple(id);
        alert('Temple deleted successfully!');
      } catch (error) {
        alert('Error deleting temple: ' + error.message);
      }
    }
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1><GiTempleGate /> Manage Temples</h1>
          <div className="header-actions">
            <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="manage-container">
        <div className="manage-actions">
          <input type="text" placeholder="Search temples..." className="search-input" />
          <button className="btn-add" onClick={handleAdd}>+ Add Temple</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Timings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {temples && temples.length > 0 ? (
                temples.map(temple => (
                  <tr key={temple.id}>
                    <td>#{temple.id}</td>
                    <td>{temple.name}</td>
                    <td>{temple.location}</td>
                    <td>{temple.contact || 'N/A'}</td>
                    <td>{temple.timings || 'N/A'}</td>
                    <td>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(temple)}>Edit</button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(temple.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No temples found. Click "Add Temple" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Temple</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="form-group">
                <label>Temple Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label>Timings</label>
                <input
                  type="text"
                  value={formData.timings}
                  onChange={(e) => setFormData({...formData, timings: e.target.value})}
                  placeholder="6:00 AM - 9:00 PM"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-action btn-view" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-action btn-edit">Add Temple</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Temple</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="form-group">
                <label>Temple Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label>Timings</label>
                <input
                  type="text"
                  value={formData.timings}
                  onChange={(e) => setFormData({...formData, timings: e.target.value})}
                  placeholder="6:00 AM - 9:00 PM"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-action btn-view" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-action btn-edit">Update Temple</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTemples;
