import { useState, useEffect } from "react";
import type { UserSettings, DerivedWorkProfile } from "@/core/types";
import styles from "./SettingsForm.module.css";

interface SettingsFormProps {
  settings: UserSettings;
  profile: DerivedWorkProfile;
  saved: boolean;
  onSave: (updates: Partial<UserSettings>) => Promise<void>;
  onReset: () => Promise<void>;
}

export function SettingsForm({ settings, profile, saved, onSave, onReset }: SettingsFormProps) {
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

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="rendaMensal">
          Renda mensal (R$)
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
          Horas por dia
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
          Dias por semana
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

      {settings.rendaMensal > 0 && (
        <div className={styles.derived}>
          <div className={styles.derivedItem}>
            <span className={styles.derivedLabel}>Valor/hora</span>
            <span className={styles.derivedValue}>
              {formatCurrency(profile.valorHora)}
            </span>
          </div>
          <div className={styles.derivedItem}>
            <span className={styles.derivedLabel}>Horas/mes</span>
            <span className={styles.derivedValue}>
              {profile.horasMes.toFixed(0)}h
            </span>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>
          Salvar
        </button>
        <button type="button" className={styles.resetBtn} onClick={onReset}>
          Resetar
        </button>
      </div>

      {saved && <div className={styles.saved}>Salvo com sucesso!</div>}
    </form>
  );
}
