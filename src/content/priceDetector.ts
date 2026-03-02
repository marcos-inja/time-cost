import type { PriceMatch, PriceParser } from "@/core/types";

const PROCESSED_ATTR = "data-pil-processed";
const BADGE_CLASS = "pil-badge";
/** Mercado Livre e outros: links/cards com preço podem ter texto longo. */
const MAX_TEXT_LENGTH = 800;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "SVG", "PATH"]);

export interface DetectedPrice {
  element: Element;
  match: PriceMatch;
}

export class PriceDetector {
  constructor(private parser: PriceParser) {}

  scan(root: Node): DetectedPrice[] {
    const rootEl = this.resolveRoot(root);
    if (!rootEl) return [];

    const candidates = this.collectCandidates(rootEl);
    return this.filterToLeaves(candidates);
  }

  private resolveRoot(root: Node): Element | null {
    if (root instanceof Element) return root;
    if (root.nodeType === Node.TEXT_NODE) return root.parentElement;
    if (root instanceof DocumentFragment) return root.firstElementChild;
    return null;
  }

  private collectCandidates(rootEl: Element): DetectedPrice[] {
    const candidates: DetectedPrice[] = [];
    this.walkElements(rootEl, candidates);
    return candidates;
  }

  /** Percorre elementos e shadow roots abertos (Mercado Livre / SPAs). */
  private walkElements(el: Element, candidates: DetectedPrice[]): void {
    if (PriceDetector.isProcessed(el)) return;
    if (SKIP_TAGS.has(el.tagName)) return;
    if (el.classList?.contains(BADGE_CLASS)) return;

    this.checkElement(el, candidates);

    const shadowRoot = (el as Element & { shadowRoot?: ShadowRoot }).shadowRoot;
    if (shadowRoot) {
      for (const child of shadowRoot.children) this.walkElements(child, candidates);
    }

    for (const child of el.children) this.walkElements(child, candidates);
  }

  private checkElement(el: Element, candidates: DetectedPrice[]): void {
    if (PriceDetector.isProcessed(el)) return;

    const text = el.textContent ?? "";
    if (text.length === 0 || text.length > MAX_TEXT_LENGTH) return;

    const matches = this.parser.detect(text);
    if (matches.length > 0) {
      candidates.push({ element: el, match: matches[0] });
    }
  }

  /**
   * Keeps only "leaf" candidates: elements with no descendant
   * that is also a candidate. This ensures we annotate the most
   * specific element containing the price.
   */
  private filterToLeaves(candidates: DetectedPrice[]): DetectedPrice[] {
    return candidates.filter((candidate) =>
      !candidates.some(
        (other) => other !== candidate && candidate.element.contains(other.element)
      )
    );
  }

  static markProcessed(element: Element): void {
    element.setAttribute(PROCESSED_ATTR, "true");
  }

  static isProcessed(element: Element): boolean {
    return element.hasAttribute(PROCESSED_ATTR);
  }
}
