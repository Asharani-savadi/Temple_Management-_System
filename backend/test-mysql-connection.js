// Simple script to test MySQL connection
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'temple_management'
  };

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log('');

  try {
    // Create connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL database!\n');

    // Test query - get table count
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    console.log('');

    // Test data - get room count
    const [rooms] = await connection.query('SELECT COUNT(*) as count FROM rooms');
    console.log(`🏠 Rooms in database: ${rooms[0].count}`);

    // Test data - get booking count
    const [bookings] = await connection.query('SELECT COUNT(*) as count FROM bookings');
    console.log(`📅 Bookings in database: ${bookings[0].count}`);

    // Test data - get admin users
    const [admins] = await connection.query('SELECT username FROM admin_users');
    console.log(`👤 Admin users: ${admins.map(a => a.username).join(', ')}`);

    await connection.end();
    console.log('\n✅ Connection test completed successfully!');
    console.log('\n🚀 You can now start the application with: npm run server');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Make sure MySQL server is running (check XAMPP/WAMP/MAMP)');
    console.log('   2. Verify credentials in .env file');
    console.log('   3. Ensure database "temple_management" exists');
    console.log('   4. Check if mysql-schema.sql was imported correctly');
    process.exit(1);
  }
}

testConnection();
