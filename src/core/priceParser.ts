import type { PriceParser, PriceMatch } from "./types";

/** BRL: R$ opcionalmente seguido de espaços/newlines, número com . milhares e , decimais (opcional). */
const BRL_REGEX = /R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g;

export class BrlPriceParser implements PriceParser {
  readonly currencySymbol = "R$";

  detect(text: string): PriceMatch[] {
    const normalized = text.replace(/\s+/g, " ").trim();
    const matches: PriceMatch[] = [];
    let match: RegExpExecArray | null;

    BRL_REGEX.lastIndex = 0;
    while ((match = BRL_REGEX.exec(normalized)) !== null) {
      matches.push({
        raw: match[0],
        value: this.normalize(match[0]),
        index: match.index,
      });
    }

    return matches;
  }

  normalize(raw: string): number {
    const cleaned = raw
      .replace(/R\$\s*/, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(cleaned) || 0;
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
