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
