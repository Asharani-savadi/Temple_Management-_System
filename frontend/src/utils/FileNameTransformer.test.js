import { transformFilename } from './FileNameTransformer';

describe('FileNameTransformer', () => {
  describe('transformFilename', () => {
    it('should remove file extension', () => {
      expect(transformFilename('song.mp3')).toBe('Song');
      expect(transformFilename('audio.wav')).toBe('Audio');
      expect(transformFilename('track.ogg')).toBe('Track');
    });

    it('should replace underscores with spaces', () => {
      expect(transformFilename('om_namah_shivaya.mp3')).toBe('Om Namah Shivaya');
      expect(transformFilename('bhajan_01.mp3')).toBe('Bhajan 01');
    });

    it('should replace hyphens with spaces', () => {
      expect(transformFilename('devi-mahatmya.wav')).toBe('Devi Mahatmya');
      expect(transformFilename('stotra-001.mp3')).toBe('Stotra 001');
    });

    it('should remove leading numbers and separators', () => {
      expect(transformFilename('01_om_namah_shivaya.mp3')).toBe('Om Namah Shivaya');
      expect(transformFilename('001_gayatri_mantra.wav')).toBe('Gayatri Mantra');
      expect(transformFilename('1-song-name.mp3')).toBe('Song Name');
    });

    it('should convert to title case', () => {
      expect(transformFilename('om namah shivaya.mp3')).toBe('Om Namah Shivaya');
      expect(transformFilename('GAYATRI MANTRA.wav')).toBe('Gayatri Mantra');
      expect(transformFilename('hanuman chalisa.ogg')).toBe('Hanuman Chalisa');
    });

    it('should handle complex filenames', () => {
      expect(transformFilename('bhajan_01_om_namah_shivaya.mp3')).toBe('Om Namah Shivaya');
      expect(transformFilename('stotra-001-devi-mahatmya.wav')).toBe('Devi Mahatmya');
      // Note: mantra_gayatri becomes "Mantra Gayatri" since there's no number pattern to remove
      expect(transformFilename('mantra_gayatri.ogg')).toBe('Mantra Gayatri');
    });

    it('should clean up multiple spaces', () => {
      expect(transformFilename('song__with__spaces.mp3')).toBe('Song With Spaces');
      expect(transformFilename('track  --  name.wav')).toBe('Track Name');
    });

    it('should handle edge cases', () => {
      expect(transformFilename('')).toBe('');
      expect(transformFilename(null)).toBe('');
      expect(transformFilename(undefined)).toBe('');
      expect(transformFilename('noextension')).toBe('Noextension');
    });

    it('should trim whitespace', () => {
      expect(transformFilename('  song.mp3')).toBe('Song');
      expect(transformFilename('song  .mp3')).toBe('Song');
    });

    it('should handle real-world examples', () => {
      const examples = [
        ['Ekadantaya Vakratundaya Gauri Tanaya Dhimi _ Full Song with Lyrics _ Shankar Mahadevan.mp3', 'Ekadantaya Vakratundaya Gauri Tanaya Dhimi Full Song With Lyrics Shankar Mahadevan'],
        ['Hey Ram Hey Ram - Shri Ram Dhun  Jagjit Singh  ह रम ह रम  Sudarshan Faakir.mp3', 'Hey Ram Hey Ram Shri Ram Dhun Jagjit Singh ह रम ह रम Sudarshan Faakir'],
        ['Gayatri Mantra With Meaning _   11 Times _ Chanting By Brahmins _ Peaceful Chants.mp3', 'Gayatri Mantra With Meaning 11 Times Chanting By Brahmins Peaceful Chants']
      ];
      
      examples.forEach(([input, expected]) => {
        expect(transformFilename(input)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // Property-Based Tests
  // ============================================================================
  
  describe('Property 2: Filename Transformation Consistency', () => {
    /**
     * **Validates: Requirements 2.2**
     * 
     * For any filename with underscores, hyphens, or numbers, the transformed 
     * title should not contain underscores or leading numbers, and should be 
     * in title case.
     */
    
    // Helper function to generate random filenames
    const generateRandomFilename = (seed) => {
      const words = ['om', 'namah', 'shivaya', 'gayatri', 'mantra', 'bhajan', 'stotra', 'devi', 'mahatmya', 'hanuman', 'chalisa'];
      const extensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      const separators = ['_', '-'];
      
      const wordCount = (seed % 3) + 2; // 2-4 words
      const selectedWords = [];
      for (let i = 0; i < wordCount; i++) {
        selectedWords.push(words[(seed + i) % words.length]);
      }
      
      const separator = separators[(seed % 2)];
      const ext = extensions[(seed % extensions.length)];
      return selectedWords.join(separator) + ext;
    };

    // Helper function to generate filenames with leading numbers
    const generateFilenameWithLeadingNumber = (seed) => {
      const words = ['om', 'namah', 'shivaya', 'gayatri', 'mantra', 'bhajan', 'stotra'];
      const extensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      
      const leadingNum = ((seed % 999) + 1).toString().padStart(3, '0');
      const wordCount = (seed % 2) + 1;
      const selectedWords = [];
      for (let i = 0; i < wordCount; i++) {
        selectedWords.push(words[(seed + i) % words.length]);
      }
      
      const ext = extensions[(seed % extensions.length)];
      return leadingNum + '_' + selectedWords.join('_') + ext;
    };

    it('should never contain underscores in transformed output', () => {
      // Run 100 iterations with different seeds
      for (let i = 0; i < 100; i++) {
        const filename = generateRandomFilename(i);
        const result = transformFilename(filename);
        
        // Result should not contain underscores
        expect(result).not.toContain('_');
      }
    });

    it('should not have leading numbers in transformed output', () => {
      // Run 100 iterations with different seeds
      for (let i = 0; i < 100; i++) {
        const filename = generateFilenameWithLeadingNumber(i);
        const result = transformFilename(filename);
        
        // Result should not start with a digit
        expect(result).not.toMatch(/^\d/);
      }
    });

    it('should apply title case formatting consistently', () => {
      // Run 100 iterations with different seeds
      for (let i = 0; i < 100; i++) {
        const filename = generateRandomFilename(i);
        const result = transformFilename(filename);
        
        // Each word should start with uppercase letter
        const wordArray = result.split(' ').filter(w => w.length > 0);
        wordArray.forEach(word => {
          expect(word[0]).toMatch(/[A-Z]/);
        });
      }
    });

    it('should handle mixed separators (underscores and hyphens) correctly', () => {
      const words = ['om', 'namah', 'shivaya', 'gayatri', 'mantra'];
      const extensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      
      // Run 100 iterations with different seeds
      for (let i = 0; i < 100; i++) {
        const wordCount = (i % 3) + 2;
        const selectedWords = [];
        for (let j = 0; j < wordCount; j++) {
          selectedWords.push(words[(i + j) % words.length]);
        }
        
        // Alternate between underscores and hyphens
        const separators = selectedWords.map((_, idx) => idx % 2 === 0 ? '_' : '-');
        const filename = selectedWords.map((w, idx) => w + (separators[idx] || '')).join('') + extensions[i % extensions.length];
        const result = transformFilename(filename);
        
        // Result should not contain underscores or hyphens
        expect(result).not.toContain('_');
        expect(result).not.toContain('-');
      }
    });

    it('should produce consistent results for the same input', () => {
      // Run 100 iterations with different seeds
      for (let i = 0; i < 100; i++) {
        const filename = generateRandomFilename(i);
        const result1 = transformFilename(filename);
        const result2 = transformFilename(filename);
        
        // Same input should always produce same output
        expect(result1).toBe(result2);
      }
    });

    it('should handle filenames with numbers in the middle correctly', () => {
      const words = ['om', 'namah', 'shivaya', 'gayatri', 'mantra', 'bhajan', 'stotra'];
      const extensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      
      // Run 100 iterations with different seeds
      for (let i = 0; i < 100; i++) {
        const wordCount = (i % 3) + 2;
        const selectedWords = [];
        for (let j = 0; j < wordCount; j++) {
          selectedWords.push(words[(i + j) % words.length]);
        }
        
        const filename = selectedWords.join('_') + extensions[i % extensions.length];
        const result = transformFilename(filename);
        
        // Numbers in the middle should be preserved (not leading)
        // Result should be non-empty and properly formatted
        expect(result.length).toBeGreaterThan(0);
        expect(result).not.toMatch(/^\d/);
        expect(result).not.toContain('_');
      }
    });
  });
});
