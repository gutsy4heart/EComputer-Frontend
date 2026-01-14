'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  useEffect(() => {
    
    if (typeof window !== 'undefined') {
  
      console.log('[I18nProvider] i18n initialized on client');
    }
  }, []);


  if (!i18n || !i18n.isInitialized) {
    console.warn('[I18nProvider] i18n not initialized, rendering without provider');
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};
