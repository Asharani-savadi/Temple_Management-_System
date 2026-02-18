import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    console.log('Contact form data:', formData);
  };

  return (
    <div className="contact-page">
      <section className="contact-header-section">
        <div className="container">
          <h2 className="section-heading">CONTACT US</h2>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <div className="info-item">
                <h3><FaMapMarkerAlt /> Address</h3>
                <p>Spiritual Matha<br />Your City, State<br />PIN Code</p>
              </div>
              <div className="info-item">
                <h3><FaPhone /> Phone</h3>
                <p>+91 XXXXXXXXXX</p>
                <p>+91 XXXXXXXXXX</p>
              </div>
              <div className="info-item">
                <h3><FaEnvelope /> Email</h3>
                <p>info@example.com</p>
                <p>support@example.com</p>
              </div>
              <div className="info-item">
                <h3><FaClock /> Office Hours</h3>
                <p>Monday - Sunday: 8:00 AM - 8:00 PM</p>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Us</h2>
          <div className="map-placeholder">
            <p>Map Location Placeholder</p>
            <p>Integrate Google Maps or other map service here</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
