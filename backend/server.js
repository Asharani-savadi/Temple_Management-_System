const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
