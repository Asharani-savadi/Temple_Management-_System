import React from 'react';
import './Services.css';

function Panchanga() {
  // Get today's date dynamically
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

  const todayPanchanga = {
    date: formattedDate,
    day: dayName,
    tithi: 'Ekadashi',
    nakshatra: 'Rohini',
    yoga: 'Siddha',
    karana: 'Bava',
    sunrise: '6:30 AM',
    sunset: '6:15 PM',
    moonrise: '8:45 PM',
    moonset: '7:30 AM'
  };

  const auspiciousTimes = [
    { time: '6:30 AM - 8:00 AM', activity: 'Morning Prayers' },
    { time: '11:00 AM - 12:30 PM', activity: 'Temple Visit' },
    { time: '5:00 PM - 6:15 PM', activity: 'Evening Aarti' }
  ];

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="container">
          <h1>🍽️ Panchanga</h1>
          <p>Daily Hindu calendar and auspicious timings</p>
        </div>
      </section>

      <section className="service-content">
        <div className="container">
          <div className="panchanga-card">
            <h2>Today's Panchanga</h2>
            <div className="panchanga-details">
              <div className="panchanga-item">
                <span className="label">Date:</span>
                <span className="value">{todayPanchanga.date}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Day:</span>
                <span className="value">{todayPanchanga.day}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Tithi:</span>
                <span className="value">{todayPanchanga.tithi}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Nakshatra:</span>
                <span className="value">{todayPanchanga.nakshatra}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Yoga:</span>
                <span className="value">{todayPanchanga.yoga}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Karana:</span>
                <span className="value">{todayPanchanga.karana}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Sunrise:</span>
                <span className="value">{todayPanchanga.sunrise}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Sunset:</span>
                <span className="value">{todayPanchanga.sunset}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Moonrise:</span>
                <span className="value">{todayPanchanga.moonrise}</span>
              </div>
              <div className="panchanga-item">
                <span className="label">Moonset:</span>
                <span className="value">{todayPanchanga.moonset}</span>
              </div>
            </div>
          </div>

          <div className="auspicious-times">
            <h2>Auspicious Times Today</h2>
            <div className="times-list">
              {auspiciousTimes.map((item, index) => (
                <div key={index} className="time-item">
                  <span className="time">{item.time}</span>
                  <span className="activity">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Panchanga;
