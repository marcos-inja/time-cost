import { useSettings } from "./hooks/useSettings";
import { useTheme } from "./hooks/useTheme";
import { SettingsForm } from "./components/SettingsForm";
import { ThemeToggle } from "./components/ThemeToggle";
import styles from "./App.module.css";

export function App() {
  const { settings, profile, loading, saved, save, reset } = useSettings();
  const { toggle } = useTheme(settings?.theme, save);

  if (loading || !settings || !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Time Cost</h1>
          <span className={styles.subtitle}>Quanto custa em tempo de vida?</span>
        </div>
        <ThemeToggle isDark={settings.theme === "dark"} onToggle={toggle} />
      </header>

      <SettingsForm
        settings={settings}
        profile={profile}
        saved={saved}
        onSave={save}
        onReset={reset}
      />
    </div>
  );
}
