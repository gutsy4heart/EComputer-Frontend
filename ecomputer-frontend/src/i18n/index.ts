import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Проверяем, что мы в браузере
const isClient = typeof window !== 'undefined';

if (isClient && !i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ru: { translation: ru },
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => {
      console.log('[i18n] Initialized successfully');
    })
    .catch((error) => {
      console.error('[i18n] Initialization error:', error);
    });
}

export default i18n; 