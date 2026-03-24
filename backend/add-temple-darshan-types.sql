-- Run this in phpMyAdmin to add the three temple darshan types
-- Safe to run multiple times (uses INSERT IGNORE)

USE temple_management;

INSERT IGNORE INTO darshan_types (type_code, type_name, description, price_per_person, max_persons_per_slot, duration_minutes, is_active) VALUES
  ('raghavendra', 'Raghavendra Temple Darshan', 'Darshan at Sri Raghavendra Swami Temple', 0, 80, 30, TRUE),
  ('ganesh',      'Ganesh Temple Darshan',      'Darshan at Sri Ganesh Temple — blessings for new beginnings', 0, 80, 30, TRUE),
  ('shiva',       'Shiva Temple Darshan',       'Darshan at Sri Shiva Temple — Mahadeva blessings', 0, 80, 30, TRUE);
