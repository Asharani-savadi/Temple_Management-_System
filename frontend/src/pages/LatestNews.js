import React from 'react';
import './Services.css';

function LatestNews() {
  const newsItems = [
    {
      id: 1,
      date: 'Dec 20, 2025',
      title: 'Annual Festival Announcement',
      content: 'We are pleased to announce our annual festival will be held from January 15-20, 2026. Special poojas and cultural programs are planned.',
      category: 'Events'
    },
    {
      id: 2,
      date: 'Dec 18, 2025',
      title: 'New Marriage Hall Inauguration',
      content: 'Our newly constructed marriage hall with a capacity of 500 guests will be inaugurated on December 25, 2025.',
      category: 'Facilities'
    },
    {
      id: 3,
      date: 'Dec 15, 2025',
      title: 'Goshala Expansion Project',
      content: 'The Goshala expansion project is now complete. We can now accommodate 50 more cows. Thank you to all donors.',
      category: 'Projects'
    },
    {
      id: 4,
      date: 'Dec 10, 2025',
      title: 'Special Pooja Timings',
      content: 'During the festival season, special pooja timings will be from 5 AM to 9 PM. Please plan your visit accordingly.',
      category: 'Announcements'
    }
  ];

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="container">
          <h1>📰 Latest News</h1>
          <p>Stay updated with temple news and announcements</p>
        </div>
      </section>

      <section className="service-content">
        <div className="container">
          <div className="news-grid">
            {newsItems.map((news) => (
              <div key={news.id} className="news-card">
                <div className="news-header">
                  <span className="news-category">{news.category}</span>
                  <span className="news-date">{news.date}</span>
                </div>
                <h3 className="news-title">{news.title}</h3>
                <p className="news-content">{news.content}</p>
                <button className="btn-read-more">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LatestNews;
