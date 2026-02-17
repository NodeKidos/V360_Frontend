import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import si from './locales/si.json';
import ta from './locales/ta.json';
import zh from './locales/zh.json';
import nl from './locales/nl.json';
import hi from './locales/hi.json';
import fr from './locales/fr.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            si: { translation: si },
            ta: { translation: ta },
            zh: { translation: zh },
            nl: { translation: nl },
            hi: { translation: hi },
            fr: { translation: fr },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
