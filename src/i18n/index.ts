import { translations, type TranslationKeys } from "./translations";
import { CURRENCY_CONFIGS, type CurrencyConfig } from "./currencies";

const DEFAULT_LANG = "pt-BR";
const DEFAULT_CURRENCY = "BRL";

export function getTranslation(lang?: string): TranslationKeys {
  return translations[lang ?? DEFAULT_LANG] ?? translations[DEFAULT_LANG];
}

export function getCurrencyConfig(code?: string): CurrencyConfig {
  return CURRENCY_CONFIGS[code ?? DEFAULT_CURRENCY] ?? CURRENCY_CONFIGS[DEFAULT_CURRENCY];
}

export interface SupportedLanguage {
  code: string;
  label: string;
  flag: string;
  abbr: string;
}

export function getSupportedLanguages(): SupportedLanguage[] {
  return [
    { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷", abbr: "PT" },
    { code: "en", label: "English", flag: "🇺🇸", abbr: "EN" },
    { code: "es", label: "Español", flag: "🇪🇸", abbr: "ES" },
    { code: "fr", label: "Français", flag: "🇫🇷", abbr: "FR" },
    { code: "de", label: "Deutsch", flag: "🇩🇪", abbr: "DE" },
    { code: "it", label: "Italiano", flag: "🇮🇹", abbr: "IT" },
    { code: "ja", label: "日本語", flag: "🇯🇵", abbr: "JA" },
    { code: "ko", label: "한국어", flag: "🇰🇷", abbr: "KO" },
    { code: "zh-CN", label: "中文", flag: "🇨🇳", abbr: "ZH" },
    { code: "ru", label: "Русский", flag: "🇷🇺", abbr: "RU" },
    { code: "ar", label: "العربية", flag: "🇸🇦", abbr: "AR" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳", abbr: "HI" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷", abbr: "TR" },
  ];
}

export function getSupportedCurrencies(): { code: string; label: string }[] {
  return Object.values(CURRENCY_CONFIGS).map((c) => ({
    code: c.code,
    label: c.label,
  }));
}

export type { TranslationKeys, CurrencyConfig };
