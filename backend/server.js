const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Email transporter configuration with explicit SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS, not SSL
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads', 'rooms');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for room photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `room_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'temple_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
  });

// ============================================
// ROOMS ENDPOINTS
// ============================================

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY name ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update room
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE rooms SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create room
app.post('/api/rooms', async (req, res) => {
  try {
    const room = req.body;
    const [result] = await pool.query('INSERT INTO rooms SET ?', [room]);
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete room
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// MARRIAGE HALLS ENDPOINTS
// ============================================

// Get all marriage halls
app.get('/api/marriage-halls', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM marriage_halls ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching marriage halls:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update marriage hall
app.put('/api/marriage-halls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE marriage_halls SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Marriage hall not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM marriage_halls WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating marriage hall:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create marriage hall
app.post('/api/marriage-halls', async (req, res) => {
  try {
    const hall = req.body;
    const [result] = await pool.query('INSERT INTO marriage_halls SET ?', [hall]);
    const [rows] = await pool.query('SELECT * FROM marriage_halls WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating marriage hall:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete marriage hall
app.delete('/api/marriage-halls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM marriage_halls WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Marriage hall not found' });
    }
    
    res.json({ message: 'Marriage hall deleted successfully' });
  } catch (error) {
    console.error('Error deleting marriage hall:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// BOOKINGS ENDPOINTS
// ============================================

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;
    const [result] = await pool.query('INSERT INTO bookings SET ?', [booking]);
    
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE bookings SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DONATIONS ENDPOINTS
// ============================================

// Get all donations
app.get('/api/donations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create donation
app.post('/api/donations', async (req, res) => {
  try {
    const donation = req.body;
    const [result] = await pool.query('INSERT INTO donations SET ?', [donation]);
    
    const [rows] = await pool.query('SELECT * FROM donations WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update donation
app.put('/api/donations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE donations SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM donations WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete donation
app.delete('/api/donations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM donations WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GALLERY ENDPOINTS
// ============================================

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery_images ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create gallery image
app.post('/api/gallery', async (req, res) => {
  try {
    const image = req.body;
    const [result] = await pool.query('INSERT INTO gallery_images SET ?', [image]);
    
    const [rows] = await pool.query('SELECT * FROM gallery_images WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update gallery image
app.put('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE gallery_images SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM gallery_images WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete gallery image
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM gallery_images WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }
    
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SITE CONTENT ENDPOINTS
// ============================================

// Get all site content
app.get('/api/site-content', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_content');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upsert site content
app.post('/api/site-content', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    await pool.query(
      'INSERT INTO site_content (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [key, value, value]
    );
    
    const [rows] = await pool.query('SELECT * FROM site_content WHERE `key` = ?', [key]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error upserting site content:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// TEMPLES ENDPOINTS
// ============================================

// Get all temples
app.get('/api/temples', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM temples ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching temples:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create temple
app.post('/api/temples', async (req, res) => {
  try {
    const temple = req.body;
    const [result] = await pool.query('INSERT INTO temples SET ?', [temple]);
    
    const [rows] = await pool.query('SELECT * FROM temples WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating temple:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update temple
app.put('/api/temples/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE temples SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Temple not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM temples WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating temple:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete temple
app.delete('/api/temples/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM temples WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Temple not found' });
    }
    
    res.json({ message: 'Temple deleted successfully' });
  } catch (error) {
    console.error('Error deleting temple:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN AUTH ENDPOINTS
// ============================================

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ? AND password_hash = ?',
      [username, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// AUDIO TRACKS ENDPOINTS
// ============================================

// Get all audio tracks with optional filtering
app.get('/api/audio-tracks', async (req, res) => {
  try {
    const { category, popular } = req.query;
    let query = 'SELECT * FROM audio_tracks WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (popular === 'true') {
      query += ' AND is_popular = TRUE';
    }
    
    query += ' ORDER BY is_featured DESC, play_count DESC, title ASC';
    
    const [rows] = await pool.query(query, params);
    
    // Transform data for frontend
    const tracks = rows.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      category: track.category,
      audioUrl: track.filename ? `/audio/${track.category}/${track.filename}` : track.external_url,
      duration: track.duration,
      isPopular: track.is_popular,
      isFeatured: track.is_featured,
      playCount: track.play_count,
      attribution: track.attribution
    }));
    
    res.json({ success: true, data: tracks });
  } catch (error) {
    console.error('Error fetching audio tracks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Increment play count for a track
app.put('/api/audio-tracks/:id/play', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('UPDATE audio_tracks SET play_count = play_count + 1 WHERE id = ?', [id]);
    
    const [rows] = await pool.query('SELECT play_count FROM audio_tracks WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }
    
    res.json({ success: true, playCount: rows[0].play_count });
  } catch (error) {
    console.error('Error incrementing play count:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new audio track (admin only)
app.post('/api/audio-tracks', async (req, res) => {
  try {
    const track = req.body;
    const [result] = await pool.query('INSERT INTO audio_tracks SET ?', [track]);
    
    const [rows] = await pool.query('SELECT * FROM audio_tracks WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating audio track:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update audio track metadata (admin only)
app.put('/api/audio-tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query('UPDATE audio_tracks SET ? WHERE id = ?', [updates, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }
    
    const [rows] = await pool.query('SELECT * FROM audio_tracks WHERE id = ?', [id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating audio track:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete audio track (admin only)
app.delete('/api/audio-tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM audio_tracks WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Track not found' });
    }
    
    res.json({ success: true, message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting audio track:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// DARSHAN BOOKING ENDPOINTS
// ============================================

// Get all darshan types
app.get('/api/darshan-types', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM darshan_types WHERE is_active = TRUE ORDER BY id'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching darshan types:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get available time slots for a specific date and darshan type
app.get('/api/darshan-slots', async (req, res) => {
  try {
    const { date, type } = req.query;
    
    if (!date || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date and type parameters are required' 
      });
    }
    
    // Get darshan type details
    const [typeRows] = await pool.query(
      'SELECT * FROM darshan_types WHERE type_code = ? AND is_active = TRUE',
      [type]
    );
    
    if (typeRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Darshan type not found' 
      });
    }
    
    const darshanType = typeRows[0];
    
    // Get all time slots
    const [slots] = await pool.query(
      'SELECT * FROM darshan_time_slots WHERE is_active = TRUE ORDER BY slot_order'
    );
    
    // Get booked count for each slot on the given date
    const [bookings] = await pool.query(
      `SELECT time_slot, COUNT(*) as booked_count 
       FROM darshan_bookings 
       WHERE booking_date = ? AND darshan_type = ? AND booking_status != 'cancelled'
       GROUP BY time_slot`,
      [date, type]
    );
    
    const bookedMap = {};
    bookings.forEach(b => {
      bookedMap[b.time_slot] = b.booked_count;
    });
    
    // Build slot availability
    const availableSlots = slots.map(slot => {
      const booked = bookedMap[slot.slot_time] || 0;
      const available = darshanType.max_persons_per_slot - booked;
      
      return {
        id: slot.id,
        time: slot.slot_time,
        capacity: darshanType.max_persons_per_slot,
        booked: booked,
        available: Math.max(0, available),
        isFull: available <= 0,
        price: darshanType.price_per_person
      };
    });
    
    res.json({ 
      success: true, 
      data: {
        date,
        type,
        darshanType: darshanType.type_name,
        slots: availableSlots
      }
    });
  } catch (error) {
    console.error('Error fetching darshan slots:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new darshan booking
app.post('/api/darshan-bookings', async (req, res) => {
  try {
    const {
      devotee_name,
      devotee_phone,
      devotee_email,
      devotee_address,
      darshan_type,
      booking_date,
      time_slot,
      number_of_persons,
      special_requests,
      payment_method
    } = req.body;
    
    // Validation
    if (!devotee_name || !devotee_phone || !darshan_type || !booking_date || !time_slot || !number_of_persons) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    if (number_of_persons < 1 || number_of_persons > 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'Number of persons must be between 1 and 10' 
      });
    }
    
    // Get darshan type pricing
    const [typeRows] = await pool.query(
      'SELECT * FROM darshan_types WHERE type_code = ?',
      [darshan_type]
    );
    
    if (typeRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Darshan type not found' 
      });
    }
    
    const darshanTypeData = typeRows[0];
    const amount_per_person = darshanTypeData.price_per_person;
    const total_amount = amount_per_person * number_of_persons;
    
    // Generate unique booking ID
    const booking_id = `DB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const confirmation_code = `CONF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    // Determine payment status
    const payment_status = total_amount === 0 ? 'paid' : 'pending';
    const booking_status = total_amount === 0 ? 'confirmed' : 'pending';
    
    // Insert booking
    const [result] = await pool.query(
      `INSERT INTO darshan_bookings (
        booking_id, devotee_name, devotee_phone, devotee_email, devotee_address,
        darshan_type, booking_date, time_slot, number_of_persons,
        amount_per_person, total_amount, payment_status, booking_status,
        confirmation_code, special_requests, payment_method, booking_confirmed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        booking_id, devotee_name, devotee_phone, devotee_email, devotee_address,
        darshan_type, booking_date, time_slot, number_of_persons,
        amount_per_person, total_amount, payment_status, booking_status,
        confirmation_code, special_requests, payment_method
      ]
    );
    
    // Fetch the created booking
    const [bookings] = await pool.query(
      'SELECT * FROM darshan_bookings WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      data: bookings[0]
    });
  } catch (error) {
    console.error('Error creating darshan booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get booking details by reference
app.get('/api/darshan-bookings/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM darshan_bookings WHERE booking_id = ? OR confirmation_code = ?',
      [reference, reference]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all bookings for a phone number
app.get('/api/darshan-bookings-by-phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM darshan_bookings WHERE devotee_phone = ? ORDER BY booking_date DESC',
      [phone]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update booking status
app.put('/api/darshan-bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [result] = await pool.query(
      'UPDATE darshan_bookings SET ? WHERE id = ?',
      [updates, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM darshan_bookings WHERE id = ?',
      [id]
    );
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel booking
app.put('/api/darshan-bookings/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE darshan_bookings SET booking_status = ?, payment_status = ? WHERE id = ?',
      ['cancelled', 'refunded', id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM darshan_bookings WHERE id = ?',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Get all bookings with filters
app.get('/api/admin/darshan-bookings', async (req, res) => {
  try {
    const { date, status, type } = req.query;
    let query = 'SELECT * FROM darshan_bookings WHERE 1=1';
    const params = [];
    
    if (date) {
      query += ' AND booking_date = ?';
      params.push(date);
    }
    
    if (status) {
      query += ' AND booking_status = ?';
      params.push(status);
    }
    
    if (type) {
      query += ' AND darshan_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY booking_date DESC, time_slot ASC';
    
    const [rows] = await pool.query(query, params);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Check-in booking
app.put('/api/admin/darshan-bookings/:id/checkin', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE darshan_bookings SET booking_status = ?, checked_in_at = NOW() WHERE id = ?',
      ['completed', id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM darshan_bookings WHERE id = ?',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: 'Check-in successful',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error checking in booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Get darshan statistics
app.get('/api/admin/darshan-stats', async (req, res) => {
  try {
    const { date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (date) {
      dateFilter = ' WHERE booking_date = ?';
      params.push(date);
    }
    
    // Total bookings
    const [totalBookings] = await pool.query(
      `SELECT COUNT(*) as count FROM darshan_bookings${dateFilter}`,
      params
    );
    
    // Bookings by type
    const [byType] = await pool.query(
      `SELECT darshan_type, COUNT(*) as count, SUM(number_of_persons) as persons 
       FROM darshan_bookings${dateFilter}
       GROUP BY darshan_type`,
      params
    );
    
    // Bookings by status
    const [byStatus] = await pool.query(
      `SELECT booking_status, COUNT(*) as count 
       FROM darshan_bookings${dateFilter}
       GROUP BY booking_status`,
      params
    );
    
    // Revenue
    const [revenue] = await pool.query(
      `SELECT SUM(total_amount) as total FROM darshan_bookings 
       WHERE payment_status = 'paid'${dateFilter ? ' AND booking_date = ?' : ''}`,
      params
    );
    
    res.json({ 
      success: true, 
      data: {
        totalBookings: totalBookings[0].count,
        byType,
        byStatus,
        revenue: revenue[0].total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching darshan stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// CONTACT FORM ENDPOINT
// ============================================

// Send contact form email
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, subject, message'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.CONTACT_EMAIL || 'admin@temple.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This is an automated email from the temple website contact form.</small></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationEmail = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'We received your message - Temple Management',
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your Message Details:</strong></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>Temple Management Team</p>
      `
    };

    await transporter.sendMail(confirmationEmail);

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon.'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// ============================================
// USER AUTH ENDPOINTS
// ============================================

// User register
app.post('/api/user/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      [name, email, phone, password]
    );
    const [rows] = await pool.query('SELECT id, name, email, phone, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// User login
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, created_at FROM users WHERE email = ? AND password_hash = ?',
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile + bookings
app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT id, name, email, phone, created_at FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC',
      [users[0].email]
    );
    res.json({ success: true, user: users[0], bookings });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user profile
app.put('/api/user/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    await pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, id]);
    const [rows] = await pool.query('SELECT id, name, email, phone, created_at FROM users WHERE id = ?', [id]);
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ROOM PHOTOS ENDPOINTS
// ============================================

// Get photos for a room
app.get('/api/rooms/:id/photos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM room_photos WHERE room_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload photos for a room (up to 10 at once)
app.post('/api/rooms/:id/photos', upload.array('photos', 10), async (req, res) => {
  try {
    const roomId = req.params.id;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    // Check if room already has a primary photo
    const [existing] = await pool.query(
      'SELECT id FROM room_photos WHERE room_id = ? AND is_primary = TRUE',
      [roomId]
    );
    const hasPrimary = existing.length > 0;

    const inserted = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const photoUrl = `/uploads/rooms/${file.filename}`;
      const isPrimary = !hasPrimary && i === 0;
      const [result] = await pool.query(
        'INSERT INTO room_photos (room_id, photo_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [roomId, photoUrl, isPrimary, i]
      );
      inserted.push({ id: result.insertId, photo_url: photoUrl, is_primary: isPrimary });
    }

    // Update room's main image to first photo if no primary existed
    if (!hasPrimary && inserted.length > 0) {
      await pool.query('UPDATE rooms SET image = ? WHERE id = ?', [inserted[0].photo_url, roomId]);
    }

    res.status(201).json({ success: true, data: inserted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set a photo as primary
app.put('/api/rooms/:roomId/photos/:photoId/primary', async (req, res) => {
  try {
    const { roomId, photoId } = req.params;
    await pool.query('UPDATE room_photos SET is_primary = FALSE WHERE room_id = ?', [roomId]);
    await pool.query('UPDATE room_photos SET is_primary = TRUE WHERE id = ? AND room_id = ?', [photoId, roomId]);
    const [photo] = await pool.query('SELECT photo_url FROM room_photos WHERE id = ?', [photoId]);
    if (photo.length > 0) {
      await pool.query('UPDATE rooms SET image = ? WHERE id = ?', [photo[0].photo_url, roomId]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a room photo
app.delete('/api/rooms/:roomId/photos/:photoId', async (req, res) => {
  try {
    const { roomId, photoId } = req.params;
    const [rows] = await pool.query('SELECT * FROM room_photos WHERE id = ? AND room_id = ?', [photoId, roomId]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Photo not found' });

    // Delete file from disk
    const filePath = path.join(__dirname, rows[0].photo_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM room_photos WHERE id = ?', [photoId]);

    // If deleted photo was primary, set next one as primary
    if (rows[0].is_primary) {
      const [next] = await pool.query(
        'SELECT id, photo_url FROM room_photos WHERE room_id = ? ORDER BY sort_order ASC LIMIT 1',
        [roomId]
      );
      if (next.length > 0) {
        await pool.query('UPDATE room_photos SET is_primary = TRUE WHERE id = ?', [next[0].id]);
        await pool.query('UPDATE rooms SET image = ? WHERE id = ?', [next[0].photo_url, roomId]);
      } else {
        await pool.query('UPDATE rooms SET image = NULL WHERE id = ?', [roomId]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all rooms WITH their photos
app.get('/api/rooms-with-photos', async (req, res) => {
  try {
    const [rooms] = await pool.query('SELECT * FROM rooms ORDER BY name ASC, id ASC');
    const [photos] = await pool.query('SELECT * FROM room_photos ORDER BY is_primary DESC, sort_order ASC');
    const photosByRoom = {};
    photos.forEach(p => {
      if (!photosByRoom[p.room_id]) photosByRoom[p.room_id] = [];
      photosByRoom[p.room_id].push(p);
    });
    const result = rooms.map(r => ({ ...r, photos: photosByRoom[r.id] || [] }));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
