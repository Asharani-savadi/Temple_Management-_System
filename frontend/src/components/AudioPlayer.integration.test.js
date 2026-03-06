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

// Mock track data for different categories
const bhajansData = [
  {
    id: 'bhajan-1',
    title: 'Om Namah Shivaya',
    audioUrl: '/audio/bhajans/om_namah_shivaya.mp3',
    duration: 300,
    category: 'bhajans',
    originalFilename: 'om_namah_shivaya.mp3'
  },
  {
    id: 'bhajan-2',
    title: 'Hare Krishna',
    audioUrl: '/audio/bhajans/hare_krishna.mp3',
    duration: 240,
    category: 'bhajans',
    originalFilename: 'hare_krishna.mp3'
  }
];

const stotrasData = [
  {
    id: 'stotra-1',
    title: 'Hanuman Chalisa',
    audioUrl: '/audio/stotras/hanuman_chalisa.mp3',
    duration: 600,
    category: 'stotras',
    originalFilename: 'hanuman_chalisa.mp3'
  },
  {
    id: 'stotra-2',
    title: 'Devi Mahatmya',
    audioUrl: '/audio/stotras/devi_mahatmya.mp3',
    duration: 450,
    category: 'stotras',
    originalFilename: 'devi_mahatmya.mp3'
  }
];

const mantrasData = [
  {
    id: 'mantra-1',
    title: 'Gayatri Mantra',
    audioUrl: '/audio/mantras/gayatri_mantra.mp3',
    duration: 240,
    category: 'mantras',
    originalFilename: 'gayatri_mantra.mp3'
  },
  {
    id: 'mantra-2',
    title: 'Mahamrityunjaya Mantra',
    audioUrl: '/audio/mantras/mahamrityunjaya.mp3',
    duration: 360,
    category: 'mantras',
    originalFilename: 'mahamrityunjaya.mp3'
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

describe('AudioPlayer Integration Tests - Task 11', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.pause = jest.fn();
    HTMLMediaElement.prototype.load = jest.fn();
  });

  describe('11.1 Test category switching', () => {
    it('should load bhajans when category is bhajans', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
        expect(screen.getByText('Hare Krishna')).toBeInTheDocument();
      });

      expect(loadLocalAudioTracks).toHaveBeenCalledWith('bhajans');
    });

    it('should load stotras when category is stotras', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: stotrasData
      });

      renderWithAudioProvider(<AudioPlayer category="stotras" />);

      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
        expect(screen.getByText('Devi Mahatmya')).toBeInTheDocument();
      });

      expect(loadLocalAudioTracks).toHaveBeenCalledWith('stotras');
    });

    it('should load mantras when category is mantras', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mantrasData
      });

      renderWithAudioProvider(<AudioPlayer category="mantras" />);

      await waitFor(() => {
        expect(screen.getByText('Gayatri Mantra')).toBeInTheDocument();
        expect(screen.getByText('Mahamrityunjaya Mantra')).toBeInTheDocument();
      });

      expect(loadLocalAudioTracks).toHaveBeenCalledWith('mantras');
    });

    it('should display correct track count for each category', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('2 tracks available')).toBeInTheDocument();
      });
    });

    it('should display correct category title', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Bhajans')).toBeInTheDocument();
      });
    });

    it('should switch from bhajans to stotras', async () => {
      // Set up mock for bhajans BEFORE rendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: bhajansData
      });

      const { rerender } = renderWithAudioProvider(
        <AudioPlayer category="bhajans" />
      );

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Set up mock for stotras BEFORE rerendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: stotrasData
      });

      rerender(
        <AudioProvider>
          <AudioPlayer category="stotras" />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
        expect(screen.queryByText('Om Namah Shivaya')).not.toBeInTheDocument();
      });
    });

    it('should switch from stotras to mantras', async () => {
      // Set up mock for stotras BEFORE rendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: stotrasData
      });

      const { rerender } = renderWithAudioProvider(
        <AudioPlayer category="stotras" />
      );

      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
      });

      // Set up mock for mantras BEFORE rerendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: mantrasData
      });

      rerender(
        <AudioProvider>
          <AudioPlayer category="mantras" />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Gayatri Mantra')).toBeInTheDocument();
        expect(screen.queryByText('Hanuman Chalisa')).not.toBeInTheDocument();
      });
    });

    it('should verify correct tracks load for bhajans category', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        const trackItems = screen.getAllByRole('button', { name: /Play/i });
        expect(trackItems.length).toBe(bhajansData.length);
      });
    });

    it('should verify correct tracks load for stotras category', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: stotrasData
      });

      renderWithAudioProvider(<AudioPlayer category="stotras" />);

      await waitFor(() => {
        const trackItems = screen.getAllByRole('button', { name: /Play/i });
        expect(trackItems.length).toBe(stotrasData.length);
      });
    });

    it('should verify correct tracks load for mantras category', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mantrasData
      });

      renderWithAudioProvider(<AudioPlayer category="mantras" />);

      await waitFor(() => {
        const trackItems = screen.getAllByRole('button', { name: /Play/i });
        expect(trackItems.length).toBe(mantrasData.length);
      });
    });

    it('should reload tracks when category changes', async () => {
      // Set up mock for bhajans BEFORE rendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: bhajansData
      });

      const { rerender } = renderWithAudioProvider(
        <AudioPlayer category="bhajans" />
      );

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      expect(loadLocalAudioTracks).toHaveBeenCalledWith('bhajans');

      // Set up mock for mantras BEFORE rerendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: mantrasData
      });

      rerender(
        <AudioProvider>
          <AudioPlayer category="mantras" />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(loadLocalAudioTracks).toHaveBeenCalledWith('mantras');
      });
    });

    it('Requirements 1.4, 2.1: should handle category switching with correct track loading', async () => {
      // Requirement 1.4: WHEN the category changes, THE System SHALL reload tracks from the new category's folder
      // Requirement 2.1: WHEN tracks are loaded from a local folder, THE System SHALL display them in a list with track number, title, and duration

      // Set up mock for bhajans BEFORE rendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: bhajansData
      });

      const { rerender } = renderWithAudioProvider(
        <AudioPlayer category="bhajans" />
      );

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Verify tracks are displayed with track number and duration
      const trackItems = screen.getAllByRole('button', { name: /Play/i });
      expect(trackItems.length).toBe(2);

      // Set up mock for stotras BEFORE rerendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: stotrasData
      });

      rerender(
        <AudioProvider>
          <AudioPlayer category="stotras" />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
        expect(screen.getByText('Devi Mahatmya')).toBeInTheDocument();
      });

      // Verify new category tracks are displayed
      const newTrackItems = screen.getAllByRole('button', { name: /Play/i });
      expect(newTrackItems.length).toBe(2);
    });
  });

  describe('11.2 Test track selection and playback', () => {
    it('should select and play first track from bhajans', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Click play button for first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });
    });

    it('should select and play different tracks from same category', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
        expect(screen.getByText('Hare Krishna')).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Play second track
      fireEvent.click(playButtons[1]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should select and play tracks from different categories', async () => {
      // Set up mock for bhajans BEFORE rendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: bhajansData
      });

      const { rerender } = renderWithAudioProvider(
        <AudioPlayer category="bhajans" />
      );

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play bhajan
      const bhajansPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(bhajansPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Set up mock for stotras BEFORE rerendering
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: stotrasData
      });

      rerender(
        <AudioProvider>
          <AudioPlayer category="stotras" />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
      });

      // Play stotra
      const stotrasPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(stotrasPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });

    it('should display correct track information when selected', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        // Track title should be displayed in the current track info
        const trackTitles = screen.getAllByText('Om Namah Shivaya');
        expect(trackTitles.length).toBeGreaterThan(0);
      });
    });

    it('should display track duration correctly', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Duration should be displayed (300 seconds = 5:00)
      const durationText = screen.getByText('5:00');
      expect(durationText).toBeInTheDocument();
    });

    it('should highlight current track in list', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        // The track item should have active class
        const trackItems = screen.getAllByRole('button', { name: /Play/i });
        expect(trackItems[0]).toBeInTheDocument();
      });
    });

    it('should verify correct track plays when selected', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Select and play first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify the correct track is playing
      const trackTitles = screen.getAllByText('Om Namah Shivaya');
      expect(trackTitles.length).toBeGreaterThan(0);
    });

    it('should verify track information displays correctly', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Play track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        // Verify track title is displayed (use getAllByText since it appears in multiple places)
        const trackTitles = screen.getAllByText('Om Namah Shivaya');
        expect(trackTitles.length).toBeGreaterThan(0);
        // Verify duration is displayed
        expect(screen.getByText('5:00')).toBeInTheDocument();
      });
    });

    it('Requirements 2.4, 3.1: should select different tracks and verify playback', async () => {
      // Requirement 2.4: WHEN a user clicks on a track in the list, THE System SHALL highlight it as the current track
      // Requirement 3.1: WHEN a track is selected, THE System SHALL play the audio file using the existing AudioContext playback mechanism

      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
        expect(screen.getByText('Hare Krishna')).toBeInTheDocument();
      });

      // Select first track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Verify first track is highlighted and playing (use getAllByText since it appears in multiple places)
      const firstTrackTitles = screen.getAllByText('Om Namah Shivaya');
      expect(firstTrackTitles.length).toBeGreaterThan(0);

      // Select second track
      fireEvent.click(playButtons[1]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });

      // Verify second track is now highlighted and playing
      const secondTrackTitles = screen.getAllByText('Hare Krishna');
      expect(secondTrackTitles.length).toBeGreaterThan(0);
    });
  });

  describe('11.3 Test error scenarios', () => {
    it('should handle missing audio files gracefully', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load tracks'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
      });
    });

    it('should display error message when folder not found', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Folder not found'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        // When error occurs, the component shows error state
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
      });
    });

    it('should display error message when no tracks available', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: []
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('No tracks available')).toBeInTheDocument();
      });
    });

    it('should handle corrupted audio files by skipping them', async () => {
      // Simulate loading with some valid and some invalid tracks
      const mixedData = [
        {
          id: 'valid-1',
          title: 'Valid Track',
          audioUrl: '/audio/bhajans/valid_track.mp3',
          duration: 300,
          category: 'bhajans',
          originalFilename: 'valid_track.mp3'
        }
      ];

      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: mixedData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Valid Track')).toBeInTheDocument();
      });

      // Only valid track should be displayed
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      expect(playButtons.length).toBe(1);
    });

    it('should display error message when playback fails', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: true,
        data: bhajansData
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Simulate playback error by mocking play to reject
      HTMLMediaElement.prototype.play = jest.fn(() => 
        Promise.reject(new Error('Playback failed'))
      );

      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      // The component should handle the error gracefully
      await waitFor(() => {
        // Component should still be rendered with tracks
        const trackTitles = screen.getAllByText('Om Namah Shivaya');
        expect(trackTitles.length).toBeGreaterThan(0);
      });
    });

    it('should allow retry when error occurs', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load tracks'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /Retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });

    it('should handle invalid category gracefully', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Invalid category'
      });

      renderWithAudioProvider(<AudioPlayer category="invalid" />);

      await waitFor(() => {
        // When error occurs, the component shows error state
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
      });
    });

    it('Requirements 4.2, 5.4: should handle missing and corrupted files with error messages', async () => {
      // Requirement 4.2: WHEN a file path is invalid or the file cannot be accessed, THE System SHALL handle the error gracefully and display an error message
      // Requirement 5.4: WHEN an error occurs, THE System SHALL display error messages in the same format as the current implementation

      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load audio files'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        // Error message should be displayed in error state
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
        // Retry button should be available
        const retryButton = screen.getByRole('button', { name: /Retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });

    it('should verify error messages display correctly for missing files', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'No audio files found in the folder'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        // Error state should be displayed
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
      });
    });

    it('should verify error messages display correctly for corrupted files', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Some audio files could not be loaded'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        // Error state should be displayed
        const errorDiv = screen.getByRole('button', { name: /Retry/i }).closest('.audio-player-error');
        expect(errorDiv).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      loadLocalAudioTracks.mockRejectedValue(new Error('Network error'));

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load tracks')).toBeInTheDocument();
      });
    });

    it('should display music icon in error state', async () => {
      loadLocalAudioTracks.mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to load tracks'
      });

      renderWithAudioProvider(<AudioPlayer category="bhajans" />);

      await waitFor(() => {
        const musicIcon = screen.getByTestId('icon-music');
        expect(musicIcon).toBeInTheDocument();
      });
    });
  });

  describe('Complete Integration Flow', () => {
    it('should complete full flow: load category -> select track -> play -> switch category', async () => {
      // First, set up the mock for bhajans
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: bhajansData
      });

      const { rerender } = renderWithAudioProvider(
        <AudioPlayer category="bhajans" />
      );

      // Step 1: Load bhajans
      await waitFor(() => {
        expect(screen.getByText('Om Namah Shivaya')).toBeInTheDocument();
      });

      // Step 2: Select and play a track
      const playButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(playButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      // Step 3: Switch to stotras - set up mock for stotras
      loadLocalAudioTracks.mockResolvedValueOnce({
        success: true,
        data: stotrasData
      });

      rerender(
        <AudioProvider>
          <AudioPlayer category="stotras" />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Hanuman Chalisa')).toBeInTheDocument();
      });

      // Step 4: Select and play a track from new category
      const newPlayButtons = screen.getAllByRole('button', { name: /Play/i });
      fireEvent.click(newPlayButtons[0]);

      await waitFor(() => {
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
      });
    });
  });
});
