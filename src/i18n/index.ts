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

export function getSupportedLanguages(): { code: string; label: string }[] {
  return [
    { code: "pt-BR", label: "Português (BR)" },
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];
}

export function getSupportedCurrencies(): { code: string; label: string }[] {
  return Object.values(CURRENCY_CONFIGS).map((c) => ({
    code: c.code,
    label: c.label,
  }));
}

export type { TranslationKeys, CurrencyConfig };
