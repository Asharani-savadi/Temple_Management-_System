import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Receipt from '../../components/Receipt';
import './AdminManage.css';

function ManageDonations() {
  const { donations, deleteDonation } = useData();
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const totalDonations = donations.reduce((sum, d) => {
    const amount = typeof d.amount === 'number' ? d.amount : parseFloat(d.amount.replace(/[₹,]/g, '')) || 0;
    return sum + amount;
  }, 0);

  // Calculate this month's donations
  const thisMonthDonations = donations.reduce((sum, d) => {
    const donationDate = new Date(d.date);
    const now = new Date();
    const isThisMonth = donationDate.getMonth() === now.getMonth() && 
                        donationDate.getFullYear() === now.getFullYear();
    
    if (isThisMonth) {
      const amount = typeof d.amount === 'number' ? d.amount : parseFloat(d.amount.replace(/[₹,]/g, '')) || 0;
      return sum + amount;
    }
    return sum;
  }, 0);

  // Calculate total unique donors
  const uniqueDonors = new Set(donations.map(d => d.name || d.donor)).size;

  const handleView = (donation) => {
    setCurrentDonation(donation);
    setShowViewModal(true);
  };

  const handleReceipt = (donation) => {
    // Format donation data to match receipt component expectations
    const formattedDonation = {
      ...donation,
      type: 'Donation',
      name: donation.name || donation.donor,
      amount: typeof donation.amount === 'number' ? `₹${donation.amount.toLocaleString()}` : donation.amount
    };
    setCurrentDonation(formattedDonation);
    setShowReceipt(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      try {
        await deleteDonation(id);
        alert('Donation record deleted successfully!');
      } catch (error) {
        alert('Error deleting donation: ' + error.message);
      }
    }
  };

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Manage Donations</h1>
          <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="manage-container">
        <div className="stats-row">
          <div className="stat-box">
            <h3>Total Donations</h3>
            <p className="stat-value">₹{totalDonations.toLocaleString()}</p>
          </div>
          <div className="stat-box">
            <h3>This Month</h3>
            <p className="stat-value">₹{thisMonthDonations.toLocaleString()}</p>
          </div>
          <div className="stat-box">
            <h3>Total Donors</h3>
            <p className="stat-value">{uniqueDonors}</p>
          </div>
        </div>

        <div className="manage-actions">
          <input type="text" placeholder="Search donations..." className="search-input" />
          <select className="filter-select">
            <option>All Categories</option>
            <option>Annadhana</option>
            <option>Goshala</option>
            <option>Constructions</option>
            <option>Vidhyadhana</option>
          </select>
          <button className="btn-add">Export Report</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Donor Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(donation => (
                <tr key={donation.id}>
                  <td>#{donation.id}</td>
                  <td>{donation.name || donation.donor}</td>
                  <td>{donation.purpose || donation.category}</td>
                  <td>{typeof donation.amount === 'number' ? `₹${donation.amount.toLocaleString()}` : donation.amount}</td>
                  <td>{donation.date}</td>
                  <td>
                    <span className={`status-badge ${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-view" onClick={() => handleView(donation)}>View</button>
                    <button className="btn-action btn-edit" onClick={() => handleReceipt(donation)}>Receipt</button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(donation.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && currentDonation && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Donation Details</h2>
            <div className="booking-details">
              <p><strong>ID:</strong> #{currentDonation.id}</p>
              <p><strong>Donor Name:</strong> {currentDonation.name || currentDonation.donor}</p>
              {currentDonation.email && <p><strong>Email:</strong> {currentDonation.email}</p>}
              {currentDonation.phone && <p><strong>Phone:</strong> {currentDonation.phone}</p>}
              {currentDonation.address && <p><strong>Address:</strong> {currentDonation.address}</p>}
              {currentDonation.panNumber && <p><strong>PAN Number:</strong> {currentDonation.panNumber}</p>}
              <p><strong>Category/Purpose:</strong> {currentDonation.purpose || currentDonation.category}</p>
              <p><strong>Amount:</strong> {typeof currentDonation.amount === 'number' ? `₹${currentDonation.amount.toLocaleString()}` : currentDonation.amount}</p>
              <p><strong>Date:</strong> {currentDonation.date}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${currentDonation.status.toLowerCase()}`}>{currentDonation.status}</span></p>
            </div>
            <div className="modal-actions">
              <button className="btn-action btn-view" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="btn-action btn-edit" onClick={() => handleReceipt(currentDonation)}>Generate Receipt</button>
            </div>
          </div>
        </div>
      )}
      {showReceipt && currentDonation && (
        <Receipt booking={currentDonation} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
}

export default ManageDonations;
