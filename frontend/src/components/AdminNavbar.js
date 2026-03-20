import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars, FaTimes, FaSignOutAlt, FaPrayingHands,
  FaHome, FaCalendarAlt, FaDonate, FaUsers, FaImage,
  FaFileAlt, FaCog, FaChurch
} from 'react-icons/fa';
import { GiTempleGate } from 'react-icons/gi';
import './AdminNavbar.css';

const navLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: FaHome },
  { label: 'Bookings',  to: '/admin/bookings',  icon: FaCalendarAlt },
  { label: 'Rooms',     to: '/admin/rooms',     icon: FaHome },
  { label: 'Halls',     to: '/admin/halls',     icon: FaChurch },
  { label: 'Donations', to: '/admin/donations', icon: FaDonate },
  { label: 'Gallery',   to: '/admin/gallery',   icon: FaImage },
  { label: 'Temples',   to: '/admin/temples',   icon: GiTempleGate },
  { label: 'Users',     to: '/admin/users',     icon: FaUsers },
  { label: 'Content',   to: '/admin/content',   icon: FaFileAlt },
  { label: 'Settings',  to: '/admin/settings',  icon: FaCog },
];

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">
        <div className="admin-navbar-logo">
          <FaPrayingHands />
          <span>Admin Panel</span>
        </div>

        <button className="admin-menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`admin-nav${open ? ' open' : ''}`}>
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`admin-nav-link${location.pathname === to ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon /> <span>{label}</span>
            </Link>
          ))}
          <button className="admin-nav-logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default AdminNavbar;
