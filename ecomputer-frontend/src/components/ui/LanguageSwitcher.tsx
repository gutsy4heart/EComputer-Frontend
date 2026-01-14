'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export const LanguageSwitcher: React.FC = () => {
  const { i18n: i18nInstance } = useTranslation();
  const currentLanguage = i18nInstance?.language || 'en';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLanguageChange = (language: string) => {
    console.log('[LanguageSwitcher] Changing language to:', language);
    console.log('[LanguageSwitcher] Current language before change:', currentLanguage);
    
    try {
      if (i18nInstance && typeof i18nInstance.changeLanguage === 'function') {
        i18nInstance.changeLanguage(language);
        console.log('[LanguageSwitcher] Language changed successfully');
      } else {
        console.warn('[LanguageSwitcher] i18nInstance not available');
      }
    } catch (error) {
      console.error('[LanguageSwitcher] Error changing language:', error);
    }
    
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    console.log('[LanguageSwitcher] Toggling dropdown, current state:', isOpen);
    
    if (!isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 12rem = 192px
      const dropdownHeight = 120; // Примерная высота dropdown
      
      let right = window.innerWidth - buttonRect.right;
      let top = buttonRect.bottom + 8;
      
      // Проверяем, не выходит ли dropdown за правую границу экрана
      if (right < 0) {
        right = 16; // Отступ от правого края
      }
      
      // Проверяем, не выходит ли dropdown за нижнюю границу экрана
      if (top + dropdownHeight > window.innerHeight) {
        top = buttonRect.top - dropdownHeight - 8; // Показываем выше кнопки
      }
      
      setDropdownPosition({ top, right });
    }
    
    setIsOpen(!isOpen);
  };

  // Закрытие выпадающего меню при клике вне его и обработка изменения размера окна
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideButton = buttonRef.current?.contains(target);
      const isClickInsideDropdown = dropdownRef.current?.contains(target);
      
      if (!isClickInsideButton && !isClickInsideDropdown) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 192; // w-48 = 12rem = 192px
        const dropdownHeight = 120; // Примерная высота dropdown
        
        let right = window.innerWidth - buttonRect.right;
        let top = buttonRect.bottom + 8;
        
        // Проверяем, не выходит ли dropdown за правую границу экрана
        if (right < 0) {
          right = 16; // Отступ от правого края
        }
        
        // Проверяем, не выходит ли dropdown за нижнюю границу экрана
        if (top + dropdownHeight > window.innerHeight) {
          top = buttonRect.top - dropdownHeight - 8; // Показываем выше кнопки
        }
        
        setDropdownPosition({ top, right });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  // Debug current language
  console.log('[LanguageSwitcher] Current language:', currentLanguage);
  console.log('[LanguageSwitcher] Current lang object:', currentLang);

    return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-white/80 hover:text-purple-300 transition-all duration-300 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
          <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu rendered via Portal to body */}
      {isOpen && isMounted && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-48 bg-gradient-to-br from-slate-950 to-purple-950 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-300 hover:bg-white/10 ${
                  currentLanguage === language.code
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <svg className="w-4 h-4 ml-auto text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
 };

export default LanguageSwitcher; 