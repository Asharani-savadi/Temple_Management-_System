@echo off
echo Setting up audio_tracks table...
mysql -u root -p temple_management < audio-schema.sql
echo Done! Audio tracks table created and populated.
pause
