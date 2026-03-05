import type { PriceParser } from "@/core/types";
import { BADGE_ATTR, BADGE_CLASS, SKIP_TAGS } from "./constants";

const MAX_LOOKAHEAD = 6;
const MAX_ACCUMULATOR_LEN = 40;

export interface DetectedPrice {
  value: number;
  raw: string;
  anchor: Element;
  textNodes: Text[];
}

export class PriceDetector {
  private processedTextNodes = new WeakSet<Text>();
  private processedAnchors = new WeakSet<Element>();

  constructor(private parser: PriceParser) {}

  scan(root: Node): DetectedPrice[] {
    const body = root instanceof Element ? root : root.parentElement;
    if (!body?.isConnected) return [];

    const results: DetectedPrice[] = [];
    const textNodes = this.collectTextNodes(body);

    let i = 0;
    while (i < textNodes.length) {
      const node = textNodes[i];

      if (this.processedTextNodes.has(node)) {
        i++;
        continue;
      }

      const text = node.textContent ?? "";
      if (!text.includes(this.parser.currencySymbol)) {
        i++;
        continue;
      }

      // Strategy 1: Inline match — full price in this single text node
      const inlineResults = this.tryInlineMatch(node, text);
      if (inlineResults.length > 0) {
        for (const r of inlineResults) results.push(r);
        i++;
        continue;
      }

      // Strategy 2: Cross-node assembly — collect from subsequent text nodes
      const crossResult = this.tryCrossNodeMatch(textNodes, i);
      if (crossResult) {
        results.push(crossResult);
        i = crossResult._endIndex + 1;
        continue;
      }

      i++;
    }

    return results;
  }

  private collectTextNodes(root: Element): Text[] {
    const nodes: Text[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const el = node.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
        if (el.classList?.contains(BADGE_CLASS)) return NodeFilter.FILTER_REJECT;
        if (el.hasAttribute(BADGE_ATTR)) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let current: Node | null;
    while ((current = walker.nextNode())) {
      nodes.push(current as Text);
    }
    return nodes;
  }

  private tryInlineMatch(
    node: Text,
    text: string
  ): DetectedPrice[] {
    const results: DetectedPrice[] = [];
    const regex = new RegExp(this.parser.priceRegex.source, "g");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const value = this.parser.normalize(match[0]);
      if (value <= 0) continue;

      const anchor = node.parentElement;
      if (!anchor) continue;

      if (this.isAnchorProcessed(anchor)) continue;

      results.push({
        value,
        raw: match[0],
        anchor,
        textNodes: [node],
      });

      this.processedTextNodes.add(node);
      this.processedAnchors.add(anchor);
    }

    return results;
  }

  private tryCrossNodeMatch(
    textNodes: Text[],
    startIdx: number
  ): (DetectedPrice & { _endIndex: number }) | null {
    const startNode = textNodes[startIdx];
    let accumulated = (startNode.textContent ?? "").replace(/\s+/g, " ");
    const collectedNodes: Text[] = [startNode];
    let endIdx = startIdx;

    for (
      let j = startIdx + 1;
      j < textNodes.length && j <= startIdx + MAX_LOOKAHEAD;
      j++
    ) {
      const nodeText = textNodes[j].textContent ?? "";
      const trimmed = nodeText.trim();

      // Skip empty/whitespace-only nodes
      if (trimmed.length === 0) continue;

      // Stop if we hit another currency symbol (new price starts)
      if (trimmed.includes(this.parser.currencySymbol) && j !== startIdx) break;

      accumulated += nodeText.replace(/\s+/g, " ");
      collectedNodes.push(textNodes[j]);
      endIdx = j;

      if (accumulated.length > MAX_ACCUMULATOR_LEN) break;

      // Try to match in accumulated text
      const normalized = accumulated.replace(/\s+/g, " ").trim();
      const regex = new RegExp(this.parser.priceRegex.source, "g");
      const match = regex.exec(normalized);

      if (match) {
        const value = this.parser.normalize(match[0]);
        if (value <= 0) continue;

        const anchor = this.findCommonAncestor(startNode, textNodes[endIdx]);
        if (!anchor) continue;

        if (this.isAnchorProcessed(anchor)) return null;

        for (const n of collectedNodes) this.processedTextNodes.add(n);
        this.processedAnchors.add(anchor);

        return {
          value,
          raw: match[0],
          anchor,
          textNodes: collectedNodes,
          _endIndex: endIdx,
        };
      }
    }

    return null;
  }

  private findCommonAncestor(a: Node, b: Node): Element | null {
    const ancestors = new Set<Node>();
    let current: Node | null = a;
    while (current) {
      ancestors.add(current);
      current = current.parentNode;
    }

    current = b;
    while (current) {
      if (ancestors.has(current) && current instanceof Element) return current;
      current = current.parentNode;
    }

    return null;
  }

  private isAnchorProcessed(el: Element): boolean {
    if (this.processedAnchors.has(el)) return true;

    // Check if any ancestor is already processed (avoids duplicate badges
    // e.g. Amazon's a-offscreen + visible split nodes in the same a-price)
    let current: Element | null = el.parentElement;
    let depth = 0;
    while (current && current !== document.body && depth < 8) {
      if (this.processedAnchors.has(current)) return true;
      current = current.parentElement;
      depth++;
    }

    return false;
  }
}
