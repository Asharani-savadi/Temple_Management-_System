// Translation service - uses Google Translate API with static fallback

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;

// Static fallback translations (used when API is unavailable)
const translations = {
  en: {
    'home': 'Home', 'about': 'About', 'booking': 'Booking',
    'services': 'Services', 'gallery': 'Gallery', 'contact': 'Contact',
    'admin': 'Admin', 'welcome': 'Welcome', 'loading': 'Loading...',
  },
  kn: {
    'home': 'ಮನೆ', 'about': 'ಬಗ್ಗೆ', 'booking': 'ಬುಕಿಂಗ್',
    'services': 'ಸೇವೆಗಳು', 'gallery': 'ಗ್ಯಾಲರಿ', 'contact': 'ಸಂಪರ್ಕ',
    'admin': 'ನಿರ್ವಾಹಕ', 'welcome': 'ಸ್ವಾಗತ', 'loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
  },
  hi: {
    'home': 'होम', 'about': 'परिचय', 'booking': 'बुकिंग',
    'services': 'सेवाएं', 'gallery': 'गैलरी', 'contact': 'संपर्क',
    'admin': 'प्रशासक', 'welcome': 'स्वागत है', 'loading': 'लोड हो रहा है...',
  }
};

// In-memory cache to avoid repeated API calls
const translationCache = {};

/**
 * Translate text using Google Translate API.
 * Falls back to static dictionary or original text if API is unavailable.
 */
export const translateText = async (text, targetLanguage) => {
  if (!text || targetLanguage === 'en') return text;

  const cacheKey = `${targetLanguage}:${text}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  if (!GOOGLE_API_KEY) {
    console.warn('REACT_APP_GOOGLE_TRANSLATE_API_KEY is not set. Using static translations.');
    return translations[targetLanguage]?.[text] || text;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target: targetLanguage, source: 'en' })
    });

    if (!response.ok) throw new Error(`Google API error: ${response.status}`);

    const data = await response.json();
    const translated = data.data.translations[0].translatedText;

    // Cache the result
    translationCache[cacheKey] = translated;
    return translated;
  } catch (error) {
    console.error('Google Translate API failed:', error.message);
    // Fallback to static dictionary
    return translations[targetLanguage]?.[text] || text;
  }
};

// Simple synchronous key-based lookup (for static UI strings)
export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations['en']?.[key] || key;
};

export const getCurrentLanguage = () => {
  return localStorage.getItem('preferredLanguage') || 'en';
};

export const setCurrentLanguage = (language) => {
  localStorage.setItem('preferredLanguage', language);
};

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];
