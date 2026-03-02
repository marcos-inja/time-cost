import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      <span className={styles.label}>{isDark ? "Escuro" : "Claro"}</span>
      <span className={styles.track} data-active={isDark}>
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
