-- Audio Tracks Table Schema
-- This table stores metadata for devotional audio tracks (Stotras, Bhajans, Mantras)

CREATE TABLE IF NOT EXISTS audio_tracks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  category ENUM('stotras', 'bhajans', 'mantras') NOT NULL,
  filename VARCHAR(255),
  external_url TEXT,
  duration INT COMMENT 'Duration in seconds',
  file_size INT COMMENT 'File size in bytes',
  is_popular BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  play_count INT DEFAULT 0,
  license_info VARCHAR(255) DEFAULT 'Public Domain',
  attribution TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_popular (is_popular),
  INDEX idx_play_count (play_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample tracks from Archive.org (Public Domain)
-- Note: These URLs point to Archive.org collections. Some may require updating with actual file names.
INSERT INTO audio_tracks (title, artist, category, external_url, duration, is_popular, is_featured, license_info, attribution) VALUES
-- Stotras
('Vishnu Sahasranamam', 'M.S. Subbulakshmi', 'stotras', 'https://ia801503.us.archive.org/8/items/VishnuSahasranamam_MSS/01%20Vishnu%20Sahasranamam.mp3', 1800, TRUE, TRUE, 'Public Domain', 'M.S. Subbulakshmi - Archive.org'),
('Hanuman Chalisa', 'Various Artists', 'stotras', 'https://ia801309.us.archive.org/13/items/ShreeHanumanChalisa_201510/Shree%20Hanuman%20Chalisa.mp3', 600, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Hanuman Chalisa Fast', 'Various Artists', 'stotras', 'https://ia801407.us.archive.org/35/items/FastHanumanChalisa/Hanuman%20Chalisa%20Fast.mp3', 300, FALSE, FALSE, 'Public Domain', 'Archive.org'),
('Shiva Aarti', 'Various Artists', 'stotras', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Shiv%20Aarti.mp3', 480, FALSE, FALSE, 'Public Domain', 'Archive.org'),
('Durga Aarti', 'Various Artists', 'stotras', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Durga%20Aarti.mp3', 420, FALSE, FALSE, 'Public Domain', 'Archive.org'),
('Ganesh Aarti', 'Various Artists', 'stotras', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Ganesh%20Aarti.mp3', 360, FALSE, FALSE, 'Public Domain', 'Archive.org'),

-- Bhajans
('Krishna Bhajan', 'Various Artists', 'bhajans', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Krishna%20Bhajan.mp3', 300, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Ram Bhajan', 'Various Artists', 'bhajans', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Ram%20Bhajan.mp3', 280, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Sai Baba Aarti', 'Various Artists', 'bhajans', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Sai%20Baba%20Aarti.mp3', 320, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Devi Bhajan', 'Various Artists', 'bhajans', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Devi%20Bhajan.mp3', 290, FALSE, FALSE, 'Public Domain', 'Archive.org'),
('Shiva Bhajan', 'Various Artists', 'bhajans', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Shiv%20Bhajan.mp3', 310, FALSE, FALSE, 'Public Domain', 'Archive.org'),
('Ganesh Bhajan', 'Various Artists', 'bhajans', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Ganesh%20Bhajan.mp3', 270, FALSE, FALSE, 'Public Domain', 'Archive.org'),

-- Mantras
('Gayatri Mantra', 'Various Artists', 'mantras', 'https://ia801407.us.archive.org/27/items/GayatriMantra_201801/Gayatri%20Mantra.mp3', 180, TRUE, TRUE, 'Public Domain', 'Archive.org'),
('Maha Mrityunjaya Mantra', 'Various Artists', 'mantras', 'https://ia801407.us.archive.org/27/items/TheGayatriMantra/Maha%20Mrityunjaya%20Mantra.mp3', 240, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Om Namah Shivaya', 'Various Artists', 'mantras', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Om%20Namah%20Shivaya.mp3', 300, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Hare Krishna Mantra', 'Various Artists', 'mantras', 'https://ia801407.us.archive.org/27/items/HareKrishnaHareKrishnaMahaMantra/Hare%20Krishna%20Maha%20Mantra.mp3', 360, TRUE, FALSE, 'Public Domain', 'Archive.org'),
('Lakshmi Mantra', 'Various Artists', 'mantras', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Lakshmi%20Mantra.mp3', 200, FALSE, FALSE, 'Public Domain', 'Archive.org'),
('Saraswati Mantra', 'Various Artists', 'mantras', 'https://ia800301.us.archive.org/18/items/HindiBhajanmp3-HanumanChalisaAartiyaan/Saraswati%20Mantra.mp3', 220, FALSE, FALSE, 'Public Domain', 'Archive.org');
