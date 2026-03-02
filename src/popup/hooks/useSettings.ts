import { useState, useEffect, useCallback } from "react";
import type { UserSettings } from "@/core/types";
import { UserSettingsRepository } from "@/storage/userSettingsRepository";
import { SimpleCalculation } from "@/core/calculator";
import type { DerivedWorkProfile } from "@/core/types";

const repository = new UserSettingsRepository();
const calculator = new SimpleCalculation();

interface UseSettingsReturn {
  settings: UserSettings | null;
  profile: DerivedWorkProfile | null;
  loading: boolean;
  saved: boolean;
  save: (updates: Partial<UserSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    repository.get().then((s) => {
      setSettings(s);
      setLoading(false);
    });

    repository.onChange((s) => setSettings(s));
  }, []);

  const save = useCallback(async (updates: Partial<UserSettings>) => {
    await repository.save(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const reset = useCallback(async () => {
    await repository.reset();
  }, []);

  const profile = settings ? calculator.deriveProfile(settings) : null;

  return { settings, profile, loading, saved, save, reset };
}
