export interface UserSettings {
  rendaMensal: number;
  horasPorDia: number;
  diasPorSemana: number;
  theme: "light" | "dark";
}

export interface TimeBreakdown {
  horas: number;
  dias: number;
  semanas: number;
  meses: number;
  anos: number;
}

export interface DerivedWorkProfile {
  semanasNoMes: number;
  horasMes: number;
  valorHora: number;
}

export interface CalculationStrategy {
  calculate(price: number, settings: UserSettings): TimeBreakdown;
  deriveProfile(settings: UserSettings): DerivedWorkProfile;
}

export interface PriceParser {
  readonly currencySymbol: string;
  detect(text: string): PriceMatch[];
  normalize(raw: string): number;
}

export interface PriceMatch {
  raw: string;
  value: number;
  index: number;
}

export interface SettingsRepository<T> {
  get(): Promise<T>;
  save(settings: Partial<T>): Promise<void>;
  reset(): Promise<void>;
  onChange(callback: (settings: T) => void): void;
}

export const DEFAULT_SETTINGS: UserSettings = {
  rendaMensal: 0,
  horasPorDia: 8,
  diasPorSemana: 5,
  theme: "light",
};

export const WEEKS_PER_MONTH = 4.33;
export const MONTHS_PER_YEAR = 12;
