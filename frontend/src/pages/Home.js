import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { GiTempleGate, GiPrayer } from 'react-icons/gi';
import { FaHome, FaDonate, FaChurch, FaTv, FaLaptop, FaUsers, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { GiCow, GiMusicalNotes } from 'react-icons/gi';
import { IoLibrary } from 'react-icons/io5';
import { BiMusic } from 'react-icons/bi';

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);

  const heroSlides = [
    {
      title: "Welcome to Divine Blessings",
      subtitle: "Experience spiritual serenity and divine grace",
      icon: GiTempleGate
    },
    {
      title: "Book Your Stay",
      subtitle: "Comfortable rooms for pilgrims and devotees",
      icon: FaHome
    },
    {
      title: "Join Our Community",
      subtitle: "Be part of our spiritual journey",
      icon: GiPrayer
    }
  ];

  const projectsData = {
    goshala: {
      title: "GOSHALA",
      icon: GiCow,
      description: "Our Goshala is dedicated to the protection and care of sacred cows. We provide shelter, food, and medical care to abandoned and injured cattle.",
      features: [
        "Shelter for 100+ cows",
        "24/7 veterinary care",
        "Organic farming with cow products",
        "Educational programs on cow protection"
      ],
      stats: {
        cows: "100+",
        area: "5 acres",
        volunteers: "50+"
      }
    },
    vidyapeetha: {
      title: "VIDYAPEETHA",
      icon: IoLibrary,
      description: "Our Vidyapeetha is a center for traditional Vedic education and spiritual learning. We offer courses in Sanskrit, philosophy, and ancient scriptures.",
      features: [
        "Traditional Vedic education",
        "Sanskrit language courses",
        "Philosophy and scripture studies",
        "Residential programs for students"
      ],
      stats: {
        students: "200+",
        courses: "15+",
        teachers: "25+"
      }
    },
    museum: {
      title: "DASASAHITYA MUSEUM",
      icon: GiMusicalNotes,
      description: "A unique museum dedicated to preserving and showcasing the rich heritage of Dasa literature and devotional music traditions.",
      features: [
        "Rare manuscripts collection",
        "Audio archives of devotional songs",
        "Interactive exhibits",
        "Regular cultural programs"
      ],
      stats: {
        artifacts: "500+",
        recordings: "1000+",
        visitors: "10,000+"
      }
    }
  };

  const audioData = {
    stotras: {
      title: "STOTRAS",
      icon: GiMusicalNotes,
      description: "Sacred hymns and verses praising deities. Stotras are powerful devotional compositions that invoke divine blessings and spiritual energy.",
      tracks: [
        "Vishnu Sahasranama",
        "Lalitha Sahasranama",
        "Shiva Stotram",
        "Hanuman Chalisa",
        "Durga Stotram",
        "Ganesha Stotram"
      ],
      stats: {
        tracks: "50+",
        duration: "10 hrs",
        languages: "5+"
      }
    },
    bhajans: {
      title: "BHAJANS",
      icon: BiMusic,
      description: "Devotional songs expressing love and devotion to God. Bhajans create a spiritual atmosphere and connect devotees with the divine.",
      tracks: [
        "Krishna Bhajans",
        "Rama Bhajans",
        "Sai Baba Bhajans",
        "Devi Bhajans",
        "Shiva Bhajans",
        "Ganesh Bhajans"
      ],
      stats: {
        tracks: "100+",
        duration: "20 hrs",
        artists: "25+"
      }
    },
    mantras: {
      title: "MANTRAS",
      icon: GiTempleGate,
      description: "Sacred sound vibrations with spiritual power. Mantras are ancient Vedic chants that purify the mind and elevate consciousness.",
      tracks: [
        "Gayatri Mantra",
        "Maha Mrityunjaya Mantra",
        "Om Namah Shivaya",
        "Hare Krishna Mantra",
        "Lakshmi Mantra",
        "Saraswati Mantra"
      ],
      stats: {
        tracks: "75+",
        duration: "15 hrs",
        traditions: "10+"
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setStatsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="hero-content">
                <div className="hero-icon"><slide.icon /></div>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <button onClick={() => navigate('/booking')} className="hero-cta">Book Now</button>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className={`stat-card ${statsVisible ? 'visible' : ''}`}>
              <div className="stat-icon"><FaUsers /></div>
              <div className="stat-info">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Happy Devotees</div>
              </div>
            </div>
            <div className={`stat-card ${statsVisible ? 'visible' : ''}`}>
              <div className="stat-icon"><FaHome /></div>
              <div className="stat-info">
                <div className="stat-number">50+</div>
                <div className="stat-label">Rooms Available</div>
              </div>
            </div>
            <div className={`stat-card ${statsVisible ? 'visible' : ''}`}>
              <div className="stat-icon"><FaStar /></div>
              <div className="stat-info">
                <div className="stat-number">4.8/5</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
            <div className={`stat-card ${statsVisible ? 'visible' : ''}`}>
              <div className="stat-icon"><FaCalendarAlt /></div>
              <div className="stat-info">
                <div className="stat-number">365</div>
                <div className="stat-label">Days Open</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-heading">ONLINE BOOKING SERVICES</h2>
          
          <div className="service-grid">
            <button onClick={() => navigate('/booking?type=rooms')} className="service-btn">
              <span className="icon"><FaHome /></span>
              <span>ROOM BOOKING</span>
            </button>
            <a href="/services" className="service-btn">
              <span className="icon"><FaDonate /></span>
              <span>E-HUNDI</span>
            </a>
            <button onClick={() => navigate('/booking?type=marriage')} className="service-btn">
              <span className="icon"><FaChurch /></span>
              <span>MARRIAGE HALL</span>
            </button>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-heading">OTHER SERVICES</h2>
          
          <div className="service-grid">
            <a href="/live-status" className="service-btn">
              <span className="icon"><FaTv /></span>
              <span>LIVE STATUS</span>
            </a>
            <a href="/panchanga" className="service-btn">
              <span className="icon"><MdRestaurant /></span>
              <span>PANCHANGA</span>
            </a>
            <a href="/contact" className="service-btn">
              <span className="icon"><FaLaptop /></span>
              <span>TECH SUPPORT</span>
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="container">
          <h2 className="section-heading">PROJECTS</h2>
          <div className="projects-grid">
            <button className="project-btn" onClick={() => setSelectedProject('goshala')}>
              <span className="icon"><GiCow /></span>
              <span>GOSHALA</span>
            </button>
            <button className="project-btn" onClick={() => setSelectedProject('vidyapeetha')}>
              <span className="icon"><IoLibrary /></span>
              <span>VIDYAPEETHA</span>
            </button>
            <button className="project-btn" onClick={() => setSelectedProject('museum')}>
              <span className="icon"><GiMusicalNotes /></span>
              <span>DASASAHITYA MUSEUM</span>
            </button>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>
            <div className="modal-header">
              <div className="modal-icon">
                {React.createElement(projectsData[selectedProject].icon)}
              </div>
              <h2>{projectsData[selectedProject].title}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-description">{projectsData[selectedProject].description}</p>
              
              <div className="modal-stats">
                {Object.entries(projectsData[selectedProject].stats).map(([key, value]) => (
                  <div key={key} className="modal-stat">
                    <div className="modal-stat-value">{value}</div>
                    <div className="modal-stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  </div>
                ))}
              </div>

              <div className="modal-features">
                <h3>Key Features</h3>
                <ul>
                  {projectsData[selectedProject].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <button className="modal-donate-btn" onClick={() => navigate('/services')}>
                <FaDonate /> Support This Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-heading">WHAT DEVOTEES SAY</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "A truly divine experience. The facilities are excellent and the staff is very helpful."
              </p>
              <div className="testimonial-author">- Rajesh Kumar</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "Peaceful atmosphere and well-maintained rooms. Perfect for spiritual retreat."
              </p>
              <div className="testimonial-author">- Priya Sharma</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "The online booking system is very convenient. Highly recommended!"
              </p>
              <div className="testimonial-author">- Amit Patel</div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Section */}
      <section className="audio-section">
        <div className="container">
          <h2 className="section-heading">AUDIO JUKEBOX</h2>
          <div className="audio-grid">
            <button className="audio-btn" onClick={() => setSelectedAudio('stotras')}>
              <span className="audio-icon"><GiMusicalNotes /></span>
              STOTRAS
            </button>
            <button className="audio-btn" onClick={() => setSelectedAudio('bhajans')}>
              <span className="audio-icon"><BiMusic /></span>
              BHAJANS
            </button>
            <button className="audio-btn" onClick={() => setSelectedAudio('mantras')}>
              <span className="audio-icon"><GiTempleGate /></span>
              MANTRAS
            </button>
          </div>
        </div>
      </section>

      {/* Audio Modal */}
      {selectedAudio && (
        <div className="audio-modal-overlay" onClick={() => setSelectedAudio(null)}>
          <div className="audio-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAudio(null)}>×</button>
            <div className="modal-header">
              <div className="modal-icon">
                {React.createElement(audioData[selectedAudio].icon)}
              </div>
              <h2>{audioData[selectedAudio].title}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-description">{audioData[selectedAudio].description}</p>
              
              <div className="modal-stats">
                {Object.entries(audioData[selectedAudio].stats).map(([key, value]) => (
                  <div key={key} className="modal-stat">
                    <div className="modal-stat-value">{value}</div>
                    <div className="modal-stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  </div>
                ))}
              </div>

              <div className="modal-tracks">
                <h3>Popular Tracks</h3>
                <div className="tracks-list">
                  {audioData[selectedAudio].tracks.map((track, index) => (
                    <div key={index} className="track-item">
                      <span className="track-number">{index + 1}</span>
                      <span className="track-name">{track}</span>
                      <button className="track-play-btn">▶</button>
                    </div>
                  ))}
                </div>
              </div>

              <button className="modal-view-all-btn">
                <BiMusic /> View All Tracks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
