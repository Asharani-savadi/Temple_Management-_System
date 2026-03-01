# Audio Player Troubleshooting

## Issue: "NotSupportedError: Failed to load because no supported source was found"

This error occurs when the browser cannot load the audio file from Archive.org. This is usually due to:

### 1. CORS (Cross-Origin Resource Sharing) Issues
Archive.org may block direct audio streaming from localhost or certain domains.

### Solutions:

#### Option A: Test with a Simple HTML File (Recommended for Testing)
Create a test file to verify the URLs work:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Audio Test</title>
</head>
<body>
    <h1>Archive.org Audio Test</h1>
    <audio controls>
        <source src="https://archive.org/download/VishnuSahasranamam_MSS/01%20Vishnu%20Sahasranamam.mp3" type="audio/mpeg">
    </audio>
    <p>If you can hear audio above, the URLs work!</p>
</body>
</html>
```

#### Option B: Use CORS Proxy (Development Only)
Add a CORS proxy for development:

1. Install cors-anywhere:
```bash
npm install cors-anywhere
```

2. Create `backend/cors-proxy.js`:
```javascript
const cors_proxy = require('cors-anywhere');
const host = '0.0.0.0';
const port = 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('CORS Proxy running on ' + host + ':' + port);
});
```

3. Update audio URLs to use proxy:
```javascript
const proxyUrl = 'http://localhost:8080/';
audio.src = proxyUrl + track.audioUrl;
```

#### Option C: Download and Host Locally (Production Solution)
1. Download MP3 files from Archive.org
2. Place them in `frontend/public/audio/` folder
3. Update database URLs to local paths:
```sql
UPDATE audio_tracks SET external_url = '/audio/stotras/vishnu-sahasranamam.mp3' WHERE id = 1;
```

#### Option D: Use Embedded Player
Some Archive.org items support embedded players. Check the item page for embed code.

### 2. File Format Issues
Ensure the audio files are in MP3 format, which is widely supported.

### 3. Network Issues
- Check if Archive.org is accessible
- Try opening the URL directly in browser
- Check browser console for specific errors

## Testing URLs

Run this command to test if URLs are accessible:

```bash
curl -I "https://archive.org/download/VishnuSahasranamam_MSS/01%20Vishnu%20Sahasranamam.mp3"
```

If you get a 200 OK response, the file exists and is accessible.

## Current Database URLs

All tracks use Archive.org's standard download format:
```
https://archive.org/download/{ITEM_ID}/{FILE_NAME}.mp3
```

## Recommended Solution for Production

For a production environment, it's best to:

1. **Download the audio files** from Archive.org (they're public domain)
2. **Host them locally** in your `frontend/public/audio/` directory
3. **Update the database** to use local paths
4. **Serve them** through your Express server

This ensures:
- No CORS issues
- Faster loading
- No dependency on external services
- Better user experience

## Quick Fix Script

Run this to update URLs to use Archive.org's embed-friendly format:

```bash
cd backend
node update-audio-urls.js
```

Then restart your backend server.
