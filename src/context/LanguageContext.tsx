'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/constants/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('uk');

    useEffect(() => {
        // Prevent setting state synchronously during initial render if not needed, 
        // or just initialize state carefully.
        const saved = localStorage.getItem('language') as Language;
        if (saved && translations[saved] && saved !== 'uk') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        const langObj = translations[language] as Record<string, string>;
        const fallbackObj = translations['uk'] as Record<string, string>;
        return langObj[key] || fallbackObj[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
