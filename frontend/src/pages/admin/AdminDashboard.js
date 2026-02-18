import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { FaCalendarAlt, FaHourglassHalf, FaDonate, FaUsers, FaHome, FaChurch, FaImage } from 'react-icons/fa';
import { GiTempleGate } from 'react-icons/gi';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { bookings, donations } = useData();

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

  // Calculate real stats from Supabase data
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const completedDonations = donations.filter(d => d.status === 'Completed').length;

  const stats = [
    { title: 'Total Bookings', value: totalBookings.toString(), icon: FaCalendarAlt, color: '#4CAF50' },
    { title: 'Pending Approvals', value: pendingBookings.toString(), icon: FaHourglassHalf, color: '#FF9800' },
    { title: 'Total Donations', value: `₹${(totalDonations / 1000).toFixed(1)}K`, icon: FaDonate, color: '#2196F3' },
    { title: 'Completed Donations', value: completedDonations.toString(), icon: FaUsers, color: '#9C27B0' }
  ];

  const managementSections = [
    { title: 'Room Management', icon: FaHome, link: '/admin/rooms', description: 'Manage room availability and pricing' },
    { title: 'Marriage Hall', icon: FaChurch, link: '/admin/halls', description: 'Manage marriage hall bookings' },
    { title: 'Temples', icon: GiTempleGate, link: '/admin/temples', description: 'Manage temple information' },
    { title: 'E-Hundi', icon: FaDonate, link: '/admin/donations', description: 'Manage online donations and E-Hundi' },
    { title: 'Gallery', icon: FaImage, link: '/admin/gallery', description: 'Manage gallery images' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon"><stat.icon /></div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="management-section">
          <h2>Management</h2>
          <div className="management-grid">
            {managementSections.map((section, index) => (
              <Link key={index} to={section.link} className="management-card">
                <div className="management-icon"><section.icon /></div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {bookings.length === 0 && donations.length === 0 ? (
              <div className="activity-item">
                <div className="activity-content">
                  <p>No recent activity</p>
                  <span className="activity-time">Start by adding rooms and halls</span>
                </div>
              </div>
            ) : (
              <>
                {bookings.slice(0, 3).map((booking, index) => (
                  <div key={`booking-${index}`} className="activity-item">
                    <span className="activity-icon"><FaCalendarAlt /></span>
                    <div className="activity-content">
                      <p><strong>New {booking.type} Booking</strong></p>
                      <p>{booking.name} - {booking.date}</p>
                      <span className="activity-time">{booking.status}</span>
                    </div>
                  </div>
                ))}
                {donations.slice(0, 2).map((donation, index) => (
                  <div key={`donation-${index}`} className="activity-item">
                    <span className="activity-icon"><FaDonate /></span>
                    <div className="activity-content">
                      <p><strong>Donation Received</strong></p>
                      <p>₹{donation.amount.toLocaleString()} for {donation.category}</p>
                      <span className="activity-time">{donation.date}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
