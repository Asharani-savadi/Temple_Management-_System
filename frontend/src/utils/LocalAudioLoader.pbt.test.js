import { loadLocalAudioTracks } from './LocalAudioLoader';

/**
 * Property-Based Tests for LocalAudioLoader
 * These tests verify universal properties that should hold across all inputs
 * 
 * Note: Using manual property-based testing approach compatible with Jest
 */

describe('LocalAudioLoader - Property-Based Tests', () => {
  /**
   * Property 1: All Loaded Tracks Have Valid Paths
   * Validates: Requirements 4.1, 4.2
   * 
   * For any category and any loaded track, the track's audioUrl should be 
   * a valid, non-empty string that points to an accessible audio file.
   */
  describe('Property 1: All Loaded Tracks Have Valid Paths', () => {
    it('should ensure all tracks have valid, non-empty audioUrl strings', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        
        if (result.success && result.data.length > 0) {
          result.data.forEach(track => {
            // audioUrl must be a non-empty string
            expect(typeof track.audioUrl).toBe('string');
            expect(track.audioUrl.length).toBeGreaterThan(0);
            
            // audioUrl should follow the expected path pattern
            expect(track.audioUrl).toMatch(/^\/audio\/(bhajans|stotras|mantras)\/.+\.(mp3|wav|ogg|m4a)$/i);
            
            // audioUrl should contain the category folder
            expect(track.audioUrl).toContain(`/audio/${category}/`);
          });
        }
      }
    });

    it('should verify audioUrl format consistency across all categories (100+ iterations)', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      // Run 100+ iterations by testing each category multiple times
      for (let iteration = 0; iteration < 100; iteration++) {
        for (const category of categories) {
          const result = await loadLocalAudioTracks(category);
          
          if (result.success && result.data.length > 0) {
            result.data.forEach(track => {
              // All audioUrl values must be strings
              expect(typeof track.audioUrl).toBe('string');
              
              // All audioUrl values must be non-empty
              expect(track.audioUrl.length).toBeGreaterThan(0);
              
              // All audioUrl values must start with /audio/
              expect(track.audioUrl.startsWith('/audio/')).toBe(true);
              
              // All audioUrl values must contain a valid file extension
              const hasValidExtension = /\.(mp3|wav|ogg|m4a)$/i.test(track.audioUrl);
              expect(hasValidExtension).toBe(true);
            });
          }
        }
      }
    });
  });

  /**
   * Property 3: Track List Completeness
   * Validates: Requirements 1.1, 6.1, 6.2
   * 
   * For any category folder containing audio files, the loaded track list 
   * should include all files with supported audio formats and exclude files 
   * with unsupported formats.
   */
  describe('Property 3: Track List Completeness', () => {
    it('should include all supported audio formats and exclude unsupported ones', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a'];
      
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        
        expect(result.success).toBe(true);
        
        if (result.data.length > 0) {
          // All returned tracks should have supported formats
          result.data.forEach(track => {
            const hasValidFormat = supportedFormats.some(format => 
              track.originalFilename.toLowerCase().endsWith(format)
            );
            expect(hasValidFormat).toBe(true);
          });
        }
      }
    });

    it('should verify that all returned tracks have valid audio file extensions (100+ iterations)', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      // Run 100+ iterations by testing each category multiple times
      for (let iteration = 0; iteration < 100; iteration++) {
        for (const category of categories) {
          const result = await loadLocalAudioTracks(category);
          
          expect(result.success).toBe(true);
          
          if (result.data.length > 0) {
            result.data.forEach(track => {
              // Each track's originalFilename must have a supported extension
              const filename = track.originalFilename.toLowerCase();
              const supportedExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
              const hasSupportedExtension = supportedExtensions.some(ext => 
                filename.endsWith(ext)
              );
              expect(hasSupportedExtension).toBe(true);
            });
          }
        }
      }
    });

    it('should ensure all tracks have non-empty originalFilename', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        
        if (result.data.length > 0) {
          result.data.forEach(track => {
            expect(track.originalFilename).toBeTruthy();
            expect(typeof track.originalFilename).toBe('string');
            expect(track.originalFilename.length).toBeGreaterThan(0);
          });
        }
      }
    });
  });

  /**
   * Property 4: Category Isolation
   * Validates: Requirements 1.1, 2.1
   * 
   * For any category, the loaded tracks should only contain files from that 
   * category's folder and should not include tracks from other categories.
   */
  describe('Property 4: Category Isolation', () => {
    it('should ensure tracks from each category only belong to that category', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        
        expect(result.success).toBe(true);
        
        if (result.data.length > 0) {
          result.data.forEach(track => {
            // Each track's category must match the requested category
            expect(track.category).toBe(category);
            
            // Each track's audioUrl must contain the correct category folder
            expect(track.audioUrl).toContain(`/audio/${category}/`);
          });
        }
      }
    });

    it('should verify category isolation across all categories (100+ iterations)', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      // Run 100+ iterations by testing each category multiple times
      for (let iteration = 0; iteration < 100; iteration++) {
        for (const category of categories) {
          const result = await loadLocalAudioTracks(category);
          
          expect(result.success).toBe(true);
          
          if (result.data.length > 0) {
            result.data.forEach(track => {
              // All tracks must have the correct category
              expect(track.category).toBe(category);
              
              // All tracks must have audioUrl pointing to the correct category folder
              expect(track.audioUrl).toContain(`/audio/${category}/`);
              
              // No track should contain paths from other categories
              const otherCategories = ['bhajans', 'stotras', 'mantras'].filter(c => c !== category);
              otherCategories.forEach(otherCategory => {
                expect(track.audioUrl).not.toContain(`/audio/${otherCategory}/`);
              });
            });
          }
        }
      }
    });

    it('should ensure no cross-category contamination', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      const allTracks = {};
      
      // Load tracks from all categories
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        allTracks[category] = result.data || [];
      }
      
      // Verify no track appears in multiple categories
      const allTrackIds = new Set();
      for (const category of categories) {
        allTracks[category].forEach(track => {
          // Each track ID should be unique across all categories
          expect(allTrackIds.has(track.id)).toBe(false);
          allTrackIds.add(track.id);
        });
      }
    });
  });

  /**
   * Additional verification: Track structure consistency
   * Ensures all tracks have the required fields with correct types
   */
  describe('Track Structure Consistency', () => {
    it('should ensure all tracks have required fields with correct types', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        
        if (result.data.length > 0) {
          result.data.forEach(track => {
            // Verify all required fields exist
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
            
            // Verify non-empty strings
            expect(track.id.length).toBeGreaterThan(0);
            expect(track.title.length).toBeGreaterThan(0);
            expect(track.audioUrl.length).toBeGreaterThan(0);
            expect(track.originalFilename.length).toBeGreaterThan(0);
            
            // Verify duration is non-negative
            expect(track.duration).toBeGreaterThanOrEqual(0);
          });
        }
      }
    });

    it('should ensure track IDs are unique within each category', async () => {
      const categories = ['bhajans', 'stotras', 'mantras'];
      
      for (const category of categories) {
        const result = await loadLocalAudioTracks(category);
        
        if (result.data.length > 1) {
          const ids = result.data.map(track => track.id);
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);
        }
      }
    });
  });
});
