import type { UserSettings } from "@/core/types";
import { DEFAULT_SETTINGS } from "@/core/types";
import { BrlPriceParser } from "@/core/priceParser";
import { PriceDetector } from "./priceDetector";
import { PriceAnnotator } from "./priceAnnotator";
import { PriceObserver } from "./priceObserver";

async function getSettings(): Promise<UserSettings> {
  try {
    const result = await chrome.storage.sync.get("userSettings");
    const stored = result.userSettings;
    if (stored && typeof stored === "object") {
      return { ...DEFAULT_SETTINGS, ...stored };
    }
  } catch (e) {
    console.warn("[TimeCost] storage error:", e);
  }
  return DEFAULT_SETTINGS;
}

async function main(): Promise<void> {
  console.log("[TimeCost] Content script loaded");

  const settings = await getSettings();
  console.log("[TimeCost] Settings:", JSON.stringify(settings));

  if (settings.rendaMensal <= 0) {
    console.warn(
      "[TimeCost] rendaMensal is 0. Configure in the extension popup. Using R$5000 as fallback."
    );
    settings.rendaMensal = 5000;
  }

  const parser = new BrlPriceParser();
  const detector = new PriceDetector(parser);
  const annotator = new PriceAnnotator();

  const runScan = () => {
    if (!document.body?.isConnected) return;
    const detected = detector.scan(document.body);
    const count = annotator.annotate(detected, settings);
    if (count > 0) {
      console.log(`[TimeCost] Annotated ${count} prices`);
    }
  };

  runScan();
  setTimeout(runScan, 2000);
  setTimeout(runScan, 5000);

  const observer = new PriceObserver(runScan, 300, 2000);
  observer.start(document.body);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.userSettings?.newValue) {
      console.log("[TimeCost] Settings changed, reloading page recommended");
    }
  });
}

main().catch((e) => console.error("[TimeCost] Fatal:", e));
