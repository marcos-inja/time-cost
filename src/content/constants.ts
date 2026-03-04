export const BADGE_ATTR = "data-pil-done";
export const BADGE_CLASS = "pil-badge";
export const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "SVG",
  "PATH",
]);

// Matches R$ prices in both BRL format (1.199,50) and US format (5,399.00)
// Alt 1: numbers without thousands separators (4+ digits) with optional decimal
// Alt 2: numbers with thousands separators (dot or comma + 3 digits) with optional decimal
export const PRICE_REGEX =
  /R\$\s*(?:\d{4,}(?:[.,]\d{1,2})?|\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/g;

export const BADGE_STYLE = [
  "font-size:0.8em",
  "font-weight:600",
  "margin-left:4px",
  "padding:1px 5px",
  "border-radius:4px",
  "background:rgba(37,99,235,0.12)",
  "color:#2563eb",
  "cursor:default",
  "display:inline",
  "white-space:nowrap",
  "text-decoration:none",
  "vertical-align:baseline",
  "line-height:inherit",
  "position:relative",
].join(";");
