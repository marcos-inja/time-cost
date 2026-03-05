# User guide

## Configuring the extension

1. Click the Time Cost icon in the Chrome toolbar to open the popup.
2. Enter **monthly income** (in your chosen currency), **hours per day**, and **days per week**.
3. Click **Save**.

When monthly income is greater than zero, the popup shows your **hourly rate** and **hours per month** so you can confirm the values.

## Header controls

In the popup header (next to the theme toggle):

- **Language** — Select UI language (flag + code, e.g. EN, PT). Change anytime.
- **Currency** — Select the currency used for income and price detection (e.g. BRL, USD). Change anytime.
- **Theme** — Toggle between light and dark.

## On websites

After saving your profile, the extension runs on every page you visit:

- **Prices** matching your selected currency are detected and annotated with a **time badge** (e.g. hours of work).
- **Hover** over the badge to see a tooltip with the full breakdown: hours, days, weeks, months, and years.

Prices are recalculated when you change currency or your work profile in the popup.

## Supported currencies and languages

- **14 currencies:** BRL, USD, EUR, GBP, JPY, CNY, KRW, INR, CAD, AUD, CHF, MXN, ARS, TRY. The popup currency dropdown shows the full list.
- **13 languages:** Portuguese (BR), English, Spanish, French, German, Italian, Japanese, Korean, Chinese (Simplified), Russian, Arabic, Hindi, Turkish. The popup language dropdown shows flag and code for each.

## Testing locally

Open `test-page.html` from the project root in Chrome. It contains sample prices you can use to check that the extension detects and annotates correctly and that the tooltip appears on hover.
