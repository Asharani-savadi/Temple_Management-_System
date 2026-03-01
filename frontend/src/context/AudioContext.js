import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { apiClient } from '../apiClient';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNextTrack();
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Update audio volume when volume state changes
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  // Play a specific track
  const playTrack = useCallback(async (track) => {
    try {
      const audio = audioRef.current;
      
      // If same track, just toggle play/pause
      if (currentTrack?.id === track.id) {
        togglePlayPause();
        return;
      }

      // Load new track
      setIsLoading(true);
      audio.src = track.audioUrl;
      setCurrentTrack(track);
      setCurrentTime(0);
      
      // Add error handler for this specific track
      const handleError = () => {
        console.error('Failed to load audio:', track.title, track.audioUrl);
        setIsPlaying(false);
        setIsLoading(false);
        alert(`Unable to play "${track.title}". The audio file may not be available or there may be a network issue. Please try another track.`);
      };
      
      audio.addEventListener('error', handleError, { once: true });
      
      await audio.play();
      setIsLoading(false);
      
      // Increment play count
      try {
        await apiClient.incrementPlayCount(track.id);
      } catch (error) {
        console.error('Error incrementing play count:', error);
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setIsPlaying(false);
      setIsLoading(false);
      alert(`Unable to play this track. Please try another one.`);
    }
  }, [currentTrack, togglePlayPause]);

  // Seek to specific time
  const seekTo = useCallback((time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Play next track in playlist
  const playNextTrack = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  }, [currentTrack, playlist, playTrack]);

  // Play previous track in playlist
  const playPreviousTrack = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playTrack(playlist[previousIndex]);
  }, [currentTrack, playlist, playTrack]);

  // Set volume (0 to 1)
  const changeVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }, []);

  // Load playlist
  const loadPlaylist = useCallback((tracks) => {
    setPlaylist(tracks);
  }, []);

  // Stop playback
  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    playlist,
    currentTime,
    duration,
    volume,
    isLoading,
    playTrack,
    togglePlayPause,
    seekTo,
    playNextTrack,
    playPreviousTrack,
    changeVolume,
    loadPlaylist,
    stopPlayback
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
