import { describe, it, expect } from "vitest";
import { translations, type TranslationKeys } from "./translations";
import { getTranslation, getSupportedLanguages, getSupportedCurrencies } from "./index";

/**
 * Testes de integridade do módulo i18n.
 * Garante que todas as traduções estão completas e que os helpers funcionam.
 */

describe("translations", () => {
  const referenceKeys = Object.keys(translations["pt-BR"]) as (keyof TranslationKeys)[];

  it("should have all expected locales", () => {
    const expected = ["pt-BR", "en", "es", "fr", "de", "it", "ja", "ko", "zh-CN", "ru", "ar", "hi", "tr"];
    for (const locale of expected) {
      expect(translations[locale], `Missing locale "${locale}"`).toBeDefined();
    }
  });

  for (const locale of Object.keys(translations)) {
    describe(`${locale} locale`, () => {
      it("should have all translation keys", () => {
        for (const key of referenceKeys) {
          expect(translations[locale][key], `Missing key "${key}" in ${locale}`).toBeDefined();
          expect(typeof translations[locale][key]).toBe("string");
          expect(translations[locale][key].length).toBeGreaterThan(0);
        }
      });
    });
  }
});

describe("getTranslation", () => {
  it("should return pt-BR for undefined language", () => {
    const t = getTranslation(undefined);
    expect(t.save).toBe("Salvar");
  });

  it("should return en translations", () => {
    const t = getTranslation("en");
    expect(t.save).toBe("Save");
  });

  it("should return es translations", () => {
    const t = getTranslation("es");
    expect(t.save).toBe("Guardar");
  });

  it("should fallback to pt-BR for unknown language", () => {
    const t = getTranslation("xyz");
    expect(t.save).toBe("Salvar");
  });
});

describe("getSupportedLanguages", () => {
  it("should return 13 languages", () => {
    const langs = getSupportedLanguages();
    expect(langs).toHaveLength(13);
    expect(langs.map((l) => l.code)).toEqual([
      "pt-BR", "en", "es", "fr", "de", "it", "ja", "ko", "zh-CN", "ru", "ar", "hi", "tr",
    ]);
  });

  it("should have flag and abbr for each language", () => {
    const langs = getSupportedLanguages();
    for (const lang of langs) {
      expect(lang.flag.length, `Missing flag for ${lang.code}`).toBeGreaterThan(0);
      expect(lang.abbr.length, `Missing abbr for ${lang.code}`).toBeGreaterThan(0);
    }
  });
});

describe("getSupportedCurrencies", () => {
  it("should return 14 currencies", () => {
    const currencies = getSupportedCurrencies();
    expect(currencies).toHaveLength(14);
    expect(currencies.map((c) => c.code)).toEqual([
      "BRL", "USD", "EUR", "GBP", "JPY", "CNY", "KRW", "INR", "CAD", "AUD", "CHF", "MXN", "ARS", "TRY",
    ]);
  });
});
