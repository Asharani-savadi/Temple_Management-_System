import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAudio } from '../context/AudioContext';
import { loadLocalAudioTracks } from '../utils/LocalAudioLoader';
import './AudioPlayer.css';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaMusic, FaArrowLeft, FaTimes } from 'react-icons/fa';

const AudioPlayer = ({ category, onClose }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading: audioLoading,
    playTrack,
    togglePlayPause,
    seekTo,
    playNextTrack,
    playPreviousTrack,
    changeVolume,
    loadPlaylist
  } = useAudio();

  // Fetch tracks for the category
  useEffect(() => {
    let isMounted = true;
    
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await loadLocalAudioTracks(category);
        
        if (isMounted) {
          if (result.success && result.data) {
            setTracks(result.data);
            loadPlaylist(result.data);
          } else if (result.data && result.data.length === 0) {
            setTracks([]);
            setError('No tracks available for this category');
          } else {
            setError(result.error || 'Failed to load tracks');
          }
        }
      } catch (err) {
        console.error('Error loading tracks:', err);
        if (isMounted) {
          setError('Failed to load tracks');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (category) {
      fetchTracks();
    }

    return () => {
      isMounted = false;
    };
  }, [category, loadPlaylist]);

  // Format time in MM:SS
  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle seek
  const handleSeek = useCallback((e) => {
    const seekTime = parseFloat(e.target.value);
    seekTo(seekTime);
  }, [seekTo]);

  // Handle volume change
  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  }, [changeVolume]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    changeVolume(volume === 0 ? 1 : 0);
  }, [volume, changeVolume]);

  // Get category title
  const categoryTitle = useMemo(() => {
    const titles = {
      stotras: 'Stotras',
      bhajans: 'Bhajans',
      mantras: 'Mantras'
    };
    return titles[category] || 'Audio Tracks';
  }, [category]);

  if (loading) {
    return (
      <div className="audio-player">
        <div className="audio-player-loading">
          <div className="spinner"></div>
          <p>Loading {categoryTitle}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audio-player">
        <div className="audio-player-error">
          <FaMusic className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-player">
      {/* Header */}
      <div className="audio-player-header">
        <div className="header-top">
          <button 
            className="back-btn"
            onClick={onClose}
            aria-label="Go back"
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <div className="header-title">
            <h2>{categoryTitle}</h2>
            <p className="track-count">{tracks.length} tracks available</p>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close player"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="track-list">
        {tracks.length === 0 ? (
          <div className="no-tracks">
            <FaMusic />
            <p>No tracks available</p>
          </div>
        ) : (
          <div className="tracks">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
              >
                <div className="track-number">{index + 1}</div>
                <div className="track-info" onClick={() => playTrack(track)}>
                  <div className="track-title">{track.title}</div>
                  {track.artist && <div className="track-artist">{track.artist}</div>}
                </div>
                <div className="track-duration">{formatTime(track.duration)}</div>
                <button 
                  className={`track-play-btn ${currentTrack?.id === track.id && isPlaying ? 'playing' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentTrack?.id === track.id) {
                      togglePlayPause();
                    } else {
                      playTrack(track);
                    }
                  }}
                  aria-label={`Play ${track.title}`}
                >
                  {currentTrack?.id === track.id && isPlaying ? <FaPause /> : <FaPlay />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio Controls */}
      {currentTrack && (
        <div className="audio-controls">
          <div className="current-track-info">
            <div className="track-title">{currentTrack.title}</div>
            {currentTrack.artist && <div className="track-artist">{currentTrack.artist}</div>}
          </div>

          <div className="progress-section">
            <span className="time-display">{formatTime(currentTime)}</span>
            <div className="progress-bar-container">
              <input
                type="range"
                className="progress-bar"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek position"
              />
              <div 
                className="progress-fill" 
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="time-display">{formatTime(duration)}</span>
          </div>

          <div className="playback-controls">
            <button 
              className="control-btn"
              onClick={playPreviousTrack}
              aria-label="Previous track"
              disabled={tracks.length <= 1}
            >
              <FaStepBackward />
            </button>
            
            <button 
              className="control-btn play-pause-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={audioLoading}
            >
              {audioLoading ? (
                <div className="mini-spinner"></div>
              ) : isPlaying ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </button>
            
            <button 
              className="control-btn"
              onClick={playNextTrack}
              aria-label="Next track"
              disabled={tracks.length <= 1}
            >
              <FaStepForward />
            </button>
          </div>

          <div className="volume-section">
            <button 
              className="volume-btn"
              onClick={toggleMute}
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <div className="volume-slider-container">
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume control"
              />
              <div 
                className="volume-fill" 
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
            <span className="volume-percent">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
