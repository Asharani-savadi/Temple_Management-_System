import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import './AdminManage.css';

function ManageGallery() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'temple',
    url: ''
  });

  const handleAdd = () => {
    setFormData({ title: '', category: 'temple', url: '' });
    setShowAddModal(true);
  };

  const handleEdit = (image) => {
    setCurrentImage(image);
    setFormData({
      title: image.title,
      category: image.category,
      url: image.url
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        alert('Image deleted successfully!');
      } catch (error) {
        alert('Error deleting image: ' + error.message);
      }
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await addGalleryImage(formData);
      setShowAddModal(false);
      alert('Image added successfully!');
    } catch (error) {
      alert('Error adding image: ' + error.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateGalleryImage(currentImage.id, formData);
      setShowEditModal(false);
      alert('Image updated successfully!');
    } catch (error) {
      alert('Error updating image: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Gallery</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="manage-actions">
          <input type="text" placeholder="Search images..." className="search-input" />
          <select className="filter-select">
            <option>All Categories</option>
            <option>Temple</option>
            <option>Events</option>
            <option>Facilities</option>
          </select>
          <button className="btn-add" onClick={handleAdd}>+ Upload Images</button>
        </div>

        <div className="gallery-grid">
          {galleryImages.map(image => (
            <div key={image.id} className="gallery-card">
              <img src={image.url} alt={image.title} />
              <div className="gallery-card-content">
                <h4>{image.title}</h4>
                <span className="category-badge">{image.category}</span>
                <div className="gallery-card-actions">
                  <button className="btn-action btn-edit" onClick={() => handleEdit(image)}>Edit</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(image.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Image</h2>
            <form className="modal-form" onSubmit={handleSubmitAdd}>
              <input 
                type="text" 
                name="title"
                placeholder="Image Title" 
                value={formData.title}
                onChange={handleChange}
                required 
              />
              <input 
                type="url" 
                name="url"
                placeholder="Image URL" 
                value={formData.url}
                onChange={handleChange}
                required 
              />
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="temple">Temple</option>
                <option value="events">Events</option>
                <option value="facilities">Facilities</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">Add Image</button>
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
            <h2>Edit Image</h2>
            <form className="modal-form" onSubmit={handleSubmitEdit}>
              <input 
                type="text" 
                name="title"
                placeholder="Image Title" 
                value={formData.title}
                onChange={handleChange}
                required 
              />
              <input 
                type="url" 
                name="url"
                placeholder="Image URL" 
                value={formData.url}
                onChange={handleChange}
                required 
              />
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="temple">Temple</option>
                <option value="events">Events</option>
                <option value="facilities">Facilities</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-action btn-view">Update Image</button>
                <button type="button" className="btn-action btn-delete" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageGallery;
