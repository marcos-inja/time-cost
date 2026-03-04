import type { UserSettings } from "@/core/types";
import { SimpleCalculation, formatTimeBreakdown } from "@/core/calculator";
import { TooltipBuilder } from "./tooltip";
import type { DetectedPrice } from "./priceDetector";
import { BADGE_CLASS, BADGE_ATTR, BADGE_STYLE } from "./constants";

export class PriceAnnotator {
  private calculator = new SimpleCalculation();

  annotate(detected: DetectedPrice[], settings: UserSettings): number {
    if (settings.rendaMensal <= 0) return 0;

    let count = 0;
    for (const { value, anchor } of detected) {
      if (value <= 0) continue;
      if (anchor.hasAttribute(BADGE_ATTR)) continue;

      const parent = anchor.parentElement;
      if (!parent) continue;

      const breakdown = this.calculator.calculate(value, settings);

      const badge = document.createElement("span");
      badge.className = BADGE_CLASS;
      badge.style.cssText = BADGE_STYLE;
      badge.textContent = ` (${formatTimeBreakdown(breakdown)})`;

      const tooltip = new TooltipBuilder();
      tooltip.setContent(breakdown);
      tooltip.attachTo(badge);

      parent.insertBefore(badge, anchor.nextSibling);
      anchor.setAttribute(BADGE_ATTR, "1");
      count++;
    }

    return count;
  }
}
