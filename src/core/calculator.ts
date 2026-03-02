import {
  type CalculationStrategy,
  type DerivedWorkProfile,
  type TimeBreakdown,
  type UserSettings,
  WEEKS_PER_MONTH,
  MONTHS_PER_YEAR,
} from "./types";

export class SimpleCalculation implements CalculationStrategy {
  deriveProfile(settings: UserSettings): DerivedWorkProfile {
    const semanasNoMes = WEEKS_PER_MONTH;
    const horasMes = settings.horasPorDia * settings.diasPorSemana * semanasNoMes;
    const valorHora = horasMes > 0 ? settings.rendaMensal / horasMes : 0;

    return { semanasNoMes, horasMes, valorHora };
  }

  calculate(price: number, settings: UserSettings): TimeBreakdown {
    const { valorHora, semanasNoMes } = this.deriveProfile(settings);

    if (valorHora <= 0) {
      return { horas: 0, dias: 0, semanas: 0, meses: 0, anos: 0 };
    }

    const horas = price / valorHora;
    const dias = horas / settings.horasPorDia;
    const semanas = dias / settings.diasPorSemana;
    const meses = semanas / semanasNoMes;
    const anos = meses / MONTHS_PER_YEAR;

    return { horas, dias, semanas, meses, anos };
  }
}

export function formatTimeBreakdown(breakdown: TimeBreakdown): string {
  if (breakdown.anos >= 1) return `${breakdown.anos.toFixed(1)} anos`;
  if (breakdown.meses >= 1) return `${breakdown.meses.toFixed(1)} meses`;
  if (breakdown.semanas >= 1) return `${breakdown.semanas.toFixed(1)} sem`;
  if (breakdown.dias >= 1) return `${breakdown.dias.toFixed(1)} dias`;
  return `${breakdown.horas.toFixed(1)}h`;
}

export function formatHours(breakdown: TimeBreakdown): string {
  return `${breakdown.horas.toFixed(1)}h`;
}
