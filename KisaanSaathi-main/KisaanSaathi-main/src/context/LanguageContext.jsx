import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
 const [lang, setLang] = useState(LANGUAGES[0]); // default English

 useEffect(() => {
 const saved = localStorage.getItem('krishi_lang');
 if (saved) {
 const match = LANGUAGES.find(l => l.code === saved);
 if (match) setLang(match);
 }
 }, []);

 const changeLanguage = (newLang) => {
 setLang(newLang);
 localStorage.setItem('krishi_lang', newLang.code);
 };

 // Translation helper function
 const t = (key) => {
 const currentDict = TRANSLATIONS[lang.code] || TRANSLATIONS["en-IN"];
 return currentDict[key] || TRANSLATIONS["en-IN"][key] || key;
 };

 return (
 <LanguageContext.Provider value={{
 lang,
 setLang: changeLanguage,
 t,
 languages: LANGUAGES
 }}>
 {children}
 </LanguageContext.Provider>
 );
}

export function useLanguage() {
 return useContext(LanguageContext);
}
