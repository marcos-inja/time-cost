# Development

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR; builds into `dist/` |
| `npm run build` | Type-check and production build into `dist/` |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

## Project structure

```
manifest.json              # Chrome Extension Manifest V3
vite.config.ts             # Vite + CRXJS plugin
vitest.config.ts            # Vitest config
test-page.html             # Manual test page with sample prices
src/
  core/                     # Shared types, calculator, price parsing
  storage/                  # chrome.storage.sync (user settings)
  content/                  # Content script: detector, annotator, tooltip, observer
  popup/                    # React popup UI and hooks
  background/               # Service worker (minimal)
  i18n/                     # Translations and currency configs
  styles/                   # CSS variables (light/dark)
```

- **core** — `types.ts`, `calculator.ts`, `priceParser.ts`; calculation and price normalization.
- **storage** — `userSettingsRepository.ts`; read/write settings.
- **content** — `index.ts` entry; `priceDetector.ts`, `priceAnnotator.ts`, `priceObserver.ts`, `tooltip.ts`; DOM scanning and badges.
- **popup** — React app: `App.tsx`, `SettingsForm`, `ThemeToggle`, `useSettings`, `useTheme`.
- **background** — Minimal service worker.
- **i18n** — `translations.ts`, `currencies.ts`, `index.ts`; languages and currency configs.

## Tech stack

- **TypeScript** (strict mode)
- **Vite** + `@crxjs/vite-plugin` (HMR for extensions)
- **React 18** (popup)
- **Vanilla TypeScript** (content script)
- **Shadow DOM** (tooltip CSS isolation)
- **CSS Modules** (popup styles)
- **Vitest** (unit tests)
- **Chrome Manifest V3**

## Architecture and patterns

| Pattern | Where | Purpose |
|---------|-------|---------|
| Strategy | `core/calculator.ts` | Calculation strategies |
| Repository | `storage/userSettingsRepository.ts` | Abstracts `chrome.storage.sync` |
| Observer | `content/priceObserver.ts` | DOM changes via `MutationObserver` |
| Factory | `core/priceParser.ts` | Parser per currency |
| Builder | `content/tooltip.ts` | Tooltip built with Shadow DOM |
| Singleton | Content script settings flow | Single source of settings in content script |
| Adapter | `BrlPriceParser.normalize` (and other parsers) | Normalize price strings to numbers |
