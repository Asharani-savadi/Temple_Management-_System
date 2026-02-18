import './About.css';
import { FaOm, FaHandsHelping, FaBook, FaHeart, FaUsers, FaPray } from 'react-icons/fa';

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="container">
            <h1>About Our Temple</h1>
            <p>A Place of Peace, Devotion, and Community Service</p>
          </div>
        </div>
      </section>

      <section className="section intro-section">
        <div className="container">
          <div className="intro-content">
            <div className="intro-icon">
              <FaOm />
            </div>
            <h2>Welcome to Our Temple</h2>
            <p className="intro-text">
              Our temple stands as a beacon of spiritual light, dedicated to preserving ancient traditions 
              while serving the modern community. We have been a center of divine grace, spiritual learning, 
              and selfless service for many years, welcoming devotees from all walks of life.
            </p>
          </div>
        </div>
      </section>

      <section className="section history-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-image">
              <div className="image-placeholder">
                <FaPray className="placeholder-icon" />
              </div>
            </div>
            <div className="content-text">
              <h2>Our Heritage</h2>
              <p>
                Founded with divine blessings, our temple has been a destination for devotees seeking spiritual 
                solace and peace. The sacred atmosphere continues to bless all who visit with an open heart 
                and sincere devotion.
              </p>
              <p>
                Through years of dedicated service, we have maintained the sanctity of our traditions while 
                embracing devotees from all backgrounds. Our doors remain open to all seekers of truth, 
                peace, and spiritual wisdom.
              </p>
              <div className="stats-row">
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Years of Service</p>
                </div>
                <div className="stat-item">
                  <h3>25K+</h3>
                  <p>Annual Visitors</p>
                </div>
                <div className="stat-item">
                  <h3>365</h3>
                  <p>Days of Worship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="container">
          <h2 className="section-title">Our Mission & Values</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="card-icon">
                <FaBook />
              </div>
              <h3>Spiritual Education</h3>
              <p>Providing spiritual knowledge and teachings to guide seekers on their path to inner peace and enlightenment</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">
                <FaHandsHelping />
              </div>
              <h3>Community Service</h3>
              <p>Serving the community through charitable activities, food distribution, and support for those in need</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">
                <FaHeart />
              </div>
              <h3>Devotional Practice</h3>
              <p>Fostering devotion through daily worship, festivals, and spiritual programs throughout the year</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">
                <FaUsers />
              </div>
              <h3>Cultural Heritage</h3>
              <p>Preserving and promoting our rich cultural traditions, music, and arts for future generations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <p className="section-subtitle">Milestones in Our Temple's History</p>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Foundation</h3>
                <span className="timeline-date">1970s</span>
                <p>The temple was established with the vision of creating a spiritual sanctuary for the community, built on principles of devotion and service</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Expansion</h3>
                <span className="timeline-date">1990s - 2000s</span>
                <p>Major renovations and expansions were undertaken to accommodate the growing community and enhance facilities for devotees</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Modern Era</h3>
                <span className="timeline-date">2010 - Present</span>
                <p>Embracing technology and modern amenities while preserving traditional values, making spiritual services accessible to all</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Experience Peace and Devotion</h2>
            <p>Visit us to experience the sacred atmosphere and find inner peace in our spiritual sanctuary</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">Plan Your Visit</a>
              <a href="/services" className="btn btn-secondary">Our Services</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
