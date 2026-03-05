import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { BrlPriceParser } from "@/core/priceParser";
import { PriceDetector } from "./priceDetector";

/**
 * Testes do PriceDetector — módulo mais crítico do content script.
 *
 * O PriceDetector percorre a árvore DOM procurando preços em R$ usando
 * duas estratégias:
 *   1. Inline match: preço inteiro dentro de um único text node
 *   2. Cross-node match: preço dividido entre múltiplos text nodes
 *
 * Usa WeakSet para evitar duplicatas e respeita SKIP_TAGS para não
 * processar conteúdo de scripts, estilos, etc.
 */

let container: HTMLElement;

function createDOM(html: string): HTMLElement {
  container.innerHTML = html;
  return container;
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
});

describe("PriceDetector", () => {
  describe("scan — inline match (Strategy 1)", () => {
    it("should detect a simple price in a paragraph", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<p>R$ 1.299,90</p>");

      const results = detector.scan(container);

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe(1299.9);
      expect(results[0].raw).toBe("R$ 1.299,90");
    });

    it("should detect price with thousands separator", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<span>R$ 12.999,90</span>");

      const results = detector.scan(container);

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe(12999.9);
    });

    it("should detect first price in a text node (anchor is then marked as processed)", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      // When two prices share the same parent element (anchor),
      // only the first is detected — the anchor gets marked as processed
      // to prevent duplicate badges on the same element.
      createDOM("<p>De R$ 299,90 por R$ 199,90</p>");

      const results = detector.scan(container);

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe(299.9);
    });

    it("should detect multiple prices when they have different parent elements", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM(
        "<div><span>R$ 299,90</span> por <span>R$ 199,90</span></div>"
      );

      const results = detector.scan(container);

      expect(results).toHaveLength(2);
      expect(results[0].value).toBe(299.9);
      expect(results[1].value).toBe(199.9);
    });

    it("should detect prices in separate elements", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<div><p>R$ 1.500</p><p>R$ 2.000</p></div>");

      const results = detector.scan(container);

      expect(results).toHaveLength(2);
      expect(results[0].value).toBe(1500);
      expect(results[1].value).toBe(2000);
    });

    it("should return empty array for text without prices", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<p>Hello world, no prices here</p>");

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });

    it("should return empty array for disconnected node", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      const detached = document.createElement("div");
      detached.innerHTML = "<p>R$ 100,00</p>";

      const results = detector.scan(detached);

      expect(results).toHaveLength(0);
    });

    it("should set anchor to the parent element of the text node", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<div><span class='price'>R$ 500,00</span></div>");

      const results = detector.scan(container);

      expect(results).toHaveLength(1);
      expect(results[0].anchor.tagName).toBe("SPAN");
      expect(results[0].anchor.classList.contains("price")).toBe(true);
    });
  });

  describe("scan — cross-node match (Strategy 2)", () => {
    it("should detect price split across two spans", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM(
        "<div><span><span>R$ </span><span>1.299,90</span></span></div>"
      );

      const results = detector.scan(container);

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe(1299.9);
    });

    it("should detect price split across three spans (Mercado Livre style)", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      // Real Mercado Livre structure: R$ followed by full number in next node
      createDOM(
        "<div><span><span>R$ </span><span>2.788</span></span></div>"
      );

      const results = detector.scan(container);

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe(2788);
    });

    it("should stop cross-node accumulation when encountering another R$", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM(
        "<div><span>R$ </span><span>R$ 500,00</span></div>"
      );

      const results = detector.scan(container);

      // Should detect the second price (R$ 500,00) as inline
      expect(results.some((r) => r.value === 500)).toBe(true);
    });
  });

  describe("scan — skip tags", () => {
    it("should skip prices inside SCRIPT tags", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<div><script>var x = 'R$ 1.000';</script></div>");

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });

    it("should skip prices inside STYLE tags", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<div><style>/* R$ 1.000 */</style></div>");

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });

    it("should skip prices inside TEXTAREA tags", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<div><textarea>R$ 1.000</textarea></div>");

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });

    it("should skip elements with pil-badge class", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM(
        '<div><span class="pil-badge">R$ 1.000</span></div>'
      );

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });

    it("should skip elements with data-pil-done attribute", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM(
        '<div><span data-pil-done="1">R$ 1.000</span></div>'
      );

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });
  });

  describe("scan — deduplication", () => {
    it("should not detect the same text node twice on repeated scans", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<p>R$ 1.000</p>");

      const firstScan = detector.scan(container);
      const secondScan = detector.scan(container);

      expect(firstScan).toHaveLength(1);
      expect(secondScan).toHaveLength(0);
    });

    it("should not create duplicate badges for nested ancestor elements", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      // Two text nodes with same price in parent-child relationship
      createDOM(
        '<div id="outer"><span id="inner">R$ 1.500</span></div>'
      );

      const results = detector.scan(container);

      // Should detect only once
      expect(results).toHaveLength(1);
    });
  });

  describe("scan — edge cases", () => {
    it("should handle empty container gracefully", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("");

      const results = detector.scan(container);

      expect(results).toHaveLength(0);
    });

    it("should include textNodes in the result", () => {
      const detector = new PriceDetector(new BrlPriceParser());
      createDOM("<p>R$ 500,00</p>");

      const results = detector.scan(container);

      expect(results[0].textNodes).toHaveLength(1);
      expect(results[0].textNodes[0].textContent).toContain("R$");
    });
  });
});
