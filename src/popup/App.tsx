import { useSettings } from "./hooks/useSettings";
import { useTheme } from "./hooks/useTheme";
import { getTranslation } from "@/i18n";
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Time Cost</h1>
          <span className={styles.subtitle}>{t.subtitle}</span>
        </div>
        <ThemeToggle isDark={settings.theme === "dark"} onToggle={toggle} t={t} />
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
