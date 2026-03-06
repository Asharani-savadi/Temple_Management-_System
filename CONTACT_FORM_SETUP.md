# Contact Form Setup Guide - Gmail SMTP

This guide explains how to set up the contact form with Gmail SMTP for sending emails from your Node.js backend.

## Prerequisites

- Node.js installed
- Gmail account
- Backend server running on localhost:3001

## Step 1: Generate Gmail App Password

Since Gmail requires app-specific passwords for third-party applications, follow these steps:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Scroll down and find "App passwords"
5. Select "Mail" and "Windows Computer" (or your device)
6. Google will generate a 16-character password
7. Copy this password (you'll need it in the next step)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the `backend` folder (copy from `.env.example`)
2. Update the email configuration:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
CONTACT_EMAIL=admin@temple.com
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `your-16-character-app-password` with the password generated in Step 1
- `admin@temple.com` with the email where you want to receive contact form submissions

## Step 3: Install Dependencies

The `nodemailer` package has already been installed. If not, run:

```bash
cd backend
npm install nodemailer
```

## Step 4: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ MySQL Database connected successfully
🚀 Server running on http://localhost:3001
```

## Step 5: Test the Contact Form

1. Open your frontend application
2. Navigate to the Contact page
3. Fill in the form with test data
4. Click "Send Message"
5. You should receive:
   - An email at `CONTACT_EMAIL` with the form submission
   - A confirmation email at the user's email address

## API Endpoint

**POST** `/api/contact`

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "subject": "Inquiry about booking",
  "message": "I would like to book a room..."
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will contact you soon."
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Missing required fields: name, email, subject, message"
}
```

## Troubleshooting

### "Invalid login credentials" Error
- Verify your Gmail address and app password are correct
- Make sure you're using an app password, not your regular Gmail password
- Check that 2-Step Verification is enabled on your Google Account

### "Less secure app access" Error
- This shouldn't happen with app passwords, but if it does:
- Go to https://myaccount.google.com/lesssecureapps
- Enable "Less secure app access"

### Emails not being sent
- Check that your backend server is running
- Verify the `.env` file has correct values
- Check browser console for any error messages
- Check backend console for error logs

### CORS Issues
- Make sure the frontend is making requests to `http://localhost:3001`
- The backend has CORS enabled for all origins

## Email Templates

The system sends two emails:

### 1. Admin Notification Email
Sent to the `CONTACT_EMAIL` address with:
- Visitor's name, email, phone
- Subject and message
- Formatted HTML email

### 2. Confirmation Email
Sent to the visitor's email with:
- Thank you message
- Echo of their submitted message
- Professional footer

## Security Notes

- Never commit `.env` file to version control
- Keep your app password secure
- Validate all form inputs on the backend (already implemented)
- Consider adding rate limiting for production
- Use HTTPS in production

## Production Deployment

For production:

1. Use environment variables from your hosting provider
2. Consider using a dedicated email service (SendGrid, Mailgun, etc.)
3. Add rate limiting to prevent spam
4. Implement CAPTCHA for additional security
5. Use HTTPS for all communications
6. Monitor email delivery and bounce rates

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SMTP Configuration](https://nodemailer.com/smtp/)
