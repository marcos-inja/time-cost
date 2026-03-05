export interface TranslationKeys {
  // Popup UI
  loading: string;
  subtitle: string;
  settings: string;
  monthlyIncome: string;
  hoursPerDay: string;
  daysPerWeek: string;
  hourlyRate: string;
  hoursPerMonth: string;
  save: string;
  reset: string;
  savedSuccess: string;
  currency: string;
  language: string;

  // Theme
  switchToLight: string;
  switchToDark: string;
  lightTheme: string;
  darkTheme: string;

  // Time unit labels (tooltip rows)
  hours: string;
  days: string;
  weeks: string;
  months: string;
  years: string;

  // Time unit suffixes (badge text)
  hoursShort: string;
  daysShort: string;
  weeksShort: string;
  monthsShort: string;
  yearsShort: string;
}

export const translations: Record<string, TranslationKeys> = {
  "pt-BR": {
    loading: "Carregando...",
    subtitle: "Quanto custa em tempo de vida?",
    settings: "Configuração",
    monthlyIncome: "Renda mensal",
    hoursPerDay: "Horas por dia",
    daysPerWeek: "Dias por semana",
    hourlyRate: "Valor/hora",
    hoursPerMonth: "Horas/mês",
    save: "Salvar",
    reset: "Resetar",
    savedSuccess: "Salvo com sucesso!",
    currency: "Moeda",
    language: "Idioma",
    switchToLight: "Mudar para tema claro",
    switchToDark: "Mudar para tema escuro",
    lightTheme: "Tema claro",
    darkTheme: "Tema escuro",
    hours: "Horas",
    days: "Dias",
    weeks: "Semanas",
    months: "Meses",
    years: "Anos",
    hoursShort: "h",
    daysShort: "dias",
    weeksShort: "sem",
    monthsShort: "meses",
    yearsShort: "anos",
  },

  en: {
    loading: "Loading...",
    subtitle: "What does it cost in life time?",
    settings: "Settings",
    monthlyIncome: "Monthly income",
    hoursPerDay: "Hours per day",
    daysPerWeek: "Days per week",
    hourlyRate: "Hourly rate",
    hoursPerMonth: "Hours/month",
    save: "Save",
    reset: "Reset",
    savedSuccess: "Saved successfully!",
    currency: "Currency",
    language: "Language",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    hours: "Hours",
    days: "Days",
    weeks: "Weeks",
    months: "Months",
    years: "Years",
    hoursShort: "h",
    daysShort: "days",
    weeksShort: "wks",
    monthsShort: "mo",
    yearsShort: "yrs",
  },

  es: {
    loading: "Cargando...",
    subtitle: "¿Cuánto cuesta en tiempo de vida?",
    settings: "Configuración",
    monthlyIncome: "Ingreso mensual",
    hoursPerDay: "Horas por día",
    daysPerWeek: "Días por semana",
    hourlyRate: "Valor/hora",
    hoursPerMonth: "Horas/mes",
    save: "Guardar",
    reset: "Restablecer",
    savedSuccess: "¡Guardado con éxito!",
    currency: "Moneda",
    language: "Idioma",
    switchToLight: "Cambiar a tema claro",
    switchToDark: "Cambiar a tema oscuro",
    lightTheme: "Tema claro",
    darkTheme: "Tema oscuro",
    hours: "Horas",
    days: "Días",
    weeks: "Semanas",
    months: "Meses",
    years: "Años",
    hoursShort: "h",
    daysShort: "días",
    weeksShort: "sem",
    monthsShort: "meses",
    yearsShort: "años",
  },
};
