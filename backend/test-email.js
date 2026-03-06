const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('Testing email configuration...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '***' : 'NOT SET');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:');
    console.error(error);
    process.exit(1);
  } else {
    console.log('✅ Email configuration is valid!');
    console.log('Ready to send emails');
    
    // Send a test email
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from Temple Management',
      html: '<h2>Test Email</h2><p>If you received this, your email configuration is working!</p>'
    };
    
    transporter.sendMail(testEmail, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:');
        console.error(error);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Response:', info.response);
        process.exit(0);
      }
    });
  }
});
