import React, { useState, useEffect } from 'react';
import { FaGlobe } from 'react-icons/fa';
import './LanguageSelector.css';

function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
  ];

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
    setIsOpen(false);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: languageCode } }));
  };

  const currentLangName = languages.find(lang => lang.code === currentLanguage)?.nativeName || 'English';

  return (
    <div className="language-selector">
      <button 
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language"
      >
        <FaGlobe />
        <span className="language-code">{currentLanguage.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="lang-native">{lang.nativeName}</span>
              <span className="lang-english">({lang.name})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
