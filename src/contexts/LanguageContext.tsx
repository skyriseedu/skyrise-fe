import { useState, type ReactNode } from 'react';
import { LanguageContext } from './LanguageContextInstance';
import i18n from '../i18n';

export type Language = 'En' | 'Mm';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Sync initial state with i18n.language
  const initialLang = i18n.language === 'my' ? 'Mm' : 'En';
  const [language, setLanguage] = useState<Language>(initialLang);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
export { LanguageContext };
