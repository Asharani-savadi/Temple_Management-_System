import { useState, useEffect, useCallback } from 'react';
import { getTranslation, translateText, getCurrentLanguage } from '../utils/translationService';

export const useTranslation = () => {
  const [language, setLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail.language);
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  // t() - synchronous, uses static dictionary (for nav links, buttons, etc.)
  const t = useCallback((key) => {
    return getTranslation(key, language);
  }, [language]);

  // translate() - async, calls Google Translate API for dynamic content
  const translate = useCallback(async (text) => {
    return await translateText(text, language);
  }, [language]);

  return { t, translate, language };
};
