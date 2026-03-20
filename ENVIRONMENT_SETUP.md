# Environment Setup Guide

## Overview
This guide explains all environment variables and how to configure them properly.

## File Location
- **Backend**: `backend/.env`
- **Template**: `backend/.env.example`

## Configuration Sections

### 1. DATABASE CONFIGURATION

```env
DB_HOST=localhost          # MySQL server host
DB_USER=root              # MySQL username
DB_PASSWORD=root          # MySQL password
DB_NAME=temple_management # Database name
DB_PORT=3306              # MySQL port (default: 3306)
```

**Setup:**
1. Install MySQL Server
2. Create database: `CREATE DATABASE temple_management;`
3. Update credentials in `.env`

### 2. API CONFIGURATION

```env
API_PORT=3001                              # Backend server port
NODE_ENV=development                       # Environment (development/production)
REACT_APP_API_URL=http://localhost:3001/api # Frontend API URL
```

**Notes:**
- `API_PORT`: Change if 3001 is already in use
- `NODE_ENV`: Set to `production` for deployment
- `REACT_APP_API_URL`: Must match your backend URL

### 3. EMAIL CONFIGURATION (Gmail SMTP)

```env
EMAIL_SERVICE=gmail                        # Email service provider
EMAIL_USER=your-email@gmail.com           # Your Gmail address
EMAIL_PASSWORD=your-app-password          # Gmail app password (16 chars)
CONTACT_EMAIL=admin@temple.com            # Where to send contact forms
EMAIL_FROM_NAME=Temple Management System  # Display name in emails
```

**Setup Gmail:**
1. Go to https://myaccount.google.com/
2. Enable 2-Step Verification
3. Generate App Password at https://myaccount.google.com/apppasswords
4. Copy the 16-character password
5. Update `EMAIL_PASSWORD` in `.env`

### 4. CORS CONFIGURATION

```env
CORS_ORIGIN=http://localhost:3000  # Frontend URL
CORS_CREDENTIALS=true              # Allow credentials in requests
```

**Notes:**
- `CORS_ORIGIN`: Change to your frontend URL
- For production: Use your actual domain

### 5. SESSION CONFIGURATION

```env
SESSION_SECRET=your-secret-key-change-this-in-production  # Session encryption key
SESSION_TIMEOUT=3600000                                    # Session timeout (ms)
```

**Notes:**
- `SESSION_SECRET`: Change this to a random string in production
- `SESSION_TIMEOUT`: 3600000ms = 1 hour

### 6. SECURITY CONFIGURATION

```env
RATE_LIMIT_WINDOW=15        # Rate limit window (minutes)
RATE_LIMIT_MAX_REQUESTS=100 # Max requests per window
```

**Notes:**
- Prevents spam and abuse
- Adjust based on your needs

### 7. LOGGING CONFIGURATION

```env
LOG_LEVEL=info              # Log level (error/warn/info/debug)
LOG_FILE=logs/app.log       # Log file path
```

**Notes:**
- `LOG_LEVEL`: Set to `debug` for development
- Logs are stored in `logs/` directory

## Quick Start

### 1. Copy Template
```bash
cp backend/.env.example backend/.env
```

### 2. Update Values
Edit `backend/.env` with your settings:
```env
DB_PASSWORD=root
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Start Backend
```bash
cd backend
npm start
```

### 4. Start Frontend
```bash
cd frontend
npm start
```

## Environment Variables by Environment

### Development
```env
NODE_ENV=development
API_PORT=3001
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Production
```env
NODE_ENV=production
API_PORT=3001
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
SESSION_SECRET=generate-random-string-here
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DB_HOST, DB_USER, DB_PASSWORD
- Ensure database exists

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check Gmail app password (16 chars)
- Enable 2-Step Verification on Gmail
- Check CONTACT_EMAIL is valid

### CORS Error
- Verify CORS_ORIGIN matches frontend URL
- Check API_PORT is correct
- Restart backend after changes

### Port Already in Use
- Change API_PORT to different number (3002, 3003, etc.)
- Or kill process using the port

## Security Best Practices

1. **Never commit .env to Git**
   - Add to `.gitignore`
   - Use `.env.example` as template

2. **Change defaults in production**
   - Generate new SESSION_SECRET
   - Use strong DB_PASSWORD
   - Use app-specific email password

3. **Use HTTPS in production**
   - Update CORS_ORIGIN to https://
   - Use SSL certificates

4. **Rotate secrets regularly**
   - Change SESSION_SECRET
   - Update email passwords
   - Review access logs

## Environment Variables Reference

| Variable | Type | Default | Required |
|----------|------|---------|----------|
| DB_HOST | string | localhost | Yes |
| DB_USER | string | root | Yes |
| DB_PASSWORD | string | - | Yes |
| DB_NAME | string | temple_management | Yes |
| DB_PORT | number | 3306 | No |
| API_PORT | number | 3001 | No |
| NODE_ENV | string | development | No |
| EMAIL_USER | string | - | Yes |
| EMAIL_PASSWORD | string | - | Yes |
| CONTACT_EMAIL | string | - | Yes |
| CORS_ORIGIN | string | http://localhost:3000 | No |
| SESSION_SECRET | string | - | Yes (prod) |
| LOG_LEVEL | string | info | No |

## Support

For issues:
1. Check logs in `logs/app.log`
2. Review error messages in console
3. Verify all required variables are set
4. Check file permissions
5. Restart services after changes
