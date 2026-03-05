import { describe, it, expect } from "vitest";
import { PRICE_REGEX, SKIP_TAGS, BADGE_ATTR, BADGE_CLASS } from "./constants";

/**
 * Testes das constantes do content script.
 * Servem como documentação viva e guard contra mudanças acidentais
 * no regex de preço e nas tags ignoradas.
 */

describe("PRICE_REGEX", () => {
  function matchAll(text: string): string[] {
    const regex = new RegExp(PRICE_REGEX.source, "g");
    const matches: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) matches.push(m[0]);
    return matches;
  }

  it("should match BRL format with thousands and cents (R$ 1.299,90)", () => {
    expect(matchAll("R$ 1.299,90")).toEqual(["R$ 1.299,90"]);
  });

  it("should match US format with comma thousands and dot decimal (R$5,399.00)", () => {
    expect(matchAll("R$5,399.00")).toEqual(["R$5,399.00"]);
  });

  it("should match 4+ digit number without separators (R$1199)", () => {
    expect(matchAll("R$1199")).toEqual(["R$1199"]);
  });

  it("should match large number with multiple thousands (R$ 1.000.000)", () => {
    expect(matchAll("R$ 1.000.000")).toEqual(["R$ 1.000.000"]);
  });

  it("should match US decimal format (R$199.90)", () => {
    expect(matchAll("R$199.90")).toEqual(["R$199.90"]);
  });

  it("should match price with space after R$", () => {
    expect(matchAll("R$ 4.599,00")).toEqual(["R$ 4.599,00"]);
  });

  it("should NOT match bare numbers without R$", () => {
    expect(matchAll("1.299,90")).toEqual([]);
  });

  it("should NOT match USD format ($ 100)", () => {
    expect(matchAll("$ 100")).toEqual([]);
  });
});

describe("SKIP_TAGS", () => {
  it("should contain all expected tags", () => {
    const expected = ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "SVG", "PATH"];
    for (const tag of expected) {
      expect(SKIP_TAGS.has(tag)).toBe(true);
    }
  });

  it("should have exactly 6 entries", () => {
    expect(SKIP_TAGS.size).toBe(6);
  });
});

describe("BADGE_ATTR", () => {
  it("should equal 'data-pil-done'", () => {
    expect(BADGE_ATTR).toBe("data-pil-done");
  });
});

describe("BADGE_CLASS", () => {
  it("should equal 'pil-badge'", () => {
    expect(BADGE_CLASS).toBe("pil-badge");
  });
});
