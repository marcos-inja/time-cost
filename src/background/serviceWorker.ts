import { DEFAULT_SETTINGS } from "@/core/types";

const STORAGE_KEY = "userSettings";

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    const existing = await chrome.storage.sync.get(STORAGE_KEY);
    if (!existing[STORAGE_KEY]) {
      await chrome.storage.sync.set({ [STORAGE_KEY]: DEFAULT_SETTINGS });
    }
  }
});
