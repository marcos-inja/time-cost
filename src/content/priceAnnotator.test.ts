import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PriceAnnotator } from "./priceAnnotator";
import type { DetectedPrice } from "./priceDetector";
import type { UserSettings } from "@/core/types";
import { BADGE_CLASS, BADGE_ATTR } from "./constants";

// Mock do CSS inline do tooltip (não existe em ambiente de teste)
vi.mock("./tooltip.css?inline", () => ({ default: "" }));

/**
 * Testes do PriceAnnotator — responsável por criar badges visuais
 * ao lado de cada preço detectado no DOM.
 *
 * O annotator:
 *   - Calcula o tempo de trabalho equivalente ao preço
 *   - Cria um <span class="pil-badge"> com o texto formatado
 *   - Anexa um tooltip com Shadow DOM ao badge
 *   - Marca o anchor com data-pil-done para evitar re-anotação
 */

const defaultSettings: UserSettings = {
  rendaMensal: 5000,
  horasPorDia: 8,
  diasPorSemana: 5,
  theme: "light",
};

let container: HTMLElement;

function createDetectedPrice(
  value: number,
  anchorEl?: HTMLElement
): DetectedPrice {
  const anchor = anchorEl ?? document.createElement("span");
  anchor.textContent = `R$ ${value}`;
  if (!anchor.parentElement) {
    container.appendChild(anchor);
  }
  return {
    value,
    raw: `R$ ${value}`,
    anchor,
    textNodes: [],
  };
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
});

describe("PriceAnnotator", () => {
  describe("annotate", () => {
    it("should create badge element after anchor", () => {
      const annotator = new PriceAnnotator();
      const detected = [createDetectedPrice(1000)];

      annotator.annotate(detected, defaultSettings);

      const badge = container.querySelector(`.${BADGE_CLASS}`);
      expect(badge).not.toBeNull();
      expect(badge?.tagName).toBe("SPAN");
    });

    it("should set badge text with formatted time breakdown", () => {
      const annotator = new PriceAnnotator();
      const detected = [createDetectedPrice(1000)];

      annotator.annotate(detected, defaultSettings);

      const badge = container.querySelector(`.${BADGE_CLASS}`);
      // Com renda de R$5000, 8h/dia, 5d/sem → valorHora ≈ R$28.87
      // 1000 / 28.87 ≈ 34.6h ≈ 4.3 dias
      expect(badge?.textContent).toMatch(/\d/);
    });

    it("should set data-pil-done attribute on anchor", () => {
      const annotator = new PriceAnnotator();
      const detected = [createDetectedPrice(500)];

      annotator.annotate(detected, defaultSettings);

      expect(detected[0].anchor.getAttribute(BADGE_ATTR)).toBe("1");
    });

    it("should return count of annotated prices", () => {
      const annotator = new PriceAnnotator();
      const detected = [
        createDetectedPrice(500),
        createDetectedPrice(1000),
        createDetectedPrice(2000),
      ];

      const count = annotator.annotate(detected, defaultSettings);

      expect(count).toBe(3);
    });

    it("should skip prices with value <= 0", () => {
      const annotator = new PriceAnnotator();
      const detected = [createDetectedPrice(0)];

      const count = annotator.annotate(detected, defaultSettings);

      expect(count).toBe(0);
    });

    it("should skip anchors already marked with data-pil-done", () => {
      const annotator = new PriceAnnotator();
      const anchor = document.createElement("span");
      anchor.setAttribute(BADGE_ATTR, "1");
      container.appendChild(anchor);

      const detected: DetectedPrice[] = [
        { value: 1000, raw: "R$ 1.000", anchor, textNodes: [] },
      ];

      const count = annotator.annotate(detected, defaultSettings);

      expect(count).toBe(0);
    });

    it("should return 0 when rendaMensal is 0", () => {
      const annotator = new PriceAnnotator();
      const detected = [createDetectedPrice(1000)];
      const settings = { ...defaultSettings, rendaMensal: 0 };

      const count = annotator.annotate(detected, settings);

      expect(count).toBe(0);
    });

    it("should return 0 when anchor has no parent element", () => {
      const annotator = new PriceAnnotator();
      const orphanAnchor = document.createElement("span");
      // Not appended to any parent

      const detected: DetectedPrice[] = [
        { value: 1000, raw: "R$ 1.000", anchor: orphanAnchor, textNodes: [] },
      ];

      const count = annotator.annotate(detected, defaultSettings);

      expect(count).toBe(0);
    });
  });
});
