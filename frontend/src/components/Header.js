import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { FaUserShield } from 'react-icons/fa';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

          <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <button className="close-btn" onClick={toggleMobileMenu}><IoClose /></button>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>Booking</Link>
            <Link to="/online-booking-services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/admin/login" className="admin-login-btn" onClick={() => setMobileMenuOpen(false)}>
              <FaUserShield /> Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
