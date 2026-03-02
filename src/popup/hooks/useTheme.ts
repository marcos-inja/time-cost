import { useEffect, useCallback } from "react";
import type { UserSettings } from "@/core/types";

type Theme = UserSettings["theme"];

export function useTheme(
  theme: Theme | undefined,
  onToggle: (updates: Partial<UserSettings>) => Promise<void>
) {
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    onToggle({ theme: next });
  }, [theme, onToggle]);

  return { toggle };
}
