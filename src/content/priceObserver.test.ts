import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PriceObserver } from "./priceObserver";

/**
 * Testes do PriceObserver — MutationObserver com debounce e max-wait.
 *
 * O PriceObserver observa mudanças no DOM e chama o callback de scan
 * com duas garantias:
 *   1. Debounce: espera 300ms de "silêncio" antes de chamar o callback
 *   2. Max wait: garante que o callback roda em no máximo 2000ms,
 *      mesmo que mutações continuem acontecendo
 *
 * Isso é essencial para SPAs onde o conteúdo muda dinamicamente.
 */

let container: HTMLElement;
let callback: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  callback = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  container.remove();
});

function triggerMutation() {
  container.appendChild(document.createElement("span"));
}

/**
 * Helper: avança os timers e processa a fila de microtasks
 * para que o MutationObserver dispare seus callbacks.
 */
async function advanceTimers(ms: number) {
  await vi.advanceTimersByTimeAsync(ms);
}

describe("PriceObserver", () => {
  describe("debounce behavior", () => {
    it("should not call callback immediately after mutation", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      triggerMutation();
      await advanceTimers(0);

      expect(callback).not.toHaveBeenCalled();
      observer.stop();
    });

    it("should call callback after debounce period", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      triggerMutation();
      await advanceTimers(350);

      expect(callback).toHaveBeenCalledTimes(1);
      observer.stop();
    });

    it("should reset debounce timer on subsequent mutations", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      triggerMutation();
      await advanceTimers(200);
      triggerMutation();
      await advanceTimers(200);

      // 400ms total, but only 200ms since last mutation — not yet
      expect(callback).not.toHaveBeenCalled();

      await advanceTimers(150);
      // 550ms total, 350ms since last mutation — debounce fired
      expect(callback).toHaveBeenCalledTimes(1);
      observer.stop();
    });

    it("should call callback only once for rapid consecutive mutations", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      for (let i = 0; i < 5; i++) {
        triggerMutation();
        await advanceTimers(50);
      }
      await advanceTimers(350);

      expect(callback).toHaveBeenCalledTimes(1);
      observer.stop();
    });
  });

  describe("max wait guarantee", () => {
    it("should fire callback at max wait even if mutations continue", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      // Mutate every 100ms for 2500ms — debounce never settles
      for (let i = 0; i < 25; i++) {
        triggerMutation();
        await advanceTimers(100);
      }

      // Max wait (2000ms) should have fired at least once
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);
      observer.stop();
    });
  });

  describe("start/stop lifecycle", () => {
    it("should not fire callback after stop()", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      triggerMutation();
      observer.stop();
      await advanceTimers(500);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should be idempotent — calling start() twice does not create two observers", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);
      observer.start(container);

      triggerMutation();
      await advanceTimers(350);

      // Should still fire only once, not twice
      expect(callback).toHaveBeenCalledTimes(1);
      observer.stop();
    });

    it("should clear all pending timers on stop()", async () => {
      const observer = new PriceObserver(callback, 300, 2000);
      observer.start(container);

      triggerMutation();
      await advanceTimers(100);
      observer.stop();

      // Advance past both debounce and maxWait
      await advanceTimers(3000);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("custom timing", () => {
    it("should respect custom debounce and max wait values", async () => {
      const observer = new PriceObserver(callback, 100, 500);
      observer.start(container);

      triggerMutation();
      await advanceTimers(50);
      expect(callback).not.toHaveBeenCalled();

      await advanceTimers(100);
      expect(callback).toHaveBeenCalledTimes(1);
      observer.stop();
    });
  });
});
