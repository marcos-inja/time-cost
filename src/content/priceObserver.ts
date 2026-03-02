export type ScanCallback = (root: Node) => void;

export class PriceObserver {
  private observer: MutationObserver | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly debounceMs: number;

  constructor(
    private onMutation: ScanCallback,
    debounceMs = 300
  ) {
    this.debounceMs = debounceMs;
  }

  start(target: Node = document.body): void {
    if (this.observer) return;

    this.observer = new MutationObserver((mutations) => {
      const addedNodes: Node[] = [];

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            addedNodes.push(node);
          }
        }
      }

      if (addedNodes.length === 0) return;

      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        for (const node of addedNodes) {
          this.onMutation(node);
        }
      }, this.debounceMs);
    });

    this.observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  stop(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}
