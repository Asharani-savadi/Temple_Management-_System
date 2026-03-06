import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OnlineBookingServices.css';
import { FaHome, FaHandHoldingHeart, FaChurch, FaVideo, FaCalendarAlt, FaBook } from 'react-icons/fa';

const OnlineBookingServices = () => {
  const navigate = useNavigate();

  const bookingServices = [
    {
      id: 'room-booking',
      title: 'Room Booking',
      icon: FaHome,
      description: 'Book accommodation rooms at the temple',
      path: '/rooms-donor',
      color: '#fff'
    },
    {
      id: 'e-hindi',
      title: 'E-Hindi',
      icon: FaHandHoldingHeart,
      description: 'Make online donations and contributions',
      path: '/donation',
      color: '#fff'
    },
    {
      id: 'marriage-hall',
      title: 'Marriage Hall',
      icon: FaChurch,
      description: 'Book the marriage hall for your special events',
      path: '/marriage-hall',
      color: '#d97a5c'
    }
  ];

  const otherServices = [
    {
      id: 'live-status',
      title: 'Live Status',
      icon: FaVideo,
      description: 'Watch live temple activities',
      path: '/live-status',
      color: '#fff'
    },
    {
      id: 'panchanga',
      title: 'Panchanga',
      icon: FaCalendarAlt,
      description: 'Check Hindu calendar and auspicious timings',
      path: '/panchanga',
      color: '#fff'
    },
    {
      id: 'latest-news',
      title: 'Latest News',
      icon: FaBook,
      description: 'Read the latest temple news and updates',
      path: '/latest-news',
      color: '#d97a5c'
    }
  ];

  const handleServiceClick = (service) => {
    navigate(service.path);
  };

  return (
    <div className="online-booking-services-container">
      <div className="services-header">
        <h1>Online Booking Services</h1>
        <p>Choose a service to book</p>
      </div>

      <div className="services-grid">
        {bookingServices.map(service => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className="service-card"
              onClick={() => handleServiceClick(service)}
            >
              <div className="service-icon">
                <IconComponent />
              </div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <button className="service-btn">Book Now</button>
            </div>
          );
        })}
      </div>

      <div className="other-services-section">
        <h2 className="section-title">Other Services</h2>
        <div className="services-grid">
          {otherServices.map(service => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`service-card other-service ${service.id === 'latest-news' ? 'highlighted' : ''}`}
                onClick={() => handleServiceClick(service)}
              >
                <div className="service-icon">
                  <IconComponent />
                </div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <button className="service-btn">Explore</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="services-info">
        <h3>Available Services</h3>
        <ul>
          <li><strong>Room Booking:</strong> Reserve comfortable accommodation for your temple stay</li>
          <li><strong>E-Hindi:</strong> Make secure online donations to support temple activities</li>
          <li><strong>Marriage Hall:</strong> Book our beautiful marriage hall for your wedding and celebrations</li>
          <li><strong>Live Status:</strong> Watch live streaming of temple activities and events</li>
          <li><strong>Panchanga:</strong> Check Hindu calendar and auspicious timings for your events</li>
          <li><strong>Latest News:</strong> Stay updated with the latest temple news and announcements</li>
        </ul>
      </div>
    </div>
  );
};

export default OnlineBookingServices;
