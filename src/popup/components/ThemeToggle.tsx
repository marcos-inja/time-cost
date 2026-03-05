import type { TranslationKeys } from "@/i18n/translations";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  t: TranslationKeys;
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ isDark, onToggle, t }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={isDark ? t.switchToLight : t.switchToDark}
      title={isDark ? t.lightTheme : t.darkTheme}
    >
      {isDark ? (
        <SunIcon className={styles.icon} />
      ) : (
        <MoonIcon className={styles.icon} />
      )}
    </button>
  );
}
