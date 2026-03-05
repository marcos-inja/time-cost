export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  locale: string;
  priceRegex: RegExp;
}

const PRICE_NUMBER = String.raw`(?:\d{4,}(?:[.,]\d{1,2})?|\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)`;

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  BRL: {
    code: "BRL",
    symbol: "R$",
    label: "BRL (R$)",
    locale: "pt-BR",
    priceRegex: new RegExp(String.raw`R\$\s*${PRICE_NUMBER}`, "g"),
  },

  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    locale: "en-US",
    // Negative lookbehind to avoid matching R$, A$, C$, etc.
    priceRegex: new RegExp(String.raw`(?<![A-Za-z])(?:US)?\$\s*${PRICE_NUMBER}`, "g"),
  },

  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    locale: "de-DE",
    // Euro sign can appear before or after the number
    priceRegex: new RegExp(
      String.raw`(?:€\s*${PRICE_NUMBER}|${PRICE_NUMBER}\s*€)`,
      "g"
    ),
  },

  GBP: {
    code: "GBP",
    symbol: "£",
    label: "GBP (£)",
    locale: "en-GB",
    priceRegex: new RegExp(String.raw`£\s*${PRICE_NUMBER}`, "g"),
  },
};
