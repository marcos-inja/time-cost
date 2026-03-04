import type { PriceParser, PriceMatch } from "./types";
import { PRICE_REGEX } from "@/content/constants";

export class BrlPriceParser implements PriceParser {
  readonly currencySymbol = "R$";

  detect(text: string): PriceMatch[] {
    const normalized = text.replace(/\s+/g, " ").trim();
    const matches: PriceMatch[] = [];
    const regex = new RegExp(PRICE_REGEX.source, "g");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(normalized)) !== null) {
      matches.push({
        raw: match[0],
        value: this.normalize(match[0]),
        index: match.index,
      });
    }

    return matches;
  }

  /**
   * Smart normalization that handles both BRL (1.199,50) and US (5,399.00) formats.
   *
   * Rules:
   * - Both dot and comma present → last separator is decimal
   * - Multiple dots → all are thousands separators
   * - Multiple commas → all are thousands separators
   * - Single dot followed by 3 digits → thousands separator
   * - Single comma followed by 3 digits → thousands separator
   * - Otherwise single separator → decimal
   */
  normalize(raw: string): number {
    let num = raw.replace(/R\$\s*/, "").trim();
    if (!num) return 0;

    const dots = num.split(".").length - 1;
    const commas = num.split(",").length - 1;

    if (dots > 0 && commas > 0) {
      // Both separators: last one is the decimal separator
      const lastDot = num.lastIndexOf(".");
      const lastComma = num.lastIndexOf(",");

      if (lastComma > lastDot) {
        // Comma is decimal: "1.199,50"
        num = num.replace(/\./g, "").replace(",", ".");
      } else {
        // Dot is decimal: "5,399.00"
        num = num.replace(/,/g, "");
      }
    } else if (dots > 1) {
      // Multiple dots: all are thousands "1.000.000"
      num = num.replace(/\./g, "");
    } else if (commas > 1) {
      // Multiple commas: all are thousands "1,000,000"
      num = num.replace(/,/g, "");
    } else if (dots === 1) {
      // Single dot: 3 digits after → thousands; otherwise → decimal
      const afterDot = num.split(".")[1];
      if (afterDot.length === 3) {
        num = num.replace(".", "");
      }
      // else: already in parseFloat format (e.g. "955.88")
    } else if (commas === 1) {
      // Single comma: 3 digits after → thousands; otherwise → decimal
      const afterComma = num.split(",")[1];
      if (afterComma.length === 3) {
        num = num.replace(",", "");
      } else {
        num = num.replace(",", ".");
      }
    }

    return parseFloat(num) || 0;
  }
}

export class PriceParserFactory {
  private static parsers: Map<string, PriceParser> = new Map([
    ["BRL", new BrlPriceParser()],
  ]);

  static getParser(currency: string): PriceParser {
    const parser = this.parsers.get(currency);
    if (!parser) {
      throw new Error(`No parser available for currency: ${currency}`);
    }
    return parser;
  }

  static getDefault(): PriceParser {
    return this.getParser("BRL");
  }
}
