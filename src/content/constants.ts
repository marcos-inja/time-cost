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

export const getBadgeStyle = (theme: "light" | "dark") => {
  const isDark = theme === "dark";
  const bg = isDark ? "#252422" : "#f0f8ff";
  const color = isDark ? "#3bd3fd" : "#3859f9";
  const border = isDark ? "#525a69" : "#dad4c8";
  const shadow = isDark
    ? "rgba(0,0,0,0.35) 0px 1px 1px,rgba(255,255,255,0.04) 0px -1px 1px inset"
    : "rgba(0,0,0,0.1) 0px 1px 1px,rgba(0,0,0,0.04) 0px -1px 1px inset";

  return [
    "font-size:0.8em",
    "font-weight:600",
    "margin-left:4px",
    "padding:2px 6px",
    "border-radius:11px",
    `background:${bg}`,
    `color:${color}`,
    `border:1px solid ${border}`,
    `box-shadow:${shadow}`,
    "font-family:Roobert,Sora,Arial,sans-serif",
    "cursor:default",
    "display:inline",
    "white-space:nowrap",
    "text-decoration:none",
    "vertical-align:baseline",
    "line-height:inherit",
    "position:relative",
  ].join(";");
};
