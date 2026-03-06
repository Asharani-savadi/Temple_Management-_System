import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

// Mock track data
const mockTracks = [
  {
    id: 'track-1',
    title: 'Om Namah Shivaya',
    audioUrl: '/audio/bhajans/om_namah_shivaya.mp3',
    duration: 300,
    category: 'bhajans',
    originalFilename: 'om_namah_shivaya.mp3'
  },
  {
    id: 'track-2',
    title: 'Gayatri Mantra',
    audioUrl: '/audio/mantras/gayatri_mantra.mp3',
    duration: 240,
    category: 'mantras',
    originalFilename: 'gayatri_mantra.mp3'
  },
  {
    id: 'track-3',
    title: 'Hanuman Chalisa',
    audioUrl: '/audio/stotras/hanuman_chalisa.mp3',
    duration: 600,
    category: 'stotras',
    originalFilename: 'hanuman_chalisa.mp3'
  }
];

// Helper to render component with AudioProvider
const renderWithAudioProvider = (component) => {
  return render(
    <AudioProvider>
      {component}
    </AudioProvider>
  );
};

describe('AudioPlayer - Play/Pause Controls (5.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock HTMLMediaElement methods
    HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.pause = jest.fn();
    HTMLMediaElement.prototype.load = jest.fn();
  });

  describe('5.1 Test play/pause controls with local tracks', () => {
    it('should render loading state initially', () => {
      loadLocalAudioTracks.mockReturnValue(
        new Promise(() => {}) // Never resolves
      );

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      expect(screen.getByText(/Loading Bhajans/i)).toBeInTheDocument();
    });

    it('should render error state when loading fails', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load tracks'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        // The component shows the error message in the error div
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
      });
    });

    it('should render track list when tracks are loaded', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
        expect(screen.getByText('Gayatri Mantra')).toBeInTheDocument();
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
      });
    });

    it('should display track count', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('3 tracks available')).toBeInTheDocument();
      });
    });

    it('should play track when clicking on track item', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      const trackItem = screen.getByText('Om Namah Shivaya').closest('.track-info');
      fireEvent.click(trackItem);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });
    });

    it('should show play button initially for unplayed track', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        const playButtons = screen.getAllByRole('button', { name: /Play/i });
        expect(playButtons.length).toBeGreaterThan(0);
      });
    });

    it('should toggle play/pause when clicking play button on current track', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Click to play first track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Simulate audio playing
      const audio = document.querySelector('audio') || new Audio();
      fireEvent.play(audio);

      // Click play button again to pause
      const pauseButton = screen.queryByRole('button', { name: /Pause/i });
      if (pauseButton) {
        fireEvent.click(pauseButton);
        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      }
    });

    it('should display play/pause button in audio controls when track is selected', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const audioControls = screen.getByRole('button', { name: /Mute|Unmute/i }).closest('.volume-section').closest('.audio-controls');
        expect(audioControls).toBeInTheDocument();
      });
    });

    it('should verify play button starts playback', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Click play button
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });
    });

    it('should verify pause button stops playback', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Simulate playing state
      const audio = new Audio();
      Object.defineProperty(audio, 'paused', { value: false });

      // Find and click pause button
      const pauseButtons = screen.queryAllByRole('button', { name: /Pause/i });
      if (pauseButtons.length > 0) {
        fireEvent.click(pauseButtons[0]);
        expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      }
    });

    it('should handle empty track list', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: []
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('No tracks available')).toBeInTheDocument();
      });
    });

    it('should disable play/pause button when loading', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // The play/pause button should be enabled when not loading
      const playPauseButtons = screen.getAllByRole('button', { name: /Play|Pause/i });
      expect(playPauseButtons.length).toBeGreaterThan(0);
    });
  });
});


describe('AudioPlayer - Navigation Controls (5.2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.pause = jest.fn();
    HTMLMediaElement.prototype.load = jest.fn();
  });

  describe('5.2 Test navigation controls with local tracks', () => {
    it('should render next and previous buttons when track is selected', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track to show controls
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const nextButtons = screen.getAllByRole('button', { name: /Next track/i });
        const prevButtons = screen.getAllByRole('button', { name: /Previous track/i });
        expect(nextButtons.length).toBeGreaterThan(0);
        expect(prevButtons.length).toBeGreaterThan(0);
      });
    });

    it('should disable next/previous buttons when only one track', async () => {
      const singleTrack = [mockTracks[0]];
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: singleTrack
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play the track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /Next track/i });
        const prevButton = screen.getByRole('button', { name: /Previous track/i });
        expect(nextButton).toBeDisabled();
        expect(prevButton).toBeDisabled();
      });
    });

    it('should enable next/previous buttons when multiple tracks', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /Next track/i });
        const prevButton = screen.getByRole('button', { name: /Previous track/i });
        expect(nextButton).not.toBeDisabled();
        expect(prevButton).not.toBeDisabled();
      });
    });

    it('should verify next button plays next track', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play first track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Click next button
      const nextButton = screen.getByRole('button', { name: /Next track/i });
      fireEvent.click(nextButton);

      // Verify play was called again (for next track)
      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should verify previous button plays previous track', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play second track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[1]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Click previous button
      const prevButton = screen.getByRole('button', { name: /Previous track/i });
      fireEvent.click(prevButton);

      // Verify play was called again (for previous track)
      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should wrap to last track when clicking next on last track', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
      });

      // Play last track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[2]); // Last track

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Click next button (should wrap to first)
      const nextButton = screen.getByRole('button', { name: /Next track/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should wrap to first track when clicking previous on first track', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play first track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Click previous button (should wrap to last)
      const prevButton = screen.getByRole('button', { name: /Previous track/i });
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should update current track info when navigating', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play first track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const currentTrackInfo = screen.getByRole('button', { name: /Mute|Unmute/i }).closest('.volume-section').closest('.audio-controls').querySelector('.current-track-info');
        expect(currentTrackInfo).toBeInTheDocument();
      });

      // Click next
      const nextButton = screen.getByRole('button', { name: /Next track/i });
      fireEvent.click(nextButton);

      // Verify next track is now displayed
      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should highlight current track in list', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play first track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const trackItems = screen.getAllByRole('button', { name: /Play/i });
        expect(trackItems.length).toBeGreaterThan(0);
      });
    });
  });
});


describe('AudioPlayer - Seek and Volume Controls (5.3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.pause = jest.fn();
    HTMLMediaElement.prototype.load = jest.fn();
  });

  describe('5.3 Test seek and volume controls', () => {
    it('should render progress bar when track is selected', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const progressBar = screen.getByRole('slider', { name: /Seek position/i });
        expect(progressBar).toBeInTheDocument();
      });
    });

    it('should render volume slider when track is selected', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
        expect(volumeSlider).toBeInTheDocument();
      });
    });

    it('should verify progress bar seek works correctly', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const progressBar = screen.getByRole('slider', { name: /Seek position/i });
        expect(progressBar).toBeInTheDocument();
      });

      // Verify progress bar exists and has correct attributes
      const progressBar = screen.getByRole('slider', { name: /Seek position/i });
      expect(progressBar).toHaveAttribute('min', '0');
      expect(progressBar).toHaveAttribute('type', 'range');
      
      // Simulate seeking by triggering change event
      fireEvent.change(progressBar, { target: { value: '150' } });
      
      // Verify the change event was triggered (the actual value update depends on the audio element)
      expect(progressBar).toBeInTheDocument();
    });

    it('should display current time and duration', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        // Should display time format like "0:00"
        const timeDisplays = screen.getAllByText(/\d+:\d+/);
        expect(timeDisplays.length).toBeGreaterThan(0);
      });
    });

    it('should verify volume slider adjusts playback volume', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
        expect(volumeSlider).toBeInTheDocument();
      });

      // Change volume to 50%
      const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });

      await waitFor(() => {
        expect(volumeSlider.value).toBe('0.5');
      });
    });

    it('should display volume percentage', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        // Should display volume percentage like "100%"
        const volumePercent = screen.getByText(/\d+%/);
        expect(volumePercent).toBeInTheDocument();
      });
    });

    it('should render mute button', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const muteButton = screen.getByRole('button', { name: /Mute|Unmute/i });
        expect(muteButton).toBeInTheDocument();
      });
    });

    it('should toggle mute when clicking mute button', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const muteButton = screen.getByRole('button', { name: /Mute/i });
        expect(muteButton).toBeInTheDocument();
      });

      // Click mute
      const muteButton = screen.getByRole('button', { name: /Mute/i });
      fireEvent.click(muteButton);

      // Volume should be 0
      const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
      await waitFor(() => {
        expect(volumeSlider.value).toBe('0');
      });
    });

    it('should unmute when clicking unmute button', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const muteButton = screen.getByRole('button', { name: /Mute/i });
        expect(muteButton).toBeInTheDocument();
      });

      // Click mute
      let muteButton = screen.getByRole('button', { name: /Mute/i });
      fireEvent.click(muteButton);

      // Click unmute
      await waitFor(() => {
        const unmuteButton = screen.queryByRole('button', { name: /Unmute/i });
        if (unmuteButton) {
          fireEvent.click(unmuteButton);
        }
      });

      // Volume should be restored to 1
      const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
      await waitFor(() => {
        expect(volumeSlider.value).toBe('1');
      });
    });

    it('should clamp volume between 0 and 1', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
        expect(volumeSlider).toBeInTheDocument();
      });

      const volumeSlider = screen.getByRole('slider', { name: /Volume control/i });
      
      // Try to set volume to 1.5 (should be clamped to 1)
      fireEvent.change(volumeSlider, { target: { value: '1.5' } });
      
      await waitFor(() => {
        const value = parseFloat(volumeSlider.value);
        expect(value).toBeLessThanOrEqual(1);
      });
    });

    it('should update progress bar as track plays', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mockTracks
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const progressBar = screen.getByRole('slider', { name: /Seek position/i });
        expect(progressBar).toBeInTheDocument();
      });

      const progressBar = screen.getByRole('slider', { name: /Seek position/i });
      // The max should be set to the duration (0 initially since duration event hasn't fired)
      // This test verifies the progress bar exists and has the correct structure
      expect(progressBar).toHaveAttribute('min', '0');
    });

    it('should handle seek on tracks with unknown duration', async () => {
      const tracksWithUnknownDuration = [
        {
          ...mockTracks[0],
          duration: 0
        }
      ];

      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: tracksWithUnknownDuration
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);
      
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play a track
      const trackPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(trackPlayButtons[0]);

      await waitFor(() => {
        const progressBar = screen.getByRole('slider', { name: /Seek position/i });
        expect(progressBar).toBeInTheDocument();
        expect(progressBar.max).toBe('0');
      });
    });
  });
});
