-- ============================================
-- Complete Database Schema
-- ============================================
-- This script creates all tables, policies, and default data
-- Run this in Supabase SQL Editor to set up your database

-- ============================================
-- DROP EXISTING TABLES (if re-running)
-- ============================================
-- Uncomment these lines if you need to reset the database
-- DROP TABLE IF EXISTS room_types CASCADE;
-- DROP TABLE IF EXISTS rooms CASCADE;
-- DROP TABLE IF EXISTS marriage_halls CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS donations CASCADE;
-- DROP TABLE IF EXISTS gallery_images CASCADE;
-- DROP TABLE IF EXISTS site_content CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;

-- ============================================
-- MIGRATION: Drop old room_types table if exists
-- ============================================
DROP TABLE IF EXISTS room_types CASCADE;

-- ============================================
-- MIGRATION: Recreate rooms table with new structure
-- ============================================
DROP TABLE IF EXISTS rooms CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Rooms table (simplified - combined rooms and room types)
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  lift BOOLEAN DEFAULT false,
  floor TEXT,
  occupancy TEXT,
  commode_type TEXT,
  ac BOOLEAN DEFAULT false,
  available INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marriage halls table
CREATE TABLE IF NOT EXISTS marriage_halls (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  capacity TEXT,
  amenities TEXT,
  price INTEGER NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table (stores all types of bookings: rooms, halls, sevas)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests TEXT,
  special_requests TEXT,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  amount TEXT NOT NULL,
  -- Room booking specific fields
  room_name TEXT,
  room_type TEXT,
  room_number INTEGER,
  -- Seva booking specific fields
  seva_name TEXT,
  seva_type TEXT,
  seva_time TEXT,
  -- Marriage hall booking specific fields
  hall_name TEXT,
  capacity TEXT,
  event_type TEXT,
  amenities TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor TEXT NOT NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site content table (for dynamic content management)
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Temples table
CREATE TABLE IF NOT EXISTS temples (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT,
  contact TEXT,
  timings TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE marriage_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE temples ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Policies for rooms table
DROP POLICY IF EXISTS "Allow public read access on rooms" ON rooms;
CREATE POLICY "Allow public read access on rooms" 
ON rooms FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow all operations on rooms" ON rooms;
CREATE POLICY "Allow all operations on rooms" 
ON rooms FOR ALL 
USING (true);

-- Policies for marriage_halls table
DROP POLICY IF EXISTS "Allow public read access on marriage_halls" ON marriage_halls;
CREATE POLICY "Allow public read access on marriage_halls" 
ON marriage_halls FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow all operations on marriage_halls" ON marriage_halls;
CREATE POLICY "Allow all operations on marriage_halls" 
ON marriage_halls FOR ALL 
USING (true);

-- Policies for bookings table
DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
CREATE POLICY "Allow public insert on bookings" 
ON bookings FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on bookings" ON bookings;
CREATE POLICY "Allow all operations on bookings" 
ON bookings FOR ALL 
USING (true);

-- Policies for donations table
DROP POLICY IF EXISTS "Allow public insert on donations" ON donations;
CREATE POLICY "Allow public insert on donations" 
ON donations FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on donations" ON donations;
CREATE POLICY "Allow all operations on donations" 
ON donations FOR ALL 
USING (true);

-- Policies for gallery_images table
DROP POLICY IF EXISTS "Allow public read access on gallery_images" ON gallery_images;
CREATE POLICY "Allow public read access on gallery_images" 
ON gallery_images FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow all operations on gallery_images" ON gallery_images;
CREATE POLICY "Allow all operations on gallery_images" 
ON gallery_images FOR ALL 
USING (true);

-- Policies for site_content table
DROP POLICY IF EXISTS "Allow public read access on site_content" ON site_content;
CREATE POLICY "Allow public read access on site_content" 
ON site_content FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow all operations on site_content" ON site_content;
CREATE POLICY "Allow all operations on site_content" 
ON site_content FOR ALL 
USING (true);

-- Policies for admin_users table
DROP POLICY IF EXISTS "Allow all operations on admin_users" ON admin_users;
CREATE POLICY "Allow all operations on admin_users" 
ON admin_users FOR ALL 
USING (true);

-- Policies for temples table
DROP POLICY IF EXISTS "Allow public read access on temples" ON temples;
CREATE POLICY "Allow public read access on temples" 
ON temples FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow all operations on temples" ON temples;
CREATE POLICY "Allow all operations on temples" 
ON temples FOR ALL 
USING (true);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default rooms (simplified structure)
INSERT INTO rooms (id, name, type, price, image, lift, floor, occupancy, commode_type, ac, available, total) VALUES
  (1, 'DHEERENDRA VASATHI GRUHA', 'NON-AC | 2-Occupancy | First Floor | Western Commode', 600, 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Room', true, 'First Floor', '2-Occupancy', 'Western', false, 0, 25),
  (2, 'DHEERENDRA VASATHI GRUHA', 'NON-AC | 2-Occupancy | Second Floor | Western Commode', 600, 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Room', true, 'Second Floor', '2-Occupancy', 'Western', false, 0, 20),
  (3, 'PANCHAMUKI DARSHAN', 'NON-AC | 2-Occupancy | First Floor | Western Commode', 250, 'https://via.placeholder.com/300x200/5cb85c/ffffff?text=Room', false, 'First Floor', '2-Occupancy', 'Western', false, 0, 10),
  (4, 'PANCHAMUKI DARSHAN', 'NON-AC | 2-Occupancy | Ground Floor | Indian Commode', 250, 'https://via.placeholder.com/300x200/5cb85c/ffffff?text=Room', false, 'Ground Floor', '2-Occupancy', 'Indian', false, 0, 10)
ON CONFLICT (id) DO NOTHING;

-- Insert default marriage halls
INSERT INTO marriage_halls (id, name, image, capacity, amenities, price, available) VALUES
  (1, 'KALYANA MANDAPA - MAIN HALL', 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Main+Hall', '500 Guests', 'AC | Stage | Dining Area | Parking', 25000, true),
  (2, 'KALYANA MANDAPA - MINI HALL', 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Mini+Hall', '200 Guests', 'AC | Stage | Dining Area', 15000, true)
ON CONFLICT (id) DO NOTHING;

-- Insert default site content
INSERT INTO site_content (key, value) VALUES
  ('about', 'Our matha has a rich spiritual heritage spanning many generations...'),
  ('services', 'We offer various spiritual services including daily pooja, special sevas...'),
  ('contact', 'Email: info@example.org
Phone: +91 XXXXXXXXXX')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert default admin user
-- Note: In production, use proper password hashing (bcrypt, etc.)
INSERT INTO admin_users (username, password_hash, email) VALUES
  ('admin', 'admin123', 'admin@example.org')
ON CONFLICT (username) DO NOTHING;

-- Insert sample gallery images (optional)
INSERT INTO gallery_images (title, category, url) VALUES
  ('Main Temple', 'temple', 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Temple'),
  ('Festival Celebration', 'events', 'https://via.placeholder.com/300x200/5cb85c/ffffff?text=Festival'),
  ('Prayer Hall', 'temple', 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Prayer+Hall'),
  ('Annual Event', 'events', 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Event'),
  ('Guest Rooms', 'facilities', 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Rooms'),
  ('Dining Hall', 'facilities', 'https://via.placeholder.com/300x200/3498db/ffffff?text=Dining')
ON CONFLICT DO NOTHING;

-- ============================================
-- RESET SEQUENCES (if needed)
-- ============================================
-- This ensures auto-increment IDs continue from the correct number

SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));
SELECT setval('marriage_halls_id_seq', (SELECT MAX(id) FROM marriage_halls));
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));
SELECT setval('donations_id_seq', (SELECT MAX(id) FROM donations));
SELECT setval('gallery_images_id_seq', (SELECT MAX(id) FROM gallery_images));
SELECT setval('site_content_id_seq', (SELECT MAX(id) FROM site_content));
SELECT setval('admin_users_id_seq', (SELECT MAX(id) FROM admin_users));
SELECT setval('temples_id_seq', (SELECT MAX(id) FROM temples));

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_rooms_name ON rooms(name);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(type);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(date);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_temples_name ON temples(name);

-- ============================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- ATTACH TRIGGERS TO TABLES
-- ============================================

DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at 
BEFORE UPDATE ON rooms 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marriage_halls_updated_at ON marriage_halls;
CREATE TRIGGER update_marriage_halls_updated_at 
BEFORE UPDATE ON marriage_halls 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at 
BEFORE UPDATE ON bookings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at 
BEFORE UPDATE ON donations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
CREATE TRIGGER update_gallery_images_updated_at 
BEFORE UPDATE ON gallery_images 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at 
BEFORE UPDATE ON site_content 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at 
BEFORE UPDATE ON admin_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_temples_updated_at ON temples;
CREATE TRIGGER update_temples_updated_at 
BEFORE UPDATE ON temples 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created successfully

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check row counts
SELECT 'rooms' as table_name, COUNT(*) as row_count FROM rooms
UNION ALL
SELECT 'marriage_halls', COUNT(*) FROM marriage_halls
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'donations', COUNT(*) FROM donations
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL
SELECT 'site_content', COUNT(*) FROM site_content
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'temples', COUNT(*) FROM temples;

-- ============================================
-- UTILITY SCRIPTS
-- ============================================

-- ============================================
-- SCRIPT 1: Clear All Dummy/Sample Data
-- ============================================
-- Uncomment and run this section to remove all sample data

/*
-- Clear all bookings
DELETE FROM bookings;

-- Clear all donations  
DELETE FROM donations;

-- Clear all gallery images
DELETE FROM gallery_images;

-- Clear rooms
DELETE FROM rooms;

-- Clear marriage halls
DELETE FROM marriage_halls;

-- Reset the ID sequences to start from 1
SELECT setval('rooms_id_seq', 1, false);
SELECT setval('marriage_halls_id_seq', 1, false);
SELECT setval('bookings_id_seq', 1, false);
SELECT setval('donations_id_seq', 1, false);
SELECT setval('gallery_images_id_seq', 1, false);
SELECT setval('temples_id_seq', 1, false);

-- Verify all tables are empty
SELECT 'rooms' as table_name, COUNT(*) as row_count FROM rooms
UNION ALL
SELECT 'marriage_halls', COUNT(*) FROM marriage_halls
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'donations', COUNT(*) FROM donations
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM gallery_images;
UNION ALL
SELECT 'temples', COUNT(*) FROM temples;
*/

-- ============================================
-- SCRIPT 2: Recreate Admin User
-- ============================================
-- Uncomment and run this section if admin login is not working

/*
-- Delete existing admin user (if any)
DELETE FROM admin_users WHERE username = 'admin';

-- Insert the admin user
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', 'admin123', 'admin@example.org');

-- Verify the admin user was created
SELECT * FROM admin_users WHERE username = 'admin';

-- Test the login query (this is what the app uses)
SELECT * FROM admin_users 
WHERE username = 'admin' 
AND password_hash = 'admin123';
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready to use.
-- 
-- Default Admin Credentials:
-- Username: admin
-- Password: admin123
--
-- Next Steps:
-- 1. Configure your .env file with Supabase credentials
-- 2. Start your React application
-- 3. Test the booking flow
-- 4. Login to admin panel
--
-- Utility Scripts:
-- - To clear all dummy data: Uncomment SCRIPT 1 above
-- - To recreate admin user: Uncomment SCRIPT 2 above
-- ============================================
