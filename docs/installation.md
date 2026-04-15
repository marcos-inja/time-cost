# Installation

## Prerequisites

- **From a release zip:** Google Chrome only.
- **From source:** [Node.js](https://nodejs.org/) 18+, npm (included with Node.js), and Google Chrome.

## From GitHub Releases (pre-built)

Each tagged release publishes a zip you can load without cloning or running npm.

1. Open the repository’s **Releases** page on GitHub (for example `https://github.com/marcos-inja/time-cost/releases`).
2. Download the asset named like `time-cost-v1.0.0.zip` for the version you want.
3. Extract the archive. You should get a folder whose **root** contains `manifest.json` (and other built files). If your unzip tool nests an extra folder, use the inner one that has `manifest.json` at the top.
4. In Chrome, go to `chrome://extensions`.
5. Turn on **Developer mode** (top right).
6. Click **Load unpacked** and select that folder (the one containing `manifest.json`).

The extension is ready to use. Updates: download a newer release zip, remove the old extension from `chrome://extensions`, then load the new folder (or replace the folder contents and click **Reload** on the extension card).

> **Note:** Loading an unpacked build from a zip is meant for testers and advanced users. A future Chrome Web Store listing would offer one-click install for everyone.

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
