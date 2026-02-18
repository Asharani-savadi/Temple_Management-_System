import React from 'react';
import './Services.css';

function LiveStatus() {
  const liveEvents = [
    { time: '6:00 AM', event: 'Suprabhatam', status: 'Completed' },
    { time: '7:00 AM', event: 'Morning Pooja', status: 'Completed' },
    { time: '12:00 PM', event: 'Afternoon Pooja', status: 'Live Now' },
    { time: '6:00 PM', event: 'Evening Aarti', status: 'Upcoming' },
    { time: '8:00 PM', event: 'Night Pooja', status: 'Upcoming' }
  ];

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="container">
          <h1>📺 Live Status</h1>
          <p>Watch live darshan and temple activities</p>
        </div>
      </section>

      <section className="service-content">
        <div className="container">
          <div className="live-stream-container">
            <div className="video-placeholder">
              <div className="live-badge">🔴 LIVE</div>
              <h2>Live Darshan</h2>
              <p>Stream will start at scheduled time</p>
            </div>
          </div>

          <div className="schedule-section">
            <h2>Today's Schedule</h2>
            <div className="schedule-list">
              {liveEvents.map((event, index) => (
                <div key={index} className={`schedule-item ${event.status.toLowerCase().replace(' ', '-')}`}>
                  <div className="schedule-time">{event.time}</div>
                  <div className="schedule-event">{event.event}</div>
                  <div className={`schedule-status ${event.status.toLowerCase().replace(' ', '-')}`}>
                    {event.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LiveStatus;
