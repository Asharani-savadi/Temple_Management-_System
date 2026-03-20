# Fix Gmail Authentication Error

## Error Message
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This means your Gmail app password is incorrect or not properly configured.

## Solution

### Option 1: Use Gmail App Password (Recommended)

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/
   - Click "Security" in the left sidebar
   - Find "2-Step Verification" and enable it

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy it exactly (it may have spaces)

3. **Update .env file:**
   ```env
   EMAIL_USER=asharanisavadi2005@gmail.com
   EMAIL_PASSWORD=lguekbkqjxogtgxs
   CONTACT_EMAIL=asharanisavadi1008@gmail.com
   ```

4. **Restart backend:**
   ```bash
   npm start
   ```

### Option 2: Enable Less Secure App Access

If app passwords don't work:

1. Go to https://myaccount.google.com/lesssecureapps
2. Enable "Less secure app access"
3. Use your regular Gmail password in .env:
   ```env
   EMAIL_PASSWORD=your-regular-gmail-password
   ```

### Option 3: Use Gmail with OAuth2 (Most Secure)

Update `backend/server.js`:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    // Or use OAuth2:
    type: 'OAuth2',
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN
  }
});
```

## Troubleshooting

### Still getting "Invalid login" error?

1. **Verify credentials:**
   - Make sure EMAIL_USER is your full Gmail address
   - Make sure EMAIL_PASSWORD is correct (no typos)
   - If using app password, make sure it's the 16-character one from Google

2. **Check .env file:**
   - Make sure there are no extra spaces
   - Make sure there are no quotes around values
   - Correct format: `EMAIL_PASSWORD=lguekbkqjxogtgxs`
   - Wrong format: `EMAIL_PASSWORD="lguekbkqjxogtgxs"`

3. **Restart backend:**
   - Stop the server (Ctrl+C)
   - Run `npm start` again

4. **Check Gmail security:**
   - Go to https://myaccount.google.com/security
   - Look for "Recent security events"
   - If you see a blocked login, approve it

### Test Email Configuration

Run this command in the backend directory:

```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asharanisavadi2005@gmail.com',
    pass: 'lguekbkqjxogtgxs'
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email config error:', error.message);
  } else {
    console.log('✅ Email config is valid!');
  }
});
"
```

## Common Issues

| Error | Solution |
|-------|----------|
| Invalid login | Use correct app password or enable less secure access |
| Connection timeout | Check internet connection, firewall settings |
| ENOTFOUND | Gmail server unreachable, check DNS |
| EAUTH | Wrong credentials, verify email and password |

## After Fixing

1. Restart backend server
2. Go to http://localhost:3001/contact
3. Fill in the contact form
4. Click "Send Message"
5. Check your email for the submission

## Need Help?

- Gmail Support: https://support.google.com/mail/
- Nodemailer Docs: https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
