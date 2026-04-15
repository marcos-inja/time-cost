# AGENTS.md — Time Cost (Chrome Extension)

> Universal guide for AI coding agents (Claude Code, Cursor, GitHub Copilot, OpenAI Codex, etc.).
> Read this file before making any changes to the codebase.

---

## Project Identity

- **Type:** Chrome Extension (Manifest V3)
- **Purpose:** Converts prices on any webpage into working time equivalents (hours, days, weeks, months, years)
- **Stack:** React 18 · TypeScript 5.7 (strict) · Vite 5 · @crxjs/vite-plugin · Vitest 2
- **Alias:** `@/` resolves to `src/` (configured in both `tsconfig.json` and `vitest.config.ts`)

---

## Layer Architecture

Dependencies must only flow **downward**. A layer may only import from layers below it.

```
1. src/core/types.ts          — Pure interfaces and constants. NO internal imports whatsoever.
2. src/core/calculator.ts     — Business logic. Imports: core/types, i18n/translations (type only)
3. src/core/priceParser.ts    — Price parsing. Imports: core/types, i18n/currencies
4. src/i18n/                  — Translations + currency configs. Imports: core/types (optional)
5. src/storage/               — chrome.storage.sync abstraction. Imports: core/types
6. src/content/               — Content script (DOM). Imports: core/, i18n/, storage/
7. src/popup/                 — React popup UI. Imports: core/, i18n/, storage/
8. src/background/            — Service worker (minimal). Imports: core/types only
```

### Forbidden Imports (violations caught by `src/__tests__/architecture.test.ts`)

| Layer | Must NOT import from |
|---|---|
| `core/` | `storage/`, `content/`, `popup/` |
| `storage/` | `content/`, `popup/`, `i18n/` |
| `i18n/` | `storage/`, `content/`, `popup/` |
| `content/` | `popup/` |
| `popup/` | `content/` |
| `background/` | `storage/`, `content/`, `popup/`, `i18n/` |

---

## Naming Conventions

### Intentional Portuguese field names — DO NOT rename

These are internal domain names, not a localization bug:

```
rendaMensal   horasPorDia   diasPorSemana
horas         dias          semanas       meses    anos
semanasNoMes  horasMes      valorHora
```

UI-facing strings are handled via the `i18n/` layer and translated to the user's language.

### General conventions

- Files: `camelCase.ts` for modules, `PascalCase.tsx` for React components
- Tests: `foo.ts` → `foo.test.ts`, placed beside the source file
- Classes: PascalCase · Interfaces: PascalCase · Constants: `SCREAMING_SNAKE_CASE`
- No barrel `index.ts` re-exports inside layers — import directly from the file

---

## Build & Development Commands

```bash
npm run dev           # Vite dev server with HMR → dist/ (for extension development)
npm run build         # Type-check + production build → dist/
npm test              # Run all tests once (Vitest)
npm run test:watch    # Vitest in watch mode
npm run test:coverage # Run tests with V8 coverage (thresholds enforced)
npm run lint          # ESLint across src/
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # tsc --noEmit (type-check without emitting)
npm run validate      # Full gate: typecheck → lint → test (fail-fast order)
```

**Always run `npm run validate` before finishing a task.**

---

## Design Patterns

| Pattern | Where | Notes |
|---|---|---|
| Strategy | `src/core/calculator.ts` | `SimpleCalculation implements CalculationStrategy` |
| Factory | `src/core/priceParser.ts` | `PriceParserFactory.getParser(currency)` |
| Repository | `src/storage/userSettingsRepository.ts` | Wraps `chrome.storage.sync` |
| Observer | `src/content/priceObserver.ts` | Debounced `MutationObserver` |
| Builder | `src/content/tooltip.ts` | Constructs Shadow DOM tooltip |
| Adapter | Individual parser `normalize()` methods | Converts price strings → numbers |

---

## Known Pitfalls for AI Agents

1. **`@crxjs/vite-plugin` manages the manifest.** Do not add entry points to `vite.config.ts` manually — the plugin reads `manifest.json` directly and handles bundling.

2. **Content script cannot access `chrome.storage` directly.** Settings are read once at the top of `src/content/index.ts` and passed down. Do not call `chrome.storage` from inside `priceAnnotator.ts`, `tooltip.ts`, etc.

3. **Shadow DOM in `tooltip.ts` is intentional.** It isolates tooltip CSS from the host page styles. Do not flatten it into the main DOM.

4. **`normalizePrice()` in `priceParser.ts` handles ambiguous formats.** The function distinguishes between BRL (`1.299,50`) and US (`5,399.00`) formats using heuristics. Read the comments and tests before modifying — the logic is non-obvious.

5. **Background service worker must stay minimal.** MV3 service workers are ephemeral (killed when idle). Do not store state there. `src/background/serviceWorker.ts` should only set up listeners.

6. **Architectural boundaries are tested.** `src/__tests__/architecture.test.ts` uses static analysis (reading source files) to enforce layer rules. If you see a test like `"core/ does not import from storage/"`, it is a structural constraint — fix the import, not the test.

7. **CSS in tests.** Files imported with `?inline` query (e.g., `tooltip.css?inline`) must be mocked in tests: `vi.mock("./tooltip.css?inline", () => ({ default: "" }))`.

8. **`globals: true` in vitest.** No need to import `describe`, `it`, `expect` — they are global in test files.

---

## Testing Conventions

- Test files live beside source: `src/core/calculator.ts` → `src/core/calculator.test.ts`
- Structural/architecture tests live in `src/__tests__/`
- Chrome APIs (`chrome.storage`, etc.) are mocked with `vi.stubGlobal` per test file
- Environment: jsdom (see `vitest.config.ts`)
- Coverage excludes entry points (`popup/main.tsx`, `content/index.ts`, `background/serviceWorker.ts`) — they are Chrome API glue with no testable logic

---

## Adding New Currencies

1. Add config to `src/i18n/currencies.ts` (symbol, regex, locale)
2. Add a parser class in `src/core/priceParser.ts` following the existing pattern
3. Register it in `PriceParserFactory`'s parsers map
4. Add tests in `src/core/priceParser.test.ts`

## Adding New Languages

1. Add translation object in `src/i18n/translations.ts`
2. Add to the `TRANSLATIONS` map keyed by BCP-47 locale code
3. Add tests in `src/i18n/translations.test.ts`
