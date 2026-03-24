import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      text: 'A truly divine experience. The facilities are excellent and the staff is very helpful.',
      rating: 5,
      type: 'saffron'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      text: 'Peaceful atmosphere and well-maintained rooms. Perfect for spiritual retreat.',
      rating: 5,
      type: 'sandalwood'
    },
    {
      id: 3,
      name: 'Amit Patel',
      text: 'The online booking system is very convenient. Highly recommended!',
      rating: 5,
      type: 'vermillion'
    },
    {
      id: 4,
      name: 'Neha Singh',
      text: 'Amazing spiritual experience with wonderful hospitality and care.',
      rating: 5,
      type: 'turmeric'
    },
    {
      id: 5,
      name: 'Vikram Desai',
      text: 'Best temple visit ever. The darshan booking system made everything so easy.',
      rating: 5,
      type: 'sacred-green'
    },
    {
      id: 6,
      name: 'Sunita Rao',
      text: 'The serenity and divine energy here is unmatched. I felt truly blessed throughout my stay.',
      rating: 5,
      type: 'saffron'
    },
    {
      id: 7,
      name: 'Manoj Tiwari',
      text: 'Excellent arrangements for pilgrims. The rooms are clean and the prasad is delicious.',
      rating: 5,
      type: 'vermillion'
    },
    {
      id: 8,
      name: 'Kavitha Nair',
      text: 'A spiritually enriching journey. The staff was warm and the facilities were top-notch.',
      rating: 5,
      type: 'turmeric'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <div className="fleur-left">✦</div>
        <h2 className="testimonials-title">What Devotees Say</h2>
        <div className="fleur-right">✦</div>
      </div>

      <div className="testimonials-container">
        <div className="testimonials-grid">
          {getVisibleTestimonials().map((testimonial) => (
            <div
              key={testimonial.id}
              className={`testimonial-card ${testimonial.type}`}
            >
              <div className="quote-icon">❝</div>
              <div className="stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="testimonial-author">- {testimonial.name}</p>
            </div>
          ))}
        </div>

        <div className="testimonials-controls">
          <button className="control-btn prev" onClick={prevSlide}>
            ❮
          </button>
          <button className="control-btn next" onClick={nextSlide}>
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
