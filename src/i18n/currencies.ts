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

  JPY: {
    code: "JPY",
    symbol: "¥",
    label: "JPY (¥)",
    locale: "ja-JP",
    priceRegex: new RegExp(String.raw`(?:¥|￥)\s*${PRICE_NUMBER}`, "g"),
  },

  CNY: {
    code: "CNY",
    symbol: "¥",
    label: "CNY (¥)",
    locale: "zh-CN",
    priceRegex: new RegExp(String.raw`(?:¥|￥)\s*${PRICE_NUMBER}`, "g"),
  },

  KRW: {
    code: "KRW",
    symbol: "₩",
    label: "KRW (₩)",
    locale: "ko-KR",
    priceRegex: new RegExp(String.raw`₩\s*${PRICE_NUMBER}`, "g"),
  },

  INR: {
    code: "INR",
    symbol: "₹",
    label: "INR (₹)",
    locale: "hi-IN",
    priceRegex: new RegExp(String.raw`₹\s*${PRICE_NUMBER}`, "g"),
  },

  CAD: {
    code: "CAD",
    symbol: "C$",
    label: "CAD (C$)",
    locale: "en-CA",
    priceRegex: new RegExp(String.raw`C\$\s*${PRICE_NUMBER}`, "g"),
  },

  AUD: {
    code: "AUD",
    symbol: "A$",
    label: "AUD (A$)",
    locale: "en-AU",
    priceRegex: new RegExp(String.raw`A\$\s*${PRICE_NUMBER}`, "g"),
  },

  CHF: {
    code: "CHF",
    symbol: "CHF",
    label: "CHF (Fr)",
    locale: "de-CH",
    priceRegex: new RegExp(String.raw`(?:CHF|Fr\.?)\s*${PRICE_NUMBER}`, "g"),
  },

  MXN: {
    code: "MXN",
    symbol: "MX$",
    label: "MXN (MX$)",
    locale: "es-MX",
    priceRegex: new RegExp(String.raw`MX\$\s*${PRICE_NUMBER}`, "g"),
  },

  ARS: {
    code: "ARS",
    symbol: "AR$",
    label: "ARS (AR$)",
    locale: "es-AR",
    priceRegex: new RegExp(String.raw`AR\$\s*${PRICE_NUMBER}`, "g"),
  },

  TRY: {
    code: "TRY",
    symbol: "₺",
    label: "TRY (₺)",
    locale: "tr-TR",
    priceRegex: new RegExp(String.raw`₺\s*${PRICE_NUMBER}`, "g"),
  },
};
