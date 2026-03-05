# Installation

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (included with Node.js)
- Google Chrome

## From source

```bash
git clone <repo-url> time-cost
cd time-cost
npm install
```

For development with hot reload:

```bash
npm run dev
```

For a production build:

```bash
npm run build
```

Both commands produce the extension in the `dist/` folder.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select the project’s `dist/` folder.

The extension is loaded and active. With `npm run dev`, code changes are picked up automatically (you may need to reload the extension or the page).

## Production build

Run `npm run build`. The `dist/` folder contains the extension ready for distribution or the Chrome Web Store.

## Manual testing

The project root includes `test-page.html`, a simple HTML page with sample prices. Open it in Chrome (with the extension loaded) to verify detection and tooltips without visiting external sites.
