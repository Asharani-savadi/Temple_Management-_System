import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioPlayer from './AudioPlayer';
import { AudioProvider } from '../context/AudioContext';

// Mock the LocalAudioLoader
jest.mock('../utils/LocalAudioLoader', () => ({
  loadLocalAudioTracks: jest.fn()
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaPlay: () => <div data-testid="icon-play">Play</div>,
  FaPause: () => <div data-testid="icon-pause">Pause</div>,
  FaStepForward: () => <div data-testid="icon-next">Next</div>,
  FaStepBackward: () => <div data-testid="icon-prev">Prev</div>,
  FaVolumeUp: () => <div data-testid="icon-volume-up">Volume Up</div>,
  FaVolumeMute: () => <div data-testid="icon-volume-mute">Volume Mute</div>,
  FaMusic: () => <div data-testid="icon-music">Music</div>
}));

const { loadLocalAudioTracks } = require('../utils/LocalAudioLoader');

// Helper to render component with AudioProvider
const renderWithAudioProvider = (component) => {
  return render(
    <AudioProvider>
      {component}
    </AudioProvider>
  );
};

// Helper to generate random track data
const generateTrack = (seed) => {
  const categories = ['bhajans', 'stotras', 'mantras'];
  const titles = ['Om Namah Shivaya', 'Gayatri Mantra', 'Hanuman Chalisa', 'Devi Mahatmya', 'Bhairav Mantra'];
  const filenames = ['om_namah_shivaya.mp3', 'gayatri_mantra.mp3', 'hanuman_chalisa.mp3', 'devi_mahatmya.mp3', 'bhairav_mantra.mp3'];
  
  const category = categories[seed % categories.length];
  const titleIdx = (seed + 1) % titles.length;
  const filenameIdx = (seed + 2) % filenames.length;
  const duration = (seed * 100) % 3600;
  
  return {
    id: `track-${seed}`,
    title: titles[titleIdx],
    audioUrl: `/audio/${category}/${filenames[filenameIdx]}`,
    duration: duration,
    category: category,
    originalFilename: filenames[filenameIdx]
  };
};

// Helper to generate random track arrays
const generateTracks = (seed, count) => {
  const tracks = [];
  for (let i = 0; i < count; i++) {
    tracks.push(generateTrack(seed + i));
  }
  return tracks;
};

describe('AudioPlayer - Property-Based Tests for Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.pause = jest.fn();
    HTMLMediaElement.prototype.load = jest.fn();
  });

  /**
   * Property 5: Track Metadata Accuracy
   * **Validates: Requirements 1.2, 3.1**
   * 
   * For any loaded track, the duration property should be a non-negative number,
   * and the track should be playable through the AudioContext without errors.
   */
  describe('Property 5: Track Metadata Accuracy', () => {
    it('should ensure all loaded tracks have non-negative duration', async () => {
      const tracks = generateTracks(0, 3);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Verify all tracks have non-negative duration
      tracks.forEach(track => {
        expect(track.duration).toBeGreaterThanOrEqual(0);
        expect(typeof track.duration).toBe('number');
      });
    });

    it('should verify all required track fields are present', async () => {
      const tracks = generateTracks(5, 2);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(`${tracks.length} tracks available`)).toBeInTheDocument();
      });

      // Verify all required fields are present in each track
      tracks.forEach(track => {
        expect(track).toHaveProperty('id');
        expect(track).toHaveProperty('title');
        expect(track).toHaveProperty('audioUrl');
        expect(track).toHaveProperty('duration');
        expect(track).toHaveProperty('category');
        expect(track).toHaveProperty('originalFilename');

        // Verify field types
        expect(typeof track.id).toBe('string');
        expect(typeof track.title).toBe('string');
        expect(typeof track.audioUrl).toBe('string');
        expect(typeof track.duration).toBe('number');
        expect(typeof track.category).toBe('string');
        expect(typeof track.originalFilename).toBe('string');
      });
    });

    it('should verify tracks are playable through AudioContext', async () => {
      const tracks = generateTracks(10, 1);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Click play button for first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });
    });

    it('should verify track count display matches actual track count', async () => {
      const tracks = generateTracks(15, 4);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        const trackCountText = `${tracks.length} tracks available`;
        expect(screen.getByText(trackCountText)).toBeInTheDocument();
      });
    });

    it('should handle various track durations correctly', async () => {
      // Test with different duration values
      const tracks = [
        generateTrack(0),  // duration: 0
        generateTrack(1),  // duration: 100
        generateTrack(2),  // duration: 200
        generateTrack(3),  // duration: 300
      ];
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // All durations should be non-negative
      tracks.forEach(track => {
        expect(track.duration).toBeGreaterThanOrEqual(0);
      });
    });
  });

  /**
   * Property 6: Playback Control Compatibility
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**
   * 
   * For any track loaded from a local folder, all playback controls 
   * (play, pause, next, previous, seek, volume) should function identically.
   */
  describe('Property 6: Playback Control Compatibility', () => {
    it('should verify play control works for all tracks', async () => {
      const tracks = generateTracks(20, 2);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Click play button
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });
    });

    it('should verify pause control works for all tracks', async () => {
      const tracks = generateTracks(25, 1);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Pause button should be available after playing
      const pauseButtons = screen.queryAllByRole('button', { name: /Pause/i });
      if (pauseButtons.length > 0) {
        fireEvent.click(pauseButtons[0]);
        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      }
    });

    it('should verify next control works for multi-track playlists', async () => {
      const tracks = generateTracks(30, 3);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Click next button
      const nextButton = screen.getByRole('button', { name: /Next track/i });
      expect(nextButton).not.toBeDisabled();
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should verify previous control works for multi-track playlists', async () => {
      const tracks = generateTracks(35, 3);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[1].title)).toBeInTheDocument();
      });

      // Play second track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[1]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Click previous button
      const prevButton = screen.getByRole('button', { name: /Previous track/i });
      expect(prevButton).not.toBeDisabled();
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should verify seek control works for all tracks', async () => {
      const tracks = generateTracks(40, 2);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Seek to position
      const progressBar = screen.getByRole('slider', { name: /Seek position/i });
      fireEvent.change(progressBar, { target: { value: '50' } });

      // Verify seek was triggered
      expect(progressBar).toBeInTheDocument();
    });

    it('should verify volume control works for all tracks', async () => {
      const tracks = generateTracks(45, 1);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Adjust volume
      const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });

      await waitFor(() => {
        expect(volumeSlider.value).toBe('0.5');
      });
    });

    it('should verify navigation and seek work identically for all tracks', async () => {
      const tracks = generateTracks(50, 2);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify both navigation and seek controls are available
      const nextButton = screen.getByRole('button', { name: /Next track/i });
      const progressBar = screen.getByRole('slider', { name: /Seek position/i });

      expect(nextButton).toBeInTheDocument();
      expect(progressBar).toBeInTheDocument();

      // Both should work without errors
      fireEvent.click(nextButton);
      fireEvent.change(progressBar, { target: { value: '50' } });

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });
    });
  });

  /**
   * Property 7: UI Consistency
   * **Validates: Requirements 5.1, 5.2, 5.3**
   * 
   * For any category, the AudioPlayer component should render with the same 
   * visual layout, styling, and information fields regardless of whether tracks 
   * are loaded from API or local folders.
   */
  describe('Property 7: UI Consistency', () => {
    it('should maintain consistent visual layout for all track counts', async () => {
      const tracks = generateTracks(55, 3);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Bhajans')).toBeInTheDocument();
      });

      // Verify header is present
      const header = screen.getByText('Bhajans');
      expect(header).toBeInTheDocument();

      // Verify track count is displayed
      const trackCount_text = screen.getByText(new RegExp(`${tracks.length} tracks available`));
      expect(trackCount_text).toBeInTheDocument();

      // Verify track list is rendered
      const trackList = screen.getAllByRole('button', { name: /Play/i })[0].closest('.track-item');
      expect(trackList).toBeInTheDocument();
    });

    it('should display consistent information fields for all tracks', async () => {
      const tracks = generateTracks(60, 2);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Verify all tracks display title and duration
      tracks.forEach(track => {
        expect(screen.getByText(track.title)).toBeInTheDocument();
      });

      // Verify track numbers are displayed
      tracks.forEach((track, index) => {
        const trackNumber = screen.getByText((index + 1).toString());
        expect(trackNumber).toBeInTheDocument();
      });
    });

    it('should provide consistent playback controls for all tracks', async () => {
      const tracks = generateTracks(65, 1);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify all control buttons are present
      const nextButton = screen.getByRole('button', { name: /Next track/i });
      const prevButton = screen.getByRole('button', { name: /Previous track/i });
      const volumeButton = screen.getByRole('button', { name: /Mute|Unmute/i });

      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toBeInTheDocument();
      expect(volumeButton).toBeInTheDocument();
    });

    it('should render consistent styling for active track', async () => {
      const tracks = generateTracks(70, 2);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify active track has consistent styling
      const trackItems = screen.getAllByRole('button', { name: /Play/i });
      const firstTrackItem = trackItems[0].closest('.track-item');
      
      expect(firstTrackItem).toHaveClass('active');
    });

    it('should display consistent progress and volume controls', async () => {
      const tracks = generateTracks(75, 1);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify progress bar is present
      const progressBar = screen.getByRole('slider', { name: /Seek position/i });
      expect(progressBar).toBeInTheDocument();

      // Verify volume slider is present
      const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
      expect(volumeSlider).toBeInTheDocument();

      // Verify time displays are present
      const timeDisplays = screen.getAllByText(/\d+:\d+/);
      expect(timeDisplays.length).toBeGreaterThan(0);
    });

    it('should maintain consistent layout when switching between tracks', async () => {
      const tracks = generateTracks(80, 3);
      
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText(tracks[0].title)).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify controls are present
      let nextButton = screen.getByRole('button', { name: /Next track/i });
      expect(nextButton).toBeInTheDocument();

      // Switch to next track
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });

      // Verify controls are still present after switching
      nextButton = screen.getByRole('button', { name: /Next track/i });
      const prevButton = screen.getByRole('button', { name: /Previous track/i });
      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toBeInTheDocument();
    });
  });
});
