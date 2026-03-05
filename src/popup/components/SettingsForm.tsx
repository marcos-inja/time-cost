import { useState, useEffect } from "react";
import type { UserSettings, DerivedWorkProfile } from "@/core/types";
import type { TranslationKeys } from "@/i18n/translations";
import { getCurrencyConfig, getSupportedCurrencies, getSupportedLanguages } from "@/i18n";
import styles from "./SettingsForm.module.css";

interface SettingsFormProps {
  settings: UserSettings;
  profile: DerivedWorkProfile;
  saved: boolean;
  onSave: (updates: Partial<UserSettings>) => Promise<void>;
  onReset: () => Promise<void>;
  t: TranslationKeys;
}

export function SettingsForm({ settings, profile, saved, onSave, onReset, t }: SettingsFormProps) {
  const [rendaMensal, setRendaMensal] = useState("");
  const [horasPorDia, setHorasPorDia] = useState("");
  const [diasPorSemana, setDiasPorSemana] = useState("");

  useEffect(() => {
    setRendaMensal(settings.rendaMensal > 0 ? String(settings.rendaMensal) : "");
    setHorasPorDia(String(settings.horasPorDia));
    setDiasPorSemana(String(settings.diasPorSemana));
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      rendaMensal: parseFloat(rendaMensal) || 0,
      horasPorDia: parseFloat(horasPorDia) || 8,
      diasPorSemana: parseFloat(diasPorSemana) || 5,
    });
  };

  const currencyConfig = getCurrencyConfig(settings.currency);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString(currencyConfig.locale, {
      style: "currency",
      currency: currencyConfig.code,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.settings}</h2>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="currency">
              {t.currency}
            </label>
            <select
              id="currency"
              className={styles.input}
              value={settings.currency}
              onChange={(e) => onSave({ currency: e.target.value })}
            >
              {getSupportedCurrencies().map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="language">
              {t.language}
            </label>
            <select
              id="language"
              className={styles.input}
              value={settings.language}
              onChange={(e) => onSave({ language: e.target.value })}
            >
              {getSupportedLanguages().map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="rendaMensal">
              {t.monthlyIncome} ({currencyConfig.symbol})
            </label>
            <input
              id="rendaMensal"
              className={styles.input}
              type="number"
              min="0"
              step="100"
              placeholder="Ex: 5000"
              value={rendaMensal}
              onChange={(e) => setRendaMensal(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="horasPorDia">
              {t.hoursPerDay}
            </label>
            <input
              id="horasPorDia"
              className={styles.input}
              type="number"
              min="1"
              max="24"
              step="1"
              placeholder="Ex: 8"
              value={horasPorDia}
              onChange={(e) => setHorasPorDia(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="diasPorSemana">
              {t.daysPerWeek}
            </label>
            <input
              id="diasPorSemana"
              className={styles.input}
              type="number"
              min="1"
              max="7"
              step="1"
              placeholder="Ex: 5"
              value={diasPorSemana}
              onChange={(e) => setDiasPorSemana(e.target.value)}
            />
          </div>
        </div>
      </section>

      {settings.rendaMensal > 0 && (
        <div className={styles.derived}>
          <div className={styles.derivedItem}>
            <span className={styles.derivedLabel}>{t.hourlyRate}</span>
            <span className={styles.derivedValue}>
              {formatCurrency(profile.valorHora)}
            </span>
          </div>
          <div className={styles.derivedItem}>
            <span className={styles.derivedLabel}>{t.hoursPerMonth}</span>
            <span className={styles.derivedValue}>
              {profile.horasMes.toFixed(0)}h
            </span>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>
          {t.save}
        </button>
        <button type="button" className={styles.resetBtn} onClick={onReset}>
          {t.reset}
        </button>
      </div>

      <div className={styles.feedback}>
        {saved && <span className={styles.saved}>{t.savedSuccess}</span>}
      </div>
    </form>
  );
}
