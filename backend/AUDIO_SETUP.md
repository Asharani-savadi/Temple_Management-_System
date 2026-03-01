# Audio Player Setup Guide

## Database Setup

To set up the audio player feature, you need to create the `audio_tracks` table in your MySQL database.

### Step 1: Run the SQL Schema

Execute the SQL file to create the table and insert sample data:

```bash
# Using MySQL command line
mysql -u your_username -p your_database_name < backend/audio-schema.sql

# Or using MySQL Workbench
# Open audio-schema.sql and execute it
```

### Step 2: Verify the Table

Check that the table was created successfully:

```sql
USE temple_management;
SHOW TABLES;
SELECT * FROM audio_tracks;
```

You should see 18 sample tracks (6 Stotras, 6 Bhajans, 6 Mantras).

## Audio Sources

All audio tracks use external URLs from Archive.org, which hosts public domain and Creative Commons licensed content. The sample data includes:

### Stotras
- Vishnu Sahasranamam by M.S. Subbulakshmi
- Lalitha Sahasranama by M.S. Subbulakshmi
- Hanuman Chalisa
- Shiva Stotram
- Durga Stotram
- Ganesha Stotram

### Bhajans
- Krishna Bhajan
- Rama Bhajan
- Sai Baba Bhajan
- Devi Bhajan
- Shiva Bhajan
- Ganesh Bhajan

### Mantras
- Gayatri Mantra
- Maha Mrityunjaya Mantra
- Om Namah Shivaya
- Hare Krishna Mantra
- Lakshmi Mantra
- Saraswati Mantra

## Important Notes

1. **External URLs**: The sample data uses placeholder Archive.org URLs. You should replace these with actual working URLs from Archive.org's public domain collections.

2. **Finding Audio Files**: Visit https://archive.org and search for:
   - "Vishnu Sahasranamam M.S. Subbulakshmi"
   - "Devotional songs public domain"
   - "Sanskrit mantras"
   - Filter by: Audio, Public Domain or Creative Commons

3. **License Compliance**: All audio files must be:
   - Public Domain
   - Creative Commons (CC0, CC-BY, or CC-BY-SA)
   - Properly attributed in the database

4. **Adding New Tracks**: Use the admin panel or insert directly into the database:

```sql
INSERT INTO audio_tracks (title, artist, category, external_url, duration, is_popular, license_info, attribution)
VALUES ('Track Title', 'Artist Name', 'stotras', 'https://archive.org/download/...', 300, FALSE, 'Public Domain', 'Source - Archive.org');
```

## API Endpoints

Once the database is set up, the following endpoints will be available:

- `GET /api/audio-tracks` - Get all tracks
- `GET /api/audio-tracks?category=stotras` - Get tracks by category
- `GET /api/audio-tracks?popular=true` - Get popular tracks
- `PUT /api/audio-tracks/:id/play` - Increment play count
- `POST /api/audio-tracks` - Add new track (admin)
- `PUT /api/audio-tracks/:id` - Update track (admin)
- `DELETE /api/audio-tracks/:id` - Delete track (admin)

## Testing

1. Start the backend server:
```bash
cd backend
npm start
```

2. Test the API:
```bash
curl http://localhost:3001/api/audio-tracks
curl http://localhost:3001/api/audio-tracks?category=mantras
```

3. Start the frontend:
```bash
cd frontend
npm start
```

4. Navigate to the home page and click on any Audio Jukebox button (Stotras, Bhajans, or Mantras) to test the player.

## Troubleshooting

### No tracks showing
- Check that the database table exists
- Verify the backend server is running
- Check browser console for API errors

### Audio not playing
- Verify the external URLs are valid
- Check browser console for CORS errors
- Ensure the audio format is supported (MP3 is most compatible)

### CORS Issues
If you encounter CORS errors with Archive.org URLs, the browser may block cross-origin audio. Consider:
- Downloading the files and hosting them locally
- Using a proxy server
- Checking Archive.org's CORS policy

## Next Steps

1. Replace placeholder URLs with actual Archive.org URLs
2. Test audio playback for each track
3. Add more tracks through the admin panel
4. Customize the player styling if needed
5. Add keyboard shortcuts for better UX
