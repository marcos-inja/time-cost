import type { PriceParser, PriceMatch } from "./types";
import { CURRENCY_CONFIGS } from "@/i18n/currencies";

/**
 * Shared normalization logic for all currencies.
 * Handles both BRL (1.199,50) and US (5,399.00) number formats.
 *
 * Rules:
 * - Both dot and comma present → last separator is decimal
 * - Multiple dots → all are thousands separators
 * - Multiple commas → all are thousands separators
 * - Single dot followed by 3 digits → thousands separator
 * - Single comma followed by 3 digits → thousands separator
 * - Otherwise single separator → decimal
 */
function normalizePrice(raw: string, symbolPattern: RegExp): number {
  let num = raw.replace(symbolPattern, "").trim();
  if (!num) return 0;

  const dots = num.split(".").length - 1;
  const commas = num.split(",").length - 1;

  if (dots > 0 && commas > 0) {
    const lastDot = num.lastIndexOf(".");
    const lastComma = num.lastIndexOf(",");

    if (lastComma > lastDot) {
      num = num.replace(/\./g, "").replace(",", ".");
    } else {
      num = num.replace(/,/g, "");
    }
  } else if (dots > 1) {
    num = num.replace(/\./g, "");
  } else if (commas > 1) {
    num = num.replace(/,/g, "");
  } else if (dots === 1) {
    const afterDot = num.split(".")[1];
    if (afterDot.length === 3) {
      num = num.replace(".", "");
    }
  } else if (commas === 1) {
    const afterComma = num.split(",")[1];
    if (afterComma.length === 3) {
      num = num.replace(",", "");
    } else {
      num = num.replace(",", ".");
    }
  }

  return parseFloat(num) || 0;
}

function createDetect(regex: RegExp, normalize: (raw: string) => number) {
  return (text: string): PriceMatch[] => {
    const normalized = text.replace(/\s+/g, " ").trim();
    const matches: PriceMatch[] = [];
    const re = new RegExp(regex.source, regex.flags);
    let match: RegExpExecArray | null;

    while ((match = re.exec(normalized)) !== null) {
      matches.push({
        raw: match[0],
        value: normalize(match[0]),
        index: match.index,
      });
    }

    return matches;
  };
}

export class BrlPriceParser implements PriceParser {
  readonly currencySymbol = CURRENCY_CONFIGS.BRL.symbol;
  readonly priceRegex = CURRENCY_CONFIGS.BRL.priceRegex;

  detect = createDetect(this.priceRegex, this.normalize.bind(this));

  normalize(raw: string): number {
    return normalizePrice(raw, /R\$\s*/);
  }
}

export class UsdPriceParser implements PriceParser {
  readonly currencySymbol = CURRENCY_CONFIGS.USD.symbol;
  readonly priceRegex = CURRENCY_CONFIGS.USD.priceRegex;

  detect = createDetect(this.priceRegex, this.normalize.bind(this));

  normalize(raw: string): number {
    return normalizePrice(raw, /(?:US)?\$\s*/);
  }
}

export class EurPriceParser implements PriceParser {
  readonly currencySymbol = CURRENCY_CONFIGS.EUR.symbol;
  readonly priceRegex = CURRENCY_CONFIGS.EUR.priceRegex;

  detect = createDetect(this.priceRegex, this.normalize.bind(this));

  normalize(raw: string): number {
    return normalizePrice(raw, /€\s*/);
  }
}

export class GbpPriceParser implements PriceParser {
  readonly currencySymbol = CURRENCY_CONFIGS.GBP.symbol;
  readonly priceRegex = CURRENCY_CONFIGS.GBP.priceRegex;

  detect = createDetect(this.priceRegex, this.normalize.bind(this));

  normalize(raw: string): number {
    return normalizePrice(raw, /£\s*/);
  }
}

export class PriceParserFactory {
  private static parsers: Map<string, PriceParser> = new Map([
    ["BRL", new BrlPriceParser()],
    ["USD", new UsdPriceParser()],
    ["EUR", new EurPriceParser()],
    ["GBP", new GbpPriceParser()],
  ]);

  static getParser(currency: string): PriceParser {
    const parser = this.parsers.get(currency);
    if (!parser) {
      throw new Error(`No parser available for currency: ${currency}`);
    }
    return parser;
  }

  static getDefault(currency?: string): PriceParser {
    return this.getParser(currency ?? "BRL");
  }
}
