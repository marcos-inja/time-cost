# Time Cost

Chrome extension that turns prices into working time (hours, days) on any webpage.

## Features

- See time cost next to prices as you browse (badge + hover tooltip with hours, days, weeks, months, years)
- 14 currencies (BRL, USD, EUR, GBP, JPY, CNY, KRW, INR, CAD, AUD, CHF, MXN, ARS, TRY)
- 13 languages for the extension UI
- Light/dark theme

## Quick start

**Prerequisites:** [Node.js](https://nodejs.org/) 18+, Google Chrome.

```bash
git clone <repo-url> time-cost
cd time-cost
npm install
npm run dev
```

Then open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select the `dist/` folder.

## Usage

1. Click the extension icon and open the popup.
2. Set **monthly income**, **hours per day**, and **days per week**, then click **Save**.
3. Browse any site — prices are annotated with a time badge; hover for the full breakdown.

Example: with R$ 5,000/month, 8 h/day, 5 days/week, a R$ 1,500 item shows about 52 hours of work.

## Documentation

For installation details, user guide, and development, see **[Documentation](docs/README.md)**.

## Development

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start dev server with HMR; output in `dist/` |
| `npm run build`      | Production build into `dist/`                |
| `npm test`           | Run tests once                               |
| `npm run test:watch` | Run tests in watch mode                      |
