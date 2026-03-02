import { SimpleCalculation, formatHours } from "@/core/calculator";
import { formatTimeBreakdown } from "@/core/calculator";
import type { UserSettings, TimeBreakdown } from "@/core/types";
import { DEFAULT_SETTINGS, WEEKS_PER_MONTH } from "@/core/types";
import { TooltipBuilder } from "./tooltip";

const PRICE_REGEX = /R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g;
const BADGE_ATTR = "data-pil-done";
const BADGE_CLASS = "pil-badge";
const MAX_ELEMENT_TEXT_LENGTH = 500;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "SVG", "PATH"]);

const BADGE_STYLE = [
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

const calculator = new SimpleCalculation();

function normalizePrice(raw: string): number {
  return parseFloat(raw.replace(/R\$\s*/, "").replace(/\./g, "").replace(",", ".")) || 0;
}

function createBadge(price: number, settings: UserSettings): HTMLSpanElement {
  const breakdown = calculator.calculate(price, settings);
  const badge = document.createElement("span");
  badge.className = BADGE_CLASS;
  badge.style.cssText = BADGE_STYLE;
  badge.textContent = ` (${formatTimeBreakdown(breakdown)})`;

  const tooltip = new TooltipBuilder();
  tooltip.setContent(breakdown);
  tooltip.attachTo(badge);

  return badge;
}

interface ElementCandidate {
  element: Element;
  match: RegExpExecArray;
}

/** Scan elements by textContent (catches prices split across multiple spans). */
function scanElements(settings: UserSettings): number {
  if (!document.body?.isConnected) return 0;

  const candidates: ElementCandidate[] = [];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      const el = node as Element;
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
      if (el.hasAttribute(BADGE_ATTR)) return NodeFilter.FILTER_REJECT;
      if (el.classList?.contains(BADGE_CLASS)) return NodeFilter.FILTER_REJECT;
      if (el.closest(`.${BADGE_CLASS}`)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const el = node as Element;
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    if (text.length === 0 || text.length > MAX_ELEMENT_TEXT_LENGTH) continue;

    PRICE_REGEX.lastIndex = 0;
    const match = PRICE_REGEX.exec(text);
    if (match) {
      candidates.push({ element: el, match: match as RegExpExecArray });
    }
  }

  const leaves = candidates.filter(
    (c) =>
      !candidates.some(
        (other) => other !== c && c.element.contains(other.element)
      )
  );

  let count = 0;
  for (const { element, match } of leaves) {
    try {
      if (element.hasAttribute(BADGE_ATTR)) continue;

      const price = normalizePrice(match[0]);
      if (price <= 0) continue;

      const parent = element.parentElement;
      if (!parent) continue;

      const badge = createBadge(price, settings);
      parent.insertBefore(badge, element.nextSibling);
      element.setAttribute(BADGE_ATTR, "1");
      count++;
    } catch (e) {
      console.warn("[TimeCost] scanElements annotate error", e);
    }
  }
  return count;
}

function processTextNode(textNode: Text, settings: UserSettings): void {
  const text = textNode.textContent || "";
  PRICE_REGEX.lastIndex = 0;
  if (!PRICE_REGEX.test(text)) return;

  const parent = textNode.parentElement;
  if (!parent) return;
  if (parent.hasAttribute(BADGE_ATTR)) return;
  if (parent.closest(`.${BADGE_CLASS}`)) return;

  PRICE_REGEX.lastIndex = 0;
  const match = PRICE_REGEX.exec(text);
  if (!match) return;

  const price = normalizePrice(match[0]);
  if (price <= 0) return;

  const badge = createBadge(price, settings);
  parent.setAttribute(BADGE_ATTR, "1");
  parent.appendChild(badge);
}

function scanPage(settings: UserSettings): number {
  if (!document.body?.isConnected) return 0;

  let count = 0;
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const el = node.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;
        const tag = el.tagName;
        if (SKIP_TAGS.has(tag)) return NodeFilter.FILTER_REJECT;
        if (el.hasAttribute(BADGE_ATTR)) return NodeFilter.FILTER_REJECT;
        if (el.closest("[data-pil-done]")) return NodeFilter.FILTER_REJECT;
        if (el.closest(`.${BADGE_CLASS}`)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  for (const tn of textNodes) {
    try {
      processTextNode(tn, settings);
      count++;
    } catch {
      // skip
    }
  }
  return count;
}

function startObserver(settings: UserSettings): void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      scanPage(settings);
      scanElements(settings);
    }, 500);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function getSettings(): Promise<UserSettings> {
  try {
    const result = await chrome.storage.sync.get("userSettings");
    const stored = result.userSettings;
    if (stored && typeof stored === "object") {
      return { ...DEFAULT_SETTINGS, ...stored };
    }
  } catch (e) {
    console.warn("[TimeCost] storage error:", e);
  }
  return DEFAULT_SETTINGS;
}

async function main(): Promise<void> {
  console.log("[TimeCost] Content script loaded");

  const settings = await getSettings();
  console.log("[TimeCost] Settings:", JSON.stringify(settings));

  if (settings.rendaMensal <= 0) {
    console.warn(
      "[TimeCost] rendaMensal is 0. Configure in the extension popup. Using R$5000 as fallback."
    );
    settings.rendaMensal = 5000;
  }

  const run = () => {
    if (!document.body?.isConnected) return;
    const textCount = scanPage(settings);
    const elementsCount = scanElements(settings);
    console.log(
      `[TimeCost] Scan complete: ${textCount} text nodes, ${elementsCount} elements`
    );
  };

  run();
  setTimeout(run, 2000);
  setTimeout(run, 5000);
  setTimeout(run, 10000);

  startObserver(settings);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.userSettings?.newValue) {
      console.log("[TimeCost] Settings changed, reloading page recommended");
    }
  });
}

main().catch((e) => console.error("[TimeCost] Fatal:", e));
