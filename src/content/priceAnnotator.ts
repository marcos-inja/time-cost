import type { UserSettings } from "@/core/types";
import { SimpleCalculation, formatHours } from "@/core/calculator";
import { TooltipBuilder } from "./tooltip";
import type { DetectedPrice } from "./priceDetector";
import { PriceDetector } from "./priceDetector";

const BADGE_CLASS = "pil-badge";

const badgeBaseStyle = [
  "font-size: 0.8em",
  "font-weight: 600",
  "margin-left: 4px",
  "padding: 1px 5px",
  "border-radius: 4px",
  "background: rgba(37, 99, 235, 0.12)",
  "color: #2563eb",
  "cursor: default",
  "display: inline",
  "position: relative",
  "white-space: nowrap",
  "vertical-align: baseline",
  "line-height: inherit",
  "text-decoration: none",
].join(";");

export class PriceAnnotator {
  private calculator = new SimpleCalculation();

  annotate(detected: DetectedPrice[], settings: UserSettings): void {
    if (settings.rendaMensal <= 0) return;

    for (const { element, match } of detected) {
      if (PriceDetector.isProcessed(element)) continue;

      const parent = element.parentElement;
      if (!parent) continue;

      const breakdown = this.calculator.calculate(match.value, settings);
      const badgeText = formatHours(breakdown);

      const badge = document.createElement("span");
      badge.className = BADGE_CLASS;
      badge.style.cssText = badgeBaseStyle;
      badge.textContent = ` ${badgeText}`;

      const tooltip = new TooltipBuilder();
      tooltip.setContent(breakdown);
      tooltip.attachTo(badge);

      parent.insertBefore(badge, element.nextSibling);
      PriceDetector.markProcessed(element);
    }
  }
}
