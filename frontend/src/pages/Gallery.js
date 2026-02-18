import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Gallery.css';

function Gallery() {
  const { galleryImages } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-page">
      <section className="gallery-header-section">
        <div className="container">
          <h2 className="section-heading">GALLERY</h2>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
            <button 
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              className={selectedCategory === 'temple' ? 'active' : ''}
              onClick={() => setSelectedCategory('temple')}
            >
              Temple
            </button>
            <button 
              className={selectedCategory === 'events' ? 'active' : ''}
              onClick={() => setSelectedCategory('events')}
            >
              Events
            </button>
            <button 
              className={selectedCategory === 'facilities' ? 'active' : ''}
              onClick={() => setSelectedCategory('facilities')}
            >
              Facilities
            </button>
          </div>

          <div className="gallery-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image">
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                </div>
                <div className="gallery-caption">
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;
