import React from 'react';
import { useAudio } from '../context/AudioContext';
import './MiniPlayer.css';
import { FaPlay, FaPause, FaChevronUp } from 'react-icons/fa';

const MiniPlayer = ({ onExpand }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause
  } = useAudio();

  // Don't show mini player if no track is loaded
  if (!currentTrack) {
    return null;
  }

  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mini-player">
      <div className="mini-player-progress" style={{ width: `${progressPercentage}%` }}></div>
      
      <div className="mini-player-content">
        <div className="mini-player-info">
          <div className="mini-player-title">{currentTrack.title}</div>
          {currentTrack.artist && (
            <div className="mini-player-artist">{currentTrack.artist}</div>
          )}
        </div>

        <div className="mini-player-controls">
          <div className="mini-player-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <button
            className="mini-player-btn play-pause"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          {onExpand && (
            <button
              className="mini-player-btn expand"
              onClick={onExpand}
              aria-label="Expand player"
            >
              <FaChevronUp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
