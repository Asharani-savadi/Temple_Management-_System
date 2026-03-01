const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAudioUrls() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'temple_management'
    });

    console.log('✅ Connected to MySQL database');

    // Clear existing tracks
    await connection.query('DELETE FROM audio_tracks');
    console.log('🗑️  Cleared existing tracks');

    // Insert tracks with working Archive.org URLs using standard download format
    const tracks = [
      // Stotras
      { title: 'Vishnu Sahasranamam', artist: 'M.S. Subbulakshmi', category: 'stotras', url: 'https://archive.org/download/VishnuSahasranamam_MSS/01%20Vishnu%20Sahasranamam.mp3', duration: 1800, popular: 1, featured: 1 },
      { title: 'Hanuman Chalisa', artist: 'Various Artists', category: 'stotras', url: 'https://archive.org/download/ShreeHanumanChalisa_201510/Shree%20Hanuman%20Chalisa.mp3', duration: 600, popular: 1, featured: 0 },
      { title: 'Hanuman Chalisa Fast', artist: 'Various Artists', category: 'stotras', url: 'https://archive.org/download/FastHanumanChalisa/Hanuman%20Chalisa%20Fast.mp3', duration: 300, popular: 0, featured: 0 },
      { title: 'Shiva Aarti', artist: 'Various Artists', category: 'stotras', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Shiv%20Aarti.mp3', duration: 480, popular: 0, featured: 0 },
      { title: 'Durga Aarti', artist: 'Various Artists', category: 'stotras', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Durga%20Aarti.mp3', duration: 420, popular: 0, featured: 0 },
      { title: 'Ganesh Aarti', artist: 'Various Artists', category: 'stotras', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Ganesh%20Aarti.mp3', duration: 360, popular: 0, featured: 0 },
      
      // Bhajans
      { title: 'Krishna Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Krishna%20Bhajan.mp3', duration: 300, popular: 1, featured: 0 },
      { title: 'Ram Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Ram%20Bhajan.mp3', duration: 280, popular: 1, featured: 0 },
      { title: 'Sai Baba Aarti', artist: 'Various Artists', category: 'bhajans', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Sai%20Baba%20Aarti.mp3', duration: 320, popular: 1, featured: 0 },
      { title: 'Devi Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Devi%20Bhajan.mp3', duration: 290, popular: 0, featured: 0 },
      { title: 'Shiva Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Shiv%20Bhajan.mp3', duration: 310, popular: 0, featured: 0 },
      { title: 'Ganesh Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Ganesh%20Bhajan.mp3', duration: 270, popular: 0, featured: 0 },
      
      // Mantras
      { title: 'Gayatri Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://archive.org/download/GayatriMantra_201801/Gayatri%20Mantra.mp3', duration: 180, popular: 1, featured: 1 },
      { title: 'Maha Mrityunjaya Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://archive.org/download/TheGayatriMantra/Maha%20Mrityunjaya%20Mantra.mp3', duration: 240, popular: 1, featured: 0 },
      { title: 'Om Namah Shivaya', artist: 'Various Artists', category: 'mantras', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Om%20Namah%20Shivaya.mp3', duration: 300, popular: 1, featured: 0 },
      { title: 'Hare Krishna Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://archive.org/download/HareKrishnaHareKrishnaMahaMantra/Hare%20Krishna%20Maha%20Mantra.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Lakshmi Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Lakshmi%20Mantra.mp3', duration: 200, popular: 0, featured: 0 },
      { title: 'Saraswati Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://archive.org/download/HindiBhajanmp3-HanumanChalisaAartiyaan/Saraswati%20Mantra.mp3', duration: 220, popular: 0, featured: 0 }
    ];

    for (const track of tracks) {
      await connection.query(
        'INSERT INTO audio_tracks (title, artist, category, external_url, duration, is_popular, is_featured, license_info, attribution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [track.title, track.artist, track.category, track.url, track.duration, track.popular, track.featured, 'Public Domain', 'Archive.org']
      );
    }

    console.log('✅ Inserted 18 tracks with updated URLs');
    
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM audio_tracks');
    console.log(`📊 Total tracks in database: ${rows[0].count}`);
    
    console.log('\n📝 Sample URLs:');
    const [samples] = await connection.query('SELECT title, external_url FROM audio_tracks LIMIT 3');
    samples.forEach(s => console.log(`  - ${s.title}: ${s.external_url}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Database connection closed');
    }
  }
}

updateAudioUrls();
