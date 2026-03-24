import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MiniPlayer from './components/MiniPlayer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import LatestNews from './pages/LatestNews';
import LiveStatus from './pages/LiveStatus';
import RoomsDonor from './pages/RoomsDonor';
import MyHistory from './pages/MyHistory';
import Panchanga from './pages/Panchanga';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageRooms from './pages/admin/ManageRooms';
import ManageHalls from './pages/admin/ManageHalls';
import ManageDonations from './pages/admin/ManageDonations';
import ManageGallery from './pages/admin/ManageGallery';
import ManageContent from './pages/admin/ManageContent';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTemples from './pages/admin/ManageTemples';
import ManageDarshan from './pages/admin/ManageDarshan';
import Settings from './pages/admin/Settings';
import DarshanBooking from './pages/DarshanBooking';
import OnlineBookingServices from './pages/OnlineBookingServices';
import './App.css';

function App() {
  return (
    <AuthProvider>
    <DataProvider>
      <Router>
        <div className="App">
        <Routes>
          {/* Unified Login — all roles */}
          <Route path="/login" element={<Login />} />
          {/* Legacy admin/login redirect → unified login */}
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/login" replace />} />

          {/* Admin Routes (no header/footer) */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/rooms" element={<ManageRooms />} />
          <Route path="/admin/halls" element={<ManageHalls />} />
          <Route path="/admin/donations" element={<ManageDonations />} />
          <Route path="/admin/gallery" element={<ManageGallery />} />
          <Route path="/admin/content" element={<ManageContent />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/temples" element={<ManageTemples />} />
          <Route path="/admin/darshan" element={<ManageDarshan />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/latest-news" element={<LatestNews />} />
                  <Route path="/live-status" element={<LiveStatus />} />
                  <Route path="/rooms-donor" element={<RoomsDonor />} />
                  <Route path="/my-history" element={<MyHistory />} />
                  <Route path="/panchanga" element={<Panchanga />} />
                  <Route path="/darshan-booking" element={<DarshanBooking />} />
                  <Route path="/online-booking-services" element={<OnlineBookingServices />} />
                  <Route path="/room-booking" element={<Booking />} />
                  <Route path="/profile" element={<UserProfile />} />
                </Routes>
              </main>
              <Footer />
              <MiniPlayer />
            </>
          } />
        </Routes>
        </div>
      </Router>
    </DataProvider>
    </AuthProvider>
  );
}

export default App;
