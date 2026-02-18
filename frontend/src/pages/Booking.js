import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useSearchParams } from 'react-router-dom';
import { FaHome, FaDonate, FaChurch, FaBuilding, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import Receipt from '../components/Receipt';
import './Booking.css';

function Booking() {
  const { rooms, marriageHalls, addBooking, loading } = useData();
  const [searchParams] = useSearchParams();
  const [bookingType, setBookingType] = useState('rooms');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState('service-selection'); // service-selection, calendar, availability, form, confirmation
  const [showReceipt, setShowReceipt] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  
  // Initialize with today's date
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // Current month (0-indexed)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear()); // Current year
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    specialRequests: ''
  });

  // Check URL parameters on component mount
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'rooms' || type === 'marriage') {
      setBookingType(type);
      setBookingStep('calendar');
    }
  }, [searchParams]);

  // Show loading state AFTER all hooks
  if (loading) {
    return (
      <div className="booking-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading...</h2>
          <p>Please wait while we fetch available rooms and halls.</p>
        </div>
      </div>
    );
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const tithiNames = ['Pratipada', 'Dwiteeya', 'Truteeya', 'Chaturthi', 'Panchami', 'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'];

  // Generate dates for selected month and year
  const generateCalendarDates = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dates = [];
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(selectedYear, selectedMonth, i);
      
      // Skip past dates (only show today and future dates)
      if (selectedYear === todayYear && selectedMonth === todayMonth && i < todayDate) {
        continue;
      }
      
      const dayName = dayNames[dateObj.getDay()];
      const tithiIndex = (i - 1) % tithiNames.length;
      
      dates.push({
        date: i,
        month: monthNames[selectedMonth],
        year: selectedYear,
        day: dayName,
        event: tithiNames[tithiIndex]
      });
    }
    
    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Generate year options (current year to 5 years ahead)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setBookingStep('availability');
  };

  const handleBookNow = (item) => {
    setSelectedRoom(item);
    setBookingStep('form');
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure selectedDate exists and has all required properties
    if (!selectedDate || !selectedDate.date || !selectedDate.month || !selectedDate.year) {
      alert('Please select a valid date');
      return;
    }
    
    // Format date consistently to avoid timezone issues
    const monthIndex = monthNames.indexOf(selectedDate.month);
    const formattedDate = `${selectedDate.date.toString().padStart(2, '0')}/${(monthIndex + 1).toString().padStart(2, '0')}/${selectedDate.year}`;
    
    // Add booking to global state
    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: formData.guests,
      special_requests: formData.specialRequests, // snake_case for database
      type: bookingType === 'rooms' ? 'Room' : 'Marriage Hall',
      date: formattedDate, // Use DD/MM/YYYY format
      status: 'Pending',
      amount: bookingType === 'rooms' 
        ? `₹${selectedRoom.type?.price || selectedRoom.price}` 
        : `₹${selectedRoom.price.toLocaleString()}`,
      // Add specific details based on booking type
      ...(bookingType === 'rooms' && {
        room_name: selectedRoom.name,
        room_type: selectedRoom.type?.name || 'Standard',
        room_number: Math.floor(Math.random() * 100) + 101
      }),
      ...(bookingType === 'marriage' && {
        hall_name: selectedRoom.name,
        capacity: selectedRoom.capacity,
        event_type: 'Marriage Ceremony',
        amenities: selectedRoom.amenities
      })
    };
    
    try {
      const result = await addBooking(bookingData);
      setConfirmedBooking(result || bookingData);
      setBookingStep('confirmation');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleServiceSelect = (service) => {
    setBookingType(service);
    setBookingStep('calendar');
  };

  const handleBackToCalendar = () => {
    setSelectedDate(null);
    setSelectedRoom(null);
    setBookingStep('calendar');
  };

  const handleBackToAvailability = () => {
    setSelectedRoom(null);
    setBookingStep('availability');
  };

  const handleBackToServices = () => {
    setBookingType('rooms');
    setSelectedDate(null);
    setSelectedRoom(null);
    setConfirmedBooking(null);
    setBookingStep('service-selection');
  };

  const handleViewReceipt = () => {
    setShowReceipt(true);
  };

  return (
    <div className="booking-page">
      {bookingStep === 'service-selection' && (
        <section className="service-selection-section">
          <div className="container">
            <h2 className="section-heading">ONLINE BOOKING SERVICES</h2>
            <div className="service-selection-grid">
              <div 
                className="service-selection-card"
                onClick={() => handleServiceSelect('rooms')}
              >
                <div className="service-icon"><FaHome /></div>
                <h3>ROOM BOOKING</h3>
              </div>
              <a 
                href="/services"
                className="service-selection-card"
              >
                <div className="service-icon"><FaDonate /></div>
                <h3>E-HUNDI</h3>
              </a>
              <div 
                className="service-selection-card"
                onClick={() => handleServiceSelect('marriage')}
              >
                <div className="service-icon"><FaChurch /></div>
                <h3>MARRIAGE HALL</h3>
              </div>
              <a 
                href="/rooms-donor"
                className="service-selection-card"
              >
                <div className="service-icon"><FaBuilding /></div>
                <h3>ROOM DONOR</h3>
              </a>
            </div>
          </div>
        </section>
      )}

      {bookingStep === 'calendar' && (
        <section className="calendar-section">
          <div className="container">
            <div className="calendar-header-with-back">
              <button className="btn-back" onClick={handleBackToServices}>
                ← Back to Services
              </button>
              <div className="calendar-header">
                <div className="calendar-controls">
                  <select 
                    className="month-selector"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                  <select 
                    className="year-selector"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="calendar-grid">
              {calendarDates.map((item, index) => (
                <div 
                  key={index} 
                  className="calendar-date"
                  onClick={() => handleDateSelect(item)}
                >
                  <div className="date-month">{item.month}</div>
                  <div className="date-number">{item.date}</div>
                  <div className="date-year">{item.year}</div>
                  <div className="date-event">{item.event}</div>
                  <div className="date-day">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {bookingStep === 'availability' && bookingType === 'rooms' && (
        <section className="section">
          <div className="container">
            <div className="selected-date-header">
              <h2 className="availability-title">
                Available Rooms for {selectedDate.date.toString().padStart(2, '0')}/{(monthNames.indexOf(selectedDate.month) + 1).toString().padStart(2, '0')}/{selectedDate.year}
              </h2>
              <button className="btn-change-date" onClick={handleBackToCalendar}>
                Change Date
              </button>
            </div>
            {rooms && rooms.length > 0 ? rooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <img src={room.image} alt={room.name} />
                {room.lift && <span className="lift-badge">Lift</span>}
                {!room.lift && <span className="no-lift-badge">No Lift</span>}
              </div>
              
              <div className="room-details">
                <h2 className="room-name">
                  {room.name} <span className="location-icon"><FaMapMarkerAlt /></span>
                </h2>
                
                <div className="room-types">
                  {room.types && Array.isArray(room.types) && room.types.length > 0 ? room.types.map((type, index) => (
                    <div key={index} className="room-type-card">
                      <p className="room-type-name">{type.name}</p>
                      <p className="room-price">₹ {type.price}/-</p>
                      <div className="room-availability">
                        <span>{type.available} of {type.total} Available</span>
                        {type.available === 0 && <span className="rooms-full-badge">ROOMS FULL</span>}
                      </div>
                      <button 
                        className="btn book-room-btn" 
                        onClick={() => handleBookNow({ ...room, type })}
                        disabled={type.available === 0}
                      >
                        Book Now
                      </button>
                    </div>
                  )) : (
                    <p>No room types available for this room</p>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '8px', margin: '2rem 0' }}>
              <h3>No Rooms Available</h3>
              <p>Please contact the admin to add rooms to the system.</p>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                Admin can add rooms from the admin panel at <a href="/admin/login">/admin/login</a>
              </p>
            </div>
          )}
          </div>
        </section>
      )}

      {bookingStep === 'availability' && bookingType === 'marriage' && (
        <section className="section">
          <div className="container">
            <div className="selected-date-header">
              <h2 className="availability-title">
                Available Marriage Halls for {selectedDate.date.toString().padStart(2, '0')}/{(monthNames.indexOf(selectedDate.month) + 1).toString().padStart(2, '0')}/{selectedDate.year}
              </h2>
              <button className="btn-change-date" onClick={handleBackToCalendar}>
                Change Date
              </button>
            </div>
            {marriageHalls && marriageHalls.length > 0 ? marriageHalls.map(hall => (
              <div key={hall.id} className="room-card">
                <div className="room-image">
                  <img src={hall.image} alt={hall.name} />
                  {hall.available && <span className="lift-badge">Available</span>}
                </div>
                
                <div className="room-details">
                  <h2 className="room-name">
                    {hall.name} <span className="location-icon"><FaMapMarkerAlt /></span>
                  </h2>
                  
                  <div className="hall-info">
                    <p className="hall-capacity">
                      <strong>Capacity:</strong> {hall.capacity}
                    </p>
                    <p className="hall-amenities">
                      <strong>Amenities:</strong> {hall.amenities}
                    </p>
                    <p className="hall-price">₹ {hall.price.toLocaleString()}/-</p>
                    <button 
                      className="btn book-hall-btn" 
                      onClick={() => handleBookNow(hall)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '8px', margin: '2rem 0' }}>
                <h3>No Marriage Halls Available</h3>
                <p>Please contact the admin to add marriage halls to the system.</p>
                <p style={{ marginTop: '1rem', color: '#666' }}>
                  Admin can add halls from the admin panel at <a href="/admin/login">/admin/login</a>
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {bookingStep === 'form' && (
        <section className="section">
          <div className="container">
            <div className="booking-form-container">
              <div className="form-header">
                <h2>Complete Your Booking</h2>
                <button className="btn-back" onClick={handleBackToAvailability}>
                  ← Back to Availability
                </button>
              </div>

              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <p><strong>Date:</strong> {selectedDate.date.toString().padStart(2, '0')}/{(monthNames.indexOf(selectedDate.month) + 1).toString().padStart(2, '0')}/{selectedDate.year}</p>
                <p><strong>{bookingType === 'rooms' ? 'Room' : 'Hall'}:</strong> {selectedRoom.name}</p>
                {bookingType === 'rooms' && selectedRoom.type && (
                  <>
                    <p><strong>Type:</strong> {selectedRoom.type.name}</p>
                    <p><strong>Price:</strong> ₹{selectedRoom.type.price}/-</p>
                  </>
                )}
                {bookingType === 'marriage' && (
                  <>
                    <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
                    <p><strong>Price:</strong> ₹{selectedRoom.price.toLocaleString()}/-</p>
                  </>
                )}
              </div>

              <form className="booking-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Guests *</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleFormChange}
                    rows="4"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-submit-booking">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {bookingStep === 'confirmation' && (
        <section className="section">
          <div className="container">
            <div className="confirmation-container">
              <div className="confirmation-icon"><FaCheckCircle /></div>
              <h2>Booking Confirmed!</h2>
              <p className="confirmation-message">
                Your booking has been successfully confirmed. A confirmation email has been sent to {formData.email}
              </p>
              
              <div className="confirmation-details">
                <h3>Booking Details</h3>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Date:</strong> {selectedDate.date.toString().padStart(2, '0')}/{(monthNames.indexOf(selectedDate.month) + 1).toString().padStart(2, '0')}/{selectedDate.year}</p>
                <p><strong>{bookingType === 'rooms' ? 'Room' : 'Hall'}:</strong> {selectedRoom.name}</p>
                <p><strong>Guests:</strong> {formData.guests}</p>
                <p><strong>Booking ID:</strong> #{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
              </div>

              <div className="confirmation-actions">
                <button className="btn btn-receipt" onClick={handleViewReceipt}>
                  Download Receipt
                </button>
                <button className="btn btn-secondary" onClick={handleBackToServices}>
                  Make Another Booking
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showReceipt && confirmedBooking && (
        <Receipt booking={confirmedBooking} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
}

export default Booking;
