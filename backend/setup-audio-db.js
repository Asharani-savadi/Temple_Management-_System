const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupAudioDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'temple_management',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL database');

    // Read SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'audio-schema.sql'), 'utf8');
    
    // Execute SQL
    console.log('📝 Creating audio_tracks table...');
    await connection.query(sqlFile);
    
    console.log('✅ Audio tracks table created successfully!');
    console.log('✅ Sample data inserted (18 tracks)');
    
    // Verify
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM audio_tracks');
    console.log(`📊 Total tracks in database: ${rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('👋 Database connection closed');
    }
  }
}

setupAudioDatabase();
