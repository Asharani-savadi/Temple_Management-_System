import { transformFilename } from './FileNameTransformer';

// Category to folder path mapping
const CATEGORY_PATHS = {
  bhajans: '/audio/bhajans',
  stotras: '/audio/stotras',
  mantras: '/audio/mantras'
};

// Alternative paths for different environments
const CATEGORY_PATHS_ALT = {
  bhajans: 'audio/bhajans',
  stotras: 'audio/stotras',
  mantras: 'audio/mantras'
};

// Supported audio formats
const SUPPORTED_FORMATS = ['.mp3', '.wav', '.ogg', '.m4a'];

/**
 * Simple hash function for generating unique IDs in the browser
 * @param {string} str - The string to hash
 * @returns {string} - A hash string
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Generate a unique ID for a track based on its filename
 * @param {string} filename - The original filename
 * @returns {string} - A unique hash-based ID
 */
function generateTrackId(filename) {
  return simpleHash(filename).substring(0, 12);
}

/**
 * Extract duration from an audio file
 * @param {string} audioUrl - The URL/path to the audio file
 * @returns {Promise<number>} - Duration in seconds, or 0 if unable to determine
 */
async function extractDuration(audioUrl) {
  return new Promise((resolve) => {
    const audio = new Audio();
    let resolved = false;
    
    const handleLoadedMetadata = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(audio.duration || 0);
      }
    };
    
    const handleError = (e) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        console.warn(`Failed to load audio duration for ${audioUrl}:`, e);
        resolve(0);
      }
    };
    
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('abort', handleError);
      audio.pause();
      audio.src = '';
    };
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(0);
      }
    }, 5000);
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('abort', handleError);
    
    // Set crossOrigin to handle CORS issues
    audio.crossOrigin = 'anonymous';
    audio.src = audioUrl;
  });
}

/**
 * Check if a file has a supported audio format
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file format is supported
 */
function isSupportedFormat(filename) {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return SUPPORTED_FORMATS.includes(ext);
}

/**
 * Load audio tracks from a local folder for a given category
 * @param {string} category - The category (bhajans, stotras, or mantras)
 * @returns {Promise<{success: boolean, data: Array, error?: string}>}
 */
export async function loadLocalAudioTracks(category) {
  try {
    // Validate category is provided
    if (!category) {
      return {
        success: false,
        data: [],
        error: `Invalid category: ${category}`
      };
    }
    
    const categoryLower = category.toLowerCase();
    
    // Validate category
    if (!CATEGORY_PATHS[categoryLower]) {
      return {
        success: false,
        data: [],
        error: `Invalid category: ${category}`
      };
    }
    
    // Get files for the category
    const files = await getFilesForCategory(categoryLower);
    
    if (files.length === 0) {
      return {
        success: true,
        data: [],
        error: undefined
      };
    }
    
    // Filter for supported formats
    const supportedFiles = files.filter(isSupportedFormat);
    
    if (supportedFiles.length === 0) {
      return {
        success: true,
        data: [],
        error: undefined
      };
    }
    
    // Create Track objects
    const tracks = [];
    for (const filename of supportedFiles) {
      const folderPath = CATEGORY_PATHS[categoryLower];
      // Use the filename as-is - no special characters anymore
      const audioUrl = `${folderPath}/${filename}`;
      
      // Skip duration extraction - it will be loaded during playback
      const duration = 0;
      
      const track = {
        id: generateTrackId(filename),
        title: transformFilename(filename),
        audioUrl: audioUrl,
        duration: duration,
        category: categoryLower,
        originalFilename: filename
      };
      
      tracks.push(track);
    }
    
    // Sort tracks by filename for consistent ordering
    tracks.sort((a, b) => a.originalFilename.localeCompare(b.originalFilename));
    
    return {
      success: true,
      data: tracks,
      error: undefined
    };
  } catch (err) {
    console.error('Error loading local audio tracks:', err);
    return {
      success: false,
      data: [],
      error: 'Failed to load audio tracks'
    };
  }
}

/**
 * Get files for a specific category by fetching from the public audio folder
 * @param {string} category - The category name
 * @returns {Promise<Array>} - Array of filenames
 */
async function getFilesForCategory(category) {
  try {
    const folderPath = CATEGORY_PATHS[category];
    
    // In test environment, use hardcoded list
    if (process.env.NODE_ENV === 'test') {
      const audioFiles = {
        bhajans: [
          'ACHYUTAM_KESHAVAM_KRISHNA_DAMODARAM___VERY_BEAUTIFUL_SONG_-_POPULAR_KRISHNA_BHAJAN_FULL_SONG_.mp3',
          'Ekadantaya_Vakratundaya_Gauri_Tanaya_Dhimi___Full_Song_with_Lyrics___Shankar_Mahadevan.mp3',
          'Hey_Ram_Hey_Ram_-_Shri_Ram_Dhun_Jagjit_Singh_Sudarshan_Faakir.mp3',
          'Hey_Sai_Ram_Hey_Sai_Ram_Hare_Hare_Krishna_Suresh_Wadkar.mp3',
          'Namo_Namo_-_Lyrical___Kedarnath___Sushant_Rajput___Sara_Ali_Khan___Amit_Trivedi___Amitabh_B.mp3'
        ],
        stotras: [
          'Aigiri_Nandini_With_Lyrics_Mahishasura_Mardini_Rajalakshmee_Sanjay.mp3',
          'Namami_Shamishan_namamishamishan.mp3',
          'Shri_Vighneshwar_Suprabhatam_With_Lyrics_Morning_Ganesh_Mantra.mp3',
          'Vishnu_Sahasranamam_-_M._S._Subbulakshmi_Carnatic_Music_M._S._Subbulakshmi_Devotional_Song.mp3',
          'Shree_Hanuman_Chalisa_Original_Video_GULSHAN_KUMAR_HARIHARAN_8K.mp3'
        ],
        mantras: [
          'Gayatri_Mantra_With_Meaning___11_Times___Chanting_By_Brahmins___Peaceful_Chants.mp3',
          'Om_Tryambakam_Yajamahe___Shiva_Maha_Mantra_For_Spiritual_Growth___Mahamrityunjaya_Mantra_11_Times.mp3'
        ]
      };
      return audioFiles[category] || [];
    }
    
    // In production/development, try to fetch manifest file
    try {
      const manifestResponse = await fetch(`${folderPath}/manifest.json`);
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        if (manifest.files && Array.isArray(manifest.files)) {
          return manifest.files;
        }
      }
    } catch (err) {
      console.warn(`Could not fetch manifest for ${category}:`, err);
    }
    
    // Fallback: Use hardcoded file lists
    const audioFiles = {
      bhajans: [
        'ACHYUTAM_KESHAVAM_KRISHNA_DAMODARAM___VERY_BEAUTIFUL_SONG_-_POPULAR_KRISHNA_BHAJAN_FULL_SONG_.mp3',
        'Ekadantaya_Vakratundaya_Gauri_Tanaya_Dhimi___Full_Song_with_Lyrics___Shankar_Mahadevan.mp3',
        'Hey_Ram_Hey_Ram_-_Shri_Ram_Dhun_Jagjit_Singh_Sudarshan_Faakir.mp3',
        'Hey_Sai_Ram_Hey_Sai_Ram_Hare_Hare_Krishna_Suresh_Wadkar.mp3',
        'Namo_Namo_-_Lyrical___Kedarnath___Sushant_Rajput___Sara_Ali_Khan___Amit_Trivedi___Amitabh_B.mp3'
      ],
      stotras: [
        'Aigiri_Nandini_With_Lyrics_Mahishasura_Mardini_Rajalakshmee_Sanjay.mp3',
        'Namami_Shamishan_namamishamishan.mp3',
        'Shri_Vighneshwar_Suprabhatam_With_Lyrics_Morning_Ganesh_Mantra.mp3',
        'Vishnu_Sahasranamam_-_M._S._Subbulakshmi_Carnatic_Music_M._S._Subbulakshmi_Devotional_Song.mp3',
        'Shree_Hanuman_Chalisa_Original_Video_GULSHAN_KUMAR_HARIHARAN_8K.mp3'
      ],
      mantras: [
        'Gayatri_Mantra_With_Meaning___11_Times___Chanting_By_Brahmins___Peaceful_Chants.mp3',
        'Om_Tryambakam_Yajamahe___Shiva_Maha_Mantra_For_Spiritual_Growth___Mahamrityunjaya_Mantra_11_Times.mp3'
      ]
    };
    
    return audioFiles[category] || [];
  } catch (err) {
    console.warn(`Could not load files for category ${category}:`, err);
    return [];
  }
}
