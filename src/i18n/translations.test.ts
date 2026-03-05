import { describe, it, expect } from "vitest";
import { translations, type TranslationKeys } from "./translations";
import { getTranslation, getSupportedLanguages, getSupportedCurrencies } from "./index";

/**
 * Testes de integridade do módulo i18n.
 * Garante que todas as traduções estão completas e que os helpers funcionam.
 */

describe("translations", () => {
  const referenceKeys = Object.keys(translations["pt-BR"]) as (keyof TranslationKeys)[];

  it("should have pt-BR, en, and es locales", () => {
    expect(translations["pt-BR"]).toBeDefined();
    expect(translations["en"]).toBeDefined();
    expect(translations["es"]).toBeDefined();
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
  it("should return 3 languages", () => {
    const langs = getSupportedLanguages();
    expect(langs).toHaveLength(3);
    expect(langs.map((l) => l.code)).toEqual(["pt-BR", "en", "es"]);
  });
});

describe("getSupportedCurrencies", () => {
  it("should return 4 currencies", () => {
    const currencies = getSupportedCurrencies();
    expect(currencies).toHaveLength(4);
    expect(currencies.map((c) => c.code)).toEqual(["BRL", "USD", "EUR", "GBP"]);
  });
});
