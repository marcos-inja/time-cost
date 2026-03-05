import { useSettings } from "./hooks/useSettings";
import { useTheme } from "./hooks/useTheme";
import { getTranslation, getSupportedLanguages, getSupportedCurrencies } from "@/i18n";
import { SettingsForm } from "./components/SettingsForm";
import { ThemeToggle } from "./components/ThemeToggle";
import styles from "./App.module.css";

export function App() {
  const { settings, profile, loading, saved, save, reset } = useSettings();
  const { toggle } = useTheme(settings?.theme, save);

  const t = getTranslation(settings?.language);

  if (loading || !settings || !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>{t.loading}</div>
      </div>
    );
  }

  const languages = getSupportedLanguages();
  const currencies = getSupportedCurrencies();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Time Cost</h1>
          <span className={styles.subtitle}>{t.subtitle}</span>
        </div>
        <div className={styles.headerControls}>
          <select
            className={styles.compactSelect}
            value={settings.language}
            onChange={(e) => save({ language: e.target.value })}
            aria-label={t.language}
            title={t.language}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.abbr}
              </option>
            ))}
          </select>
          <select
            className={styles.compactSelect}
            value={settings.currency}
            onChange={(e) => save({ currency: e.target.value })}
            aria-label={t.currency}
            title={t.currency}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          <ThemeToggle isDark={settings.theme === "dark"} onToggle={toggle} t={t} />
        </div>
      </header>

      <SettingsForm
        settings={settings}
        profile={profile}
        saved={saved}
        onSave={save}
        onReset={reset}
        t={t}
      />
    </div>
  );
}
