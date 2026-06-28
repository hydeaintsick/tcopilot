"use client";

import * as React from "react";
import {
  DEFAULT_LANGUAGE,
  resolveLanguage,
  translations,
  type Dictionary,
  type Language,
} from "@/lib/i18n";

const STORAGE_KEY = "tcopilot-lang";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Language>(DEFAULT_LANGUAGE);

  React.useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    const initial = stored
      ? resolveLanguage(stored)
      : resolveLanguage(
          typeof navigator !== "undefined" ? navigator.language : undefined
        );
    setLangState(initial);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = translations[lang].htmlLang;
  }, [lang]);

  const setLang = React.useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage indisponible (mode privé, etc.) : on ignore.
    }
  }, []);

  const value = React.useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage doit être utilisé dans un LanguageProvider");
  }
  return ctx;
}
