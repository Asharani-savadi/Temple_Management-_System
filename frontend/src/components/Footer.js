import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about-section">
            <h3>About Us</h3>
            <p className="footer-description">
              A spiritual sanctuary dedicated to serving devotees, preserving sacred traditions, 
              and fostering spiritual growth through devotion and service.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/booking">Book Now</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/booking">Room Booking</Link></li>
              <li><Link to="/booking">Marriage Hall</Link></li>
              <li><Link to="/services">Donations</Link></li>
              <li><Link to="/services">Panchanga</Link></li>
              <li><Link to="/services">Live Darshan</Link></li>
            </ul>
          </div>
          
          <div className="footer-section contact-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p><FaPhone /> <span>+91 XXXXXXXXXX</span></p>
              <p><FaEnvelope /> <span>info@temple.org</span></p>
              <p><FaMapMarkerAlt /> <span>Temple Street, City, State - 000000</span></p>
              <p><FaClock /> <span>Open Daily: 6:00 AM - 9:00 PM</span></p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Temple Management System. All rights reserved.</p>
            <p className="footer-tagline">
              <FaHeart className="heart-icon" /> Built with devotion for devotees
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
