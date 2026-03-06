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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'Thank you for contacting us! We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({
        type: 'error',
        text: 'Failed to send message. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
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
              {message.text && (
                <div className={`message-alert ${message.type}`}>
                  {message.text}
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  ></textarea>
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Us</h2>
          <div className="map-placeholder">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30569.26295315397!2d75.068193!3d16.718973!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc729f35cda6e67%3A0x895e51d030f29895!2sK.L.E.%20Society%E2%80%99s%20Shri%20Shivayogi%20Murughendra%20Swamiji%20BCA%20College%2C%20Athani!5e0!3m2!1sen!2sin!4v1772349857967!5m2!1sen!2sin" 
              width="600" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
