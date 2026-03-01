const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixAudioUrls() {
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

    // Use sample audio files that work without CORS issues
    // These are placeholder URLs - you should replace with actual devotional audio
    const tracks = [
      // Stotras - Using sample audio that works
      { title: 'Vishnu Sahasranamam', artist: 'M.S. Subbulakshmi', category: 'stotras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 360, popular: 1, featured: 1 },
      { title: 'Hanuman Chalisa', artist: 'Various Artists', category: 'stotras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Lalitha Sahasranama', artist: 'M.S. Subbulakshmi', category: 'stotras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 360, popular: 0, featured: 0 },
      { title: 'Shiva Stotram', artist: 'Various Artists', category: 'stotras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 360, popular: 0, featured: 0 },
      { title: 'Durga Stotram', artist: 'Various Artists', category: 'stotras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: 360, popular: 0, featured: 0 },
      { title: 'Ganesha Stotram', artist: 'Various Artists', category: 'stotras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: 360, popular: 0, featured: 0 },
      
      // Bhajans
      { title: 'Krishna Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Rama Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Sai Baba Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Devi Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: 360, popular: 0, featured: 0 },
      { title: 'Shiva Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', duration: 360, popular: 0, featured: 0 },
      { title: 'Ganesh Bhajan', artist: 'Various Artists', category: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', duration: 360, popular: 0, featured: 0 },
      
      // Mantras
      { title: 'Gayatri Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', duration: 360, popular: 1, featured: 1 },
      { title: 'Maha Mrityunjaya Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Om Namah Shivaya', artist: 'Various Artists', category: 'mantras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Hare Krishna Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', duration: 360, popular: 1, featured: 0 },
      { title: 'Lakshmi Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Impact/Kevin_MacLeod_-_Meditation_Impromptu_01.mp3', duration: 360, popular: 0, featured: 0 },
      { title: 'Saraswati Mantra', artist: 'Various Artists', category: 'mantras', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Impact/Kevin_MacLeod_-_Meditation_Impromptu_02.mp3', duration: 360, popular: 0, featured: 0 }
    ];

    for (const track of tracks) {
      await connection.query(
        'INSERT INTO audio_tracks (title, artist, category, external_url, duration, is_popular, is_featured, license_info, attribution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [track.title, track.artist, track.category, track.url, track.duration, track.popular, track.featured, 'Sample Audio', 'Placeholder - Replace with actual devotional audio']
      );
    }

    console.log('✅ Inserted 18 tracks with working sample URLs');
    console.log('⚠️  NOTE: These are placeholder audio files for testing.');
    console.log('📝 Replace with actual devotional audio from:');
    console.log('   - Downloaded Archive.org files in frontend/public/audio/');
    console.log('   - Or other royalty-free devotional audio sources');
    
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM audio_tracks');
    console.log(`\n📊 Total tracks in database: ${rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Database connection closed');
      console.log('\n🎵 Audio player should now work! Refresh your browser.');
    }
  }
}

fixAudioUrls();
