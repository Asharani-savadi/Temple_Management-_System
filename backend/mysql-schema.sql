-- ============================================
-- MySQL Database Schema
-- ============================================
-- Import this file into phpMyAdmin to set up your database

-- ============================================
-- CREATE DATABASE (uncomment if needed)
-- ============================================
CREATE DATABASE IF NOT EXISTS temple_management;
USE temple_management;

-- ============================================
-- DROP EXISTING TABLES (if re-running)
-- ============================================
DROP TABLE IF EXISTS darshan_bookings;
DROP TABLE IF EXISTS darshan_time_slots;
DROP TABLE IF EXISTS darshan_types;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS site_content;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS temples;
DROP TABLE IF EXISTS marriage_halls;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rooms table
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  image TEXT,
  lift BOOLEAN DEFAULT FALSE,
  floor VARCHAR(100),
  occupancy VARCHAR(100),
  commode_type VARCHAR(50),
  ac BOOLEAN DEFAULT FALSE,
  available INT DEFAULT 0,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rooms_name (name),
  INDEX idx_rooms_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Marriage halls table
CREATE TABLE marriage_halls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  capacity VARCHAR(100),
  amenities TEXT,
  price INT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  guests VARCHAR(100),
  special_requests TEXT,
  type VARCHAR(50) NOT NULL,
  date VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  amount VARCHAR(50) NOT NULL,
  room_name VARCHAR(255),
  room_type VARCHAR(255),
  room_number INT,
  seva_name VARCHAR(255),
  seva_type VARCHAR(255),
  seva_time VARCHAR(100),
  hall_name VARCHAR(255),
  capacity VARCHAR(100),
  event_type VARCHAR(100),
  amenities TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_bookings_date (date),
  INDEX idx_bookings_status (status),
  INDEX idx_bookings_type (type),
  INDEX idx_bookings_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Donations table
CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  date VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_donations_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gallery images table
CREATE TABLE gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_gallery_images_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site content table
CREATE TABLE site_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_site_content_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Temples table
CREATE TABLE temples (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  contact VARCHAR(255),
  timings VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_temples_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default rooms
INSERT INTO rooms (id, name, type, price, image, lift, floor, occupancy, commode_type, ac, available, total) VALUES
  (1, 'DHEERENDRA VASATHI GRUHA', 'NON-AC | 2-Occupancy | First Floor | Western Commode', 600, 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Room', TRUE, 'First Floor', '2-Occupancy', 'Western', FALSE, 0, 25),
  (2, 'DHEERENDRA VASATHI GRUHA', 'NON-AC | 2-Occupancy | Second Floor | Western Commode', 600, 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Room', TRUE, 'Second Floor', '2-Occupancy', 'Western', FALSE, 0, 20),
  (3, 'PANCHAMUKI DARSHAN', 'NON-AC | 2-Occupancy | First Floor | Western Commode', 250, 'https://via.placeholder.com/300x200/5cb85c/ffffff?text=Room', FALSE, 'First Floor', '2-Occupancy', 'Western', FALSE, 0, 10),
  (4, 'PANCHAMUKI DARSHAN', 'NON-AC | 2-Occupancy | Ground Floor | Indian Commode', 250, 'https://via.placeholder.com/300x200/5cb85c/ffffff?text=Room', FALSE, 'Ground Floor', '2-Occupancy', 'Indian', FALSE, 0, 10);

-- Insert default marriage halls
INSERT INTO marriage_halls (id, name, image, capacity, amenities, price, available) VALUES
  (1, 'KALYANA MANDAPA - MAIN HALL', 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Main+Hall', '500 Guests', 'AC | Stage | Dining Area | Parking', 25000, TRUE),
  (2, 'KALYANA MANDAPA - MINI HALL', 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Mini+Hall', '200 Guests', 'AC | Stage | Dining Area', 15000, TRUE);

-- Insert default site content
INSERT INTO site_content (`key`, value) VALUES
  ('about', 'Our matha has a rich spiritual heritage spanning many generations...'),
  ('services', 'We offer various spiritual services including daily pooja, special sevas...'),
  ('contact', 'Email: info@example.org\nPhone: +91 XXXXXXXXXX');

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES
  ('admin', 'admin123', 'admin@example.org');

-- Insert sample gallery images
INSERT INTO gallery_images (title, category, url) VALUES
  ('Main Temple', 'temple', 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Temple'),
  ('Festival Celebration', 'events', 'https://via.placeholder.com/300x200/5cb85c/ffffff?text=Festival'),
  ('Prayer Hall', 'temple', 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Prayer+Hall'),
  ('Annual Event', 'events', 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Event'),
  ('Guest Rooms', 'facilities', 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Rooms'),
  ('Dining Hall', 'facilities', 'https://via.placeholder.com/300x200/3498db/ffffff?text=Dining');

-- ============================================
-- DARSHAN TABLES
-- ============================================

CREATE TABLE darshan_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_code VARCHAR(50) UNIQUE NOT NULL,
  type_name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_person INT DEFAULT 0,
  max_persons_per_slot INT DEFAULT 50,
  duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE darshan_time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slot_time VARCHAR(20) NOT NULL,
  slot_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE darshan_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(100) UNIQUE NOT NULL,
  devotee_name VARCHAR(255) NOT NULL,
  devotee_phone VARCHAR(50) NOT NULL,
  devotee_email VARCHAR(255),
  devotee_address TEXT,
  darshan_type VARCHAR(50) NOT NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  number_of_persons INT NOT NULL DEFAULT 1,
  amount_per_person INT DEFAULT 0,
  total_amount INT DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'pending',
  booking_status VARCHAR(50) DEFAULT 'pending',
  confirmation_code VARCHAR(100),
  special_requests TEXT,
  payment_method VARCHAR(50),
  booking_confirmed_at TIMESTAMP NULL,
  checked_in_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_darshan_date (booking_date),
  INDEX idx_darshan_status (booking_status),
  INDEX idx_darshan_phone (devotee_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default darshan types
INSERT INTO darshan_types (type_code, type_name, description, price_per_person, max_persons_per_slot) VALUES
  ('general', 'General Darshan', 'Regular darshan for all devotees', 0, 100),
  ('special', 'Special Darshan', 'Special darshan with priority access', 100, 30),
  ('vip', 'VIP Darshan', 'VIP darshan with exclusive access', 500, 10);

-- Insert default time slots
INSERT INTO darshan_time_slots (slot_time, slot_order) VALUES
  ('06:00 AM', 1),
  ('07:00 AM', 2),
  ('08:00 AM', 3),
  ('09:00 AM', 4),
  ('10:00 AM', 5),
  ('11:00 AM', 6),
  ('12:00 PM', 7),
  ('04:00 PM', 8),
  ('05:00 PM', 9),
  ('06:00 PM', 10),
  ('07:00 PM', 11),
  ('08:00 PM', 12);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
