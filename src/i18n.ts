import i18nModule from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import myTranslation from './locales/my/translation.json';

const isDev = import.meta.env.DEV;

const resources = {
  en: {
    translation: enTranslation,
  },
  my: {
    translation: myTranslation,
  },
};

const i18n = i18nModule as any;

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: isDev,
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;