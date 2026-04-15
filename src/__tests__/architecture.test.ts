/**
 * Architecture boundary tests.
 *
 * These tests enforce the layer dependency rules defined in AGENTS.md.
 * They use static analysis (reading source files with Node.js fs) to verify
 * that no layer imports from a layer above it in the hierarchy.
 *
 * Dependency order (a layer may only import from layers below it):
 *   core/types → core/* → i18n/ → storage/ → content/ → popup/
 *
 * Run: npm test
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Collect all .ts / .tsx files under src/<layer>/ recursively
function getLayerFiles(layer: string): string[] {
  const layerPath = join(SRC, layer);
  const results: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if ([".ts", ".tsx"].includes(extname(entry)) && !entry.endsWith(".test.ts") && !entry.endsWith(".test.tsx")) {
        results.push(full);
      }
    }
  }

  walk(layerPath);
  return results;
}

// Extract all import paths from a file (both @/ aliases and relative paths)
function getImports(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const importRegex = /from\s+["'](@\/[^"']+|\.\.?\/[^"']+)["']/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

// Check if an import path starts with a forbidden layer prefix
function importsTolayer(importPath: string, targetLayer: string): boolean {
  return importPath.startsWith(`@/${targetLayer}/`) || importPath.startsWith(`@/${targetLayer}`);
}

// Run a boundary check and return human-readable violations
function checkBoundary(sourceLayer: string, forbiddenLayers: string[]): string[] {
  const violations: string[] = [];
  const files = getLayerFiles(sourceLayer);

  for (const file of files) {
    const imports = getImports(file);
    for (const imp of imports) {
      for (const forbidden of forbiddenLayers) {
        if (importsTolayer(imp, forbidden)) {
          const relFile = file.replace(SRC + "/", "src/");
          violations.push(`${relFile} ilegalmente importa "${imp}" (camada proibida: ${forbidden}/)`);
        }
      }
    }
  }

  return violations;
}

describe("Architecture: layer boundaries", () => {
  it("core/types.ts has no internal imports", () => {
    const typesFile = join(SRC, "core/types.ts");
    const imports = getImports(typesFile);
    const internal = imports.filter((i) => i.startsWith("@/"));
    expect(
      internal,
      `core/types.ts must not import any internal module. Found: ${internal.join(", ")}`,
    ).toEqual([]);
  });

  it("core/ does not import from storage/, content/, or popup/", () => {
    // core/ may import from i18n/ (e.g., calculator.ts uses TranslationKeys, priceParser.ts uses CURRENCY_CONFIGS)
    const violations = checkBoundary("core", ["storage", "content", "popup"]);
    expect(violations, violations.join("\n")).toHaveLength(0);
  });

  it("storage/ does not import from content/, popup/, or i18n/", () => {
    const violations = checkBoundary("storage", ["content", "popup", "i18n"]);
    expect(violations, violations.join("\n")).toHaveLength(0);
  });

  it("i18n/ does not import from storage/, content/, or popup/", () => {
    const violations = checkBoundary("i18n", ["storage", "content", "popup"]);
    expect(violations, violations.join("\n")).toHaveLength(0);
  });

  it("content/ does not import from popup/", () => {
    const violations = checkBoundary("content", ["popup"]);
    expect(violations, violations.join("\n")).toHaveLength(0);
  });

  it("popup/ does not import from content/", () => {
    const violations = checkBoundary("popup", ["content"]);
    expect(violations, violations.join("\n")).toHaveLength(0);
  });

  it("background/ does not import from storage/, content/, popup/, or i18n/", () => {
    const violations = checkBoundary("background", ["storage", "content", "popup", "i18n"]);
    expect(violations, violations.join("\n")).toHaveLength(0);
  });
});
