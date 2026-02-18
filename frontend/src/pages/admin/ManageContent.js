import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminManage.css';

function ManageContent() {
  const [activeTab, setActiveTab] = useState('about');
  const [content, setContent] = useState({
    about: 'Our matha has a rich spiritual heritage spanning many generations...',
    services: 'We offer various spiritual services including daily pooja, special sevas...',
    contact: 'Email: info@example.org\nPhone: +91 XXXXXXXXXX'
  });

  const handleSave = () => {
    alert('Content saved successfully!');
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Content</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="content-tabs">
          <button 
            className={activeTab === 'about' ? 'tab-active' : ''}
            onClick={() => setActiveTab('about')}
          >
            About Page
          </button>
          <button 
            className={activeTab === 'services' ? 'tab-active' : ''}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button 
            className={activeTab === 'contact' ? 'tab-active' : ''}
            onClick={() => setActiveTab('contact')}
          >
            Contact Info
          </button>
        </div>

        <div className="content-editor">
          <h3>Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content</h3>
          <textarea
            value={content[activeTab]}
            onChange={(e) => setContent({...content, [activeTab]: e.target.value})}
            rows="15"
            className="content-textarea"
          />
          <button className="btn-add" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default ManageContent;
