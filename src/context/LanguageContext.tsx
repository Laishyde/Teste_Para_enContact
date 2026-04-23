import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface LanguageContextType {
  language: 'pt' | 'en' | 'es';
  setLanguage: (lang: 'pt' | 'en' | 'es') => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>(() => {
    // Prioridade: localStorage > appState > padrão 'pt'
    // Evitar condição de corrida com autoTranslator
    const stored = localStorage.getItem('language');
    if (stored && ['pt', 'en', 'es'].includes(stored)) {
      console.log(`LanguageContext: Inicializando com localStorage language: ${stored}`);
      return stored as 'pt' | 'en' | 'es';
    }
    
    const appState = localStorage.getItem('appState');
    if (appState) {
      try {
        const parsed = JSON.parse(appState);
        if (parsed.language && ['pt', 'en', 'es'].includes(parsed.language)) {
          console.log(`LanguageContext: Inicializando com appState language: ${parsed.language}`);
          return parsed.language;
        }
      } catch {
        // Ignorar erro e continuar
      }
    }
    
    console.log('LanguageContext: Inicializando com padrão pt');
    return 'pt';
  });

  const handleSetLanguage = useCallback((lang: 'pt' | 'en' | 'es') => {
    if (lang === language) return; // Evitar operações duplicadas
    
    console.log(`LanguageContext: Mudando idioma para ${lang}`);
    setLanguage(lang);
    
    // Sincronizar com localStorage (backup)
    localStorage.setItem('language', lang);
    
    // Sincronizar com appState
    const appState = localStorage.getItem('appState');
    if (appState) {
      try {
        const parsed = JSON.parse(appState);
        parsed.language = lang;
        localStorage.setItem('appState', JSON.stringify(parsed));
        // Notificar AppContext
        window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
      } catch (error) {
        console.error('Erro ao sincronizar appState:', error);
      }
    }
    
    // Sincronizar com autoTranslator
    if (typeof window !== 'undefined' && window.autoTranslator) {
      window.autoTranslator.setLanguage(lang);
    }
  }, [language]);

  useEffect(() => {
    // Sincronizar com autoTranslator quando montar ou quando language mudar
    if (typeof window !== 'undefined' && window.autoTranslator) {
      const currentLang = window.autoTranslator.getCurrentLanguage();
      if (currentLang !== language) {
        console.log(`Sincronizando LanguageContext (${language}) com autoTranslator (${currentLang})`);
        window.autoTranslator.setLanguage(language);
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Add autoTranslator to window object
declare global {
  interface Window {
    autoTranslator?: any;
  }
}
