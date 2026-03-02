import { describe, it, expect, beforeEach, vi } from "vitest";
import { DEFAULT_SETTINGS } from "@/core/types";
import type { UserSettings } from "@/core/types";

const mockStorage: Record<string, unknown> = {};
const changeListeners: Array<(changes: Record<string, chrome.storage.StorageChange>, area: string) => void> = [];

vi.stubGlobal("chrome", {
  storage: {
    sync: {
      get: vi.fn(async (key: string) => {
        return { [key]: mockStorage[key] };
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        for (const [key, value] of Object.entries(items)) {
          const oldValue = mockStorage[key];
          mockStorage[key] = value;
          changeListeners.forEach((cb) =>
            cb({ [key]: { oldValue, newValue: value } }, "sync")
          );
        }
      }),
    },
    onChanged: {
      addListener: vi.fn((cb: (changes: Record<string, chrome.storage.StorageChange>, area: string) => void) => {
        changeListeners.push(cb);
      }),
    },
  },
});

import { UserSettingsRepository } from "./userSettingsRepository";

describe("UserSettingsRepository", () => {
  let repo: UserSettingsRepository;

  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
    changeListeners.length = 0;
    repo = new UserSettingsRepository();
  });

  describe("get", () => {
    it("should return defaults when nothing is stored", async () => {
      const settings = await repo.get();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it("should merge stored values with defaults", async () => {
      mockStorage["userSettings"] = { rendaMensal: 3000 };
      const settings = await repo.get();
      expect(settings.rendaMensal).toBe(3000);
      expect(settings.horasPorDia).toBe(DEFAULT_SETTINGS.horasPorDia);
    });
  });

  describe("save", () => {
    it("should save partial settings merged with current", async () => {
      await repo.save({ rendaMensal: 5000 });
      const stored = mockStorage["userSettings"] as UserSettings;
      expect(stored.rendaMensal).toBe(5000);
      expect(stored.horasPorDia).toBe(DEFAULT_SETTINGS.horasPorDia);
    });

    it("should preserve existing settings when saving partial", async () => {
      await repo.save({ rendaMensal: 5000 });
      await repo.save({ horasPorDia: 6 });
      const stored = mockStorage["userSettings"] as UserSettings;
      expect(stored.rendaMensal).toBe(5000);
      expect(stored.horasPorDia).toBe(6);
    });
  });

  describe("reset", () => {
    it("should reset to default settings", async () => {
      await repo.save({ rendaMensal: 9000 });
      await repo.reset();
      const settings = await repo.get();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("onChange", () => {
    it("should call callback when settings change", async () => {
      const callback = vi.fn();
      repo.onChange(callback);

      await repo.save({ rendaMensal: 7000 });
      expect(callback).toHaveBeenCalled();
      const received = callback.mock.calls[0][0];
      expect(received.rendaMensal).toBe(7000);
    });
  });
});
