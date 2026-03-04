export type ScanCallback = () => void;

export class PriceObserver {
  private observer: MutationObserver | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly debounceMs: number;
  private readonly maxWaitMs: number;

  constructor(
    private onMutation: ScanCallback,
    debounceMs = 300,
    maxWaitMs = 2000
  ) {
    this.debounceMs = debounceMs;
    this.maxWaitMs = maxWaitMs;
  }

  start(target: Node = document.body): void {
    if (this.observer) return;

    this.observer = new MutationObserver(() => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.flush();
      }, this.debounceMs);

      // Max wait: guarantee scan runs even if mutations keep firing
      if (!this.maxWaitTimer) {
        this.maxWaitTimer = setTimeout(() => {
          this.flush();
        }, this.maxWaitMs);
      }
    });

    this.observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  private flush(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.maxWaitTimer) {
      clearTimeout(this.maxWaitTimer);
      this.maxWaitTimer = null;
    }
    this.onMutation();
  }

  stop(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.maxWaitTimer) {
      clearTimeout(this.maxWaitTimer);
      this.maxWaitTimer = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}
