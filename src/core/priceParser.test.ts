import { describe, it, expect } from "vitest";
import {
  BrlPriceParser,
  UsdPriceParser,
  EurPriceParser,
  GbpPriceParser,
  PriceParserFactory,
} from "./priceParser";

describe("BrlPriceParser", () => {
  const parser = new BrlPriceParser();

  describe("normalize", () => {
    it("should parse simple price", () => {
      expect(parser.normalize("R$ 100")).toBe(100);
    });

    it("should parse price with cents", () => {
      expect(parser.normalize("R$ 99,90")).toBe(99.9);
    });

    it("should parse price with thousands separator", () => {
      expect(parser.normalize("R$ 1.299,90")).toBe(1299.9);
    });

    it("should parse price with multiple thousands separators", () => {
      expect(parser.normalize("R$ 12.999,90")).toBe(12999.9);
    });

    it("should parse price without space after R$", () => {
      expect(parser.normalize("R$50")).toBe(50);
    });

    it("should parse price with no cents", () => {
      expect(parser.normalize("R$ 1.500")).toBe(1500);
    });

    it("should return 0 for invalid input", () => {
      expect(parser.normalize("R$ ")).toBe(0);
    });

    // US format (comma=thousands, dot=decimal)
    it("should parse US format with thousands and cents", () => {
      expect(parser.normalize("R$5,399.00")).toBe(5399);
    });

    it("should parse US format without thousands", () => {
      expect(parser.normalize("R$955.88")).toBe(955.88);
    });

    it("should parse US format large number", () => {
      expect(parser.normalize("R$1,327.00")).toBe(1327);
    });

    it("should parse US format with single cent digit implied", () => {
      expect(parser.normalize("R$4,699.90")).toBe(4699.9);
    });

    // Numbers without any thousands separator
    it("should parse number without separators", () => {
      expect(parser.normalize("R$1199")).toBe(1199);
    });

    it("should parse number without thousands but with BRL decimal", () => {
      expect(parser.normalize("R$1199,50")).toBe(1199.5);
    });

    it("should parse number without thousands but with US decimal", () => {
      expect(parser.normalize("R$1199.50")).toBe(1199.5);
    });

    // Multiple thousands separators
    it("should parse multiple dot thousands (BRL)", () => {
      expect(parser.normalize("R$1.000.000")).toBe(1000000);
    });

    it("should parse multiple comma thousands (US)", () => {
      expect(parser.normalize("R$1,000,000")).toBe(1000000);
    });
  });

  describe("detect", () => {
    it("should find a single price in text", () => {
      const matches = parser.detect("O produto custa R$ 199,90 com frete grátis");
      expect(matches).toHaveLength(1);
      expect(matches[0].raw).toBe("R$ 199,90");
      expect(matches[0].value).toBe(199.9);
    });

    it("should find multiple prices in text", () => {
      const matches = parser.detect("De R$ 299,90 por R$ 199,90");
      expect(matches).toHaveLength(2);
      expect(matches[0].value).toBe(299.9);
      expect(matches[1].value).toBe(199.9);
    });

    it("should handle price with thousands", () => {
      const matches = parser.detect("Notebook R$ 4.599,00");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(4599);
    });

    it("should handle price without space", () => {
      const matches = parser.detect("R$50,00");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(50);
    });

    it("should handle price without cents", () => {
      const matches = parser.detect("R$ 1.500");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(1500);
    });

    it("should return empty array for text without prices", () => {
      const matches = parser.detect("Nenhum preço aqui");
      expect(matches).toHaveLength(0);
    });

    it("should return correct index", () => {
      const matches = parser.detect("Preço: R$ 100,00");
      expect(matches[0].index).toBe(7);
    });

    it("should handle concatenated textContent from split spans (no space)", () => {
      const matches = parser.detect("R$4.499");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(4499);
    });

    it("should handle concatenated textContent with cents (no space)", () => {
      const matches = parser.detect("R$309,78");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(309.78);
    });

    it("should detect price with multiple spaces or newlines (Mercado Livre)", () => {
      expect(parser.detect("Frete a partir de R$  19,00").length).toBeGreaterThanOrEqual(1);
      expect(parser.detect("R$ \n 9,90 por mês").length).toBeGreaterThanOrEqual(1);
    });

    it("should detect element textContent from split spans (Mercado Livre style)", () => {
      const combined = "R$2.788";
      const matches = parser.detect(combined);
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(2788);
    });

    it("should detect split price with decimals (e.g. 10x R$ 309,78)", () => {
      const combined = "10x R$ 309,78 sem juros";
      const matches = parser.detect(combined);
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(309.78);
    });

    // US format detection
    it("should detect US format price (comma thousands, dot decimal)", () => {
      const matches = parser.detect("R$5,399.00");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(5399);
    });

    it("should detect US format price without thousands", () => {
      const matches = parser.detect("R$955.88");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(955.88);
    });

    it("should detect price without any separator (4+ digits)", () => {
      const matches = parser.detect("R$1199");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(1199);
    });

    it("should detect US format in Google Shopping style text", () => {
      const matches = parser.detect("R$4,699.90 no Google Shopping");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(4699.9);
    });
  });
});

describe("UsdPriceParser", () => {
  const parser = new UsdPriceParser();

  describe("normalize", () => {
    it("should parse $1,299.90", () => {
      expect(parser.normalize("$1,299.90")).toBe(1299.9);
    });

    it("should parse US$5,399.00", () => {
      expect(parser.normalize("US$5,399.00")).toBe(5399);
    });

    it("should parse $199.90", () => {
      expect(parser.normalize("$199.90")).toBe(199.9);
    });

    it("should parse $1199", () => {
      expect(parser.normalize("$1199")).toBe(1199);
    });
  });

  describe("detect", () => {
    it("should find USD price in text", () => {
      const matches = parser.detect("The price is $1,299.90 with shipping");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(1299.9);
    });

    it("should find US$ format", () => {
      const matches = parser.detect("US$5,399.00");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(5399);
    });

    it("should NOT match R$ (BRL)", () => {
      const matches = parser.detect("R$1,299.90");
      expect(matches).toHaveLength(0);
    });
  });
});

describe("EurPriceParser", () => {
  const parser = new EurPriceParser();

  describe("normalize", () => {
    it("should parse €1.299,90", () => {
      expect(parser.normalize("€1.299,90")).toBe(1299.9);
    });

    it("should parse €199.90", () => {
      expect(parser.normalize("€199.90")).toBe(199.9);
    });

    it("should parse 1.299,90€ (suffix)", () => {
      expect(parser.normalize("1.299,90€")).toBe(1299.9);
    });
  });

  describe("detect", () => {
    it("should find EUR price with prefix symbol", () => {
      const matches = parser.detect("Price: €1.299,90");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(1299.9);
    });

    it("should find EUR price with suffix symbol", () => {
      const matches = parser.detect("Price: 1.299,90€");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(1299.9);
    });
  });
});

describe("GbpPriceParser", () => {
  const parser = new GbpPriceParser();

  describe("normalize", () => {
    it("should parse £1,299.90", () => {
      expect(parser.normalize("£1,299.90")).toBe(1299.9);
    });

    it("should parse £199.90", () => {
      expect(parser.normalize("£199.90")).toBe(199.9);
    });
  });

  describe("detect", () => {
    it("should find GBP price in text", () => {
      const matches = parser.detect("Price: £1,299.90");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(1299.9);
    });

    it("should find price without thousands separator", () => {
      const matches = parser.detect("£199.90");
      expect(matches).toHaveLength(1);
      expect(matches[0].value).toBe(199.9);
    });
  });
});

describe("PriceParserFactory", () => {
  it("should return BRL parser by default", () => {
    const parser = PriceParserFactory.getDefault();
    expect(parser.currencySymbol).toBe("R$");
  });

  it("should return BRL parser when requested", () => {
    const parser = PriceParserFactory.getParser("BRL");
    expect(parser.currencySymbol).toBe("R$");
  });

  it("should return USD parser when requested", () => {
    const parser = PriceParserFactory.getDefault("USD");
    expect(parser.currencySymbol).toBe("$");
  });

  it("should return EUR parser when requested", () => {
    const parser = PriceParserFactory.getDefault("EUR");
    expect(parser.currencySymbol).toBe("€");
  });

  it("should return GBP parser when requested", () => {
    const parser = PriceParserFactory.getDefault("GBP");
    expect(parser.currencySymbol).toBe("£");
  });

  it("should throw for unknown currency", () => {
    expect(() => PriceParserFactory.getParser("XYZ")).toThrow();
  });
});
