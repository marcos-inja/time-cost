import type { SettingsRepository, UserSettings } from "@/core/types";
import { DEFAULT_SETTINGS } from "@/core/types";

export class UserSettingsRepository implements SettingsRepository<UserSettings> {
  private readonly storageKey = "userSettings";

  async get(): Promise<UserSettings> {
    const result = await chrome.storage.sync.get(this.storageKey);
    const stored = result[this.storageKey] as Partial<UserSettings> | undefined;
    return { ...DEFAULT_SETTINGS, ...stored };
  }

  async save(settings: Partial<UserSettings>): Promise<void> {
    const current = await this.get();
    const updated = { ...current, ...settings };
    await chrome.storage.sync.set({ [this.storageKey]: updated });
  }

  async reset(): Promise<void> {
    await chrome.storage.sync.set({ [this.storageKey]: DEFAULT_SETTINGS });
  }

  onChange(callback: (settings: UserSettings) => void): void {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync" || !changes[this.storageKey]) return;
      const newValue = changes[this.storageKey].newValue as UserSettings;
      callback({ ...DEFAULT_SETTINGS, ...newValue });
    });
  }
}
