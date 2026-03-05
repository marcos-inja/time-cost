import type { TimeBreakdown } from "@/core/types";
import type { TranslationKeys } from "@/i18n/translations";
import tooltipCss from "./tooltip.css?inline";

export interface TooltipRow {
  label: string;
  value: string;
}

export function formatRows(breakdown: TimeBreakdown, t: TranslationKeys): TooltipRow[] {
  return [
    { label: t.hours, value: `${breakdown.horas.toFixed(1)}${t.hoursShort}` },
    { label: t.days, value: `${breakdown.dias.toFixed(1)} ${t.daysShort}` },
    { label: t.weeks, value: `${breakdown.semanas.toFixed(1)} ${t.weeksShort}` },
    { label: t.months, value: `${breakdown.meses.toFixed(2)} ${t.monthsShort}` },
    { label: t.years, value: `${breakdown.anos.toFixed(2)} ${t.yearsShort}` },
  ];
}

export class TooltipBuilder {
  private shadowHost: HTMLElement;
  private shadowRoot: ShadowRoot;
  private tooltipEl: HTMLElement;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.shadowHost = document.createElement("span");
    this.shadowHost.style.position = "relative";
    this.shadowHost.style.display = "inline";

    this.shadowRoot = this.shadowHost.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = tooltipCss;
    this.shadowRoot.appendChild(style);

    this.tooltipEl = document.createElement("div");
    this.tooltipEl.className = "pil-tooltip";
    this.shadowRoot.appendChild(this.tooltipEl);
  }

  setContent(breakdown: TimeBreakdown, t: TranslationKeys): this {
    this.tooltipEl.innerHTML = "";
    const rows = formatRows(breakdown, t);

    for (const row of rows) {
      const rowEl = document.createElement("div");
      rowEl.className = "pil-tooltip-row";

      const labelEl = document.createElement("span");
      labelEl.className = "pil-tooltip-label";
      labelEl.textContent = row.label;

      const valueEl = document.createElement("span");
      valueEl.className = "pil-tooltip-value";
      valueEl.textContent = row.value;

      rowEl.appendChild(labelEl);
      rowEl.appendChild(valueEl);
      this.tooltipEl.appendChild(rowEl);
    }

    return this;
  }

  attachTo(badge: HTMLElement): void {
    badge.appendChild(this.shadowHost);

    badge.addEventListener("mouseenter", () => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
      this.tooltipEl.classList.add("visible");
    });

    badge.addEventListener("mouseleave", () => {
      this.hideTimeout = setTimeout(() => {
        this.tooltipEl.classList.remove("visible");
      }, 150);
    });
  }

  getHost(): HTMLElement {
    return this.shadowHost;
  }
}
