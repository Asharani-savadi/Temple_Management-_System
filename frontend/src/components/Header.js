import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">spiritual math</Link>
          </div>

          <button className="menu-toggle" onClick={toggleMobileMenu}>
            <HiMenu />
          </button>

          <div className="header-right">
            <LanguageSelector />
          </div>

          <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>Booking</Link>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

            {user ? (
              <>
                <Link to="/profile" className="nav-user-btn" onClick={() => setMobileMenuOpen(false)}>
                  <FaUser /> {user.name.split(' ')[0]}
                </Link>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-login-btn" onClick={() => setMobileMenuOpen(false)}>
                <FaSignInAlt /> Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
