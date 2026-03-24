-- Run this in phpMyAdmin if you already have the database set up
-- Adds room_photos table for multiple photos per room

USE temple_management;

CREATE TABLE IF NOT EXISTS room_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  photo_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_room_photos_room_id (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
