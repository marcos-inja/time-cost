import { describe, it, expect } from "vitest";
import { SimpleCalculation, formatTimeBreakdown, formatHours } from "./calculator";
import type { UserSettings, TimeBreakdown } from "./types";
import { getTranslation } from "@/i18n";

const t = getTranslation("pt-BR");

const baseSettings: UserSettings = {
  rendaMensal: 5000,
  horasPorDia: 8,
  diasPorSemana: 5,
  theme: "light",
  currency: "BRL",
  language: "pt-BR",
};

describe("SimpleCalculation", () => {
  const calc = new SimpleCalculation();

  describe("deriveProfile", () => {
    it("should calculate correct hourly rate", () => {
      const profile = calc.deriveProfile(baseSettings);
      expect(profile.semanasNoMes).toBe(4.33);
      expect(profile.horasMes).toBeCloseTo(173.2, 1);
      expect(profile.valorHora).toBeCloseTo(28.87, 1);
    });

    it("should return zero hourly rate when income is zero", () => {
      const profile = calc.deriveProfile({ ...baseSettings, rendaMensal: 0 });
      expect(profile.valorHora).toBe(0);
    });

    it("should handle different work schedules", () => {
      const partTime: UserSettings = {
        ...baseSettings,
        horasPorDia: 4,
        diasPorSemana: 3,
      };
      const profile = calc.deriveProfile(partTime);
      expect(profile.horasMes).toBeCloseTo(51.96, 1);
      expect(profile.valorHora).toBeCloseTo(96.23, 1);
    });
  });

  describe("calculate", () => {
    it("should convert price to correct time breakdown", () => {
      const result = calc.calculate(1732, baseSettings);
      expect(result.horas).toBeCloseTo(59.99, 0);
      expect(result.dias).toBeCloseTo(7.5, 1);
      expect(result.semanas).toBeCloseTo(1.5, 1);
      expect(result.meses).toBeCloseTo(0.35, 1);
      expect(result.anos).toBeCloseTo(0.029, 2);
    });

    it("should return zeros when hourly rate is zero", () => {
      const result = calc.calculate(100, { ...baseSettings, rendaMensal: 0 });
      expect(result.horas).toBe(0);
      expect(result.dias).toBe(0);
      expect(result.semanas).toBe(0);
      expect(result.meses).toBe(0);
      expect(result.anos).toBe(0);
    });

    it("should handle exact one month salary", () => {
      const result = calc.calculate(5000, baseSettings);
      expect(result.meses).toBeCloseTo(1, 0);
    });

    it("should respect custom hours per day for day calculation", () => {
      const settings: UserSettings = { ...baseSettings, horasPorDia: 6 };
      const profile = calc.deriveProfile(settings);
      const result = calc.calculate(profile.valorHora * 12, settings);
      expect(result.horas).toBeCloseTo(12, 0);
      expect(result.dias).toBeCloseTo(2, 0);
    });
  });
});

describe("formatTimeBreakdown", () => {
  it("should format as hours for small values", () => {
    const b: TimeBreakdown = { horas: 0.5, dias: 0.06, semanas: 0.01, meses: 0.003, anos: 0.0002 };
    expect(formatTimeBreakdown(b, t)).toBe("0.5h");
  });

  it("should format as days when >= 1 day", () => {
    const b: TimeBreakdown = { horas: 16, dias: 2, semanas: 0.4, meses: 0.09, anos: 0.008 };
    expect(formatTimeBreakdown(b, t)).toBe("2.0 dias");
  });

  it("should format as weeks when >= 1 week", () => {
    const b: TimeBreakdown = { horas: 80, dias: 10, semanas: 2, meses: 0.46, anos: 0.04 };
    expect(formatTimeBreakdown(b, t)).toBe("2.0 sem");
  });

  it("should format as months when >= 1 month", () => {
    const b: TimeBreakdown = { horas: 346, dias: 43, semanas: 8.7, meses: 2, anos: 0.17 };
    expect(formatTimeBreakdown(b, t)).toBe("2.0 meses");
  });

  it("should format as years when >= 1 year", () => {
    const b: TimeBreakdown = { horas: 2078, dias: 260, semanas: 52, meses: 12, anos: 1 };
    expect(formatTimeBreakdown(b, t)).toBe("1.0 anos");
  });
});

describe("formatHours", () => {
  it("should always format as hours", () => {
    const b: TimeBreakdown = { horas: 173.2, dias: 21.65, semanas: 4.33, meses: 1, anos: 0.08 };
    expect(formatHours(b)).toBe("173.2h");
  });
});
