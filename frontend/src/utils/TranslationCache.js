/**
 * TranslationCache - In-memory cache for translations
 * Reduces API calls by caching translations for repeated text
 */

class TranslationCache {
  constructor() {
    this.cache = {};
  }

  /**
   * Get a translation from cache
   * @param {string} text - Original text
   * @param {string} language - Target language code
   * @returns {string|null} - Cached translation or null if not found
   */
  get(text, language) {
    if (!this.cache[language]) {
      return null;
    }
    return this.cache[language][text] || null;
  }

  /**
   * Set a translation in cache
   * @param {string} text - Original text
   * @param {string} language - Target language code
   * @param {string} translation - Translated text
   */
  set(text, language, translation) {
    if (!this.cache[language]) {
      this.cache[language] = {};
    }
    this.cache[language][text] = translation;
  }

  /**
   * Check if a translation exists in cache
   * @param {string} text - Original text
   * @param {string} language - Target language code
   * @returns {boolean}
   */
  has(text, language) {
    return this.cache[language] && this.cache[language][text] !== undefined;
  }

  /**
   * Clear cache for a specific language
   * @param {string} language - Target language code
   */
  clearLanguage(language) {
    if (this.cache[language]) {
      delete this.cache[language];
    }
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache = {};
  }

  /**
   * Get cache size (number of cached translations)
   * @returns {number}
   */
  size() {
    let count = 0;
    Object.values(this.cache).forEach(lang => {
      count += Object.keys(lang).length;
    });
    return count;
  }
}

export default new TranslationCache();
