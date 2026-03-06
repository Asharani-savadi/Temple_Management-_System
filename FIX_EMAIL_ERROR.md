# Fix Email Configuration Error

## Issue
The contact form is failing with a JSON parsing error because the email password contains special characters that may not be properly handled.

## Solution

### Step 1: Generate a New Gmail App Password

1. Go to https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Find "App passwords" (you may need to scroll down)
4. Select "Mail" and "Windows Computer"
5. Google will generate a **16-character password** (example: `abcd efgh ijkl mnop`)
6. **Copy this password exactly as shown** - it will have spaces

### Step 2: Update .env File

Replace the EMAIL_PASSWORD with the new 16-character password:

```env
EMAIL_USER=ashasavadi37@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
CONTACT_EMAIL=asharanisavai1008@gmail.com
```

**Important:** 
- Remove any special characters like `@`, `!`, `#`, etc.
- The app password should only contain letters and numbers
- If it has spaces, remove them too

### Step 3: Restart Backend Server

1. Stop the current backend server (Ctrl+C)
2. Run: `npm start`
3. You should see: `✅ MySQL Database connected successfully`

### Step 4: Test Again

1. Go to http://localhost:3001/contact
2. Fill in the contact form
3. Click "Send Message"
4. Check your email for the submission

## Common Issues

### "Invalid login credentials"
- Your app password is incorrect
- Make sure you're using the 16-character password from Google, not your regular Gmail password
- Verify 2-Step Verification is enabled

### "Less secure app access"
- This shouldn't happen with app passwords
- If it does, go to https://myaccount.google.com/lesssecureapps and enable it

### Still getting JSON error
- Make sure backend is running on port 3001
- Check that the API endpoint is `/api/contact`
- Look at backend console for error messages

## Verify Setup

Run this in your backend directory to test the email configuration:

```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ashasavadi37@gmail.com',
    pass: 'YOUR_APP_PASSWORD_HERE'
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Email config error:', error);
  } else {
    console.log('Email config is valid!');
  }
});
"
```

Replace `YOUR_APP_PASSWORD_HERE` with your actual app password.
