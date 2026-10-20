# Pricing Calculate System

A responsive, mobile-friendly pricing calculator and installable Progressive Web App (PWA) built with HTML, CSS, and JavaScript.

## Overview

The Freelan Pricing Calculator helps calculate and manage GP (Gross Price) and NP (Net Price) values across four pricing stages.

## Features

- **Nadugala Factory** – Add multiple items, enter base prices, item percentages and PWeights, calculate percentage Cost amounts, Total Recipes Cost, Cost Add Amount, Adjusted Recipes Cost, GP/NP amounts, and final prices.
- **Freelan Factory** – Calculate final GP and NP prices using the prices received from Nadugala Factory.
- **Agency** – Calculate Agency GP and NP prices using Freelan's final prices.
- **Shops** – Calculate shop GP and NP prices using Agency's final prices.
- **Automatic Calculations** – Update prices whenever input values change.
- **Percentage-Based Pricing** – Apply separate percentages to GP and NP prices.
- **Responsive Design** – Green-and-white interface designed for desktop and mobile screens.
- **Print / Save as PDF** – Print the pricing calculations or save them as a PDF.
- **Installable PWA** – Install the calculator on supported Android, Windows and desktop browsers.

## Technologies Used

- HTML5
- CSS3
- JavaScript

## How to Run

1. Clone or download this repository.
2. Serve the project through `http://localhost` (for example with VS Code Live Server or `npx serve .`). Opening the HTML directly with `file://` does not enable service workers or PWA installation.
3. Open `index.html`.
4. Enter item prices and percentages in the Nadugala Factory section.
5. Review the calculated GP and NP prices in each subsequent stage.

The calculator performs calculations locally in the browser. The service worker only caches the static app shell; it does not cache user data, API responses, login sessions or database data. Offline use is limited to loading the cached app shell, and entered values are not persisted.

## Calculation Formula

Item Cost = Base Price × Add Percentage / 100

Cost Add Amount = Total Recipes Cost × Cost Add Percentage / 100

Adjusted Recipes Cost = Total Recipes Cost + Cost Add Amount

GP/NP Amount = Adjusted Recipes Cost × Percentage / 100

Final Price = Adjusted Recipes Cost + GP/NP Amount

Each downstream stage uses the previous stage's final GP and NP prices as its input. PWeight is recorded per item but does not affect the cost totals.

## Project Structure

```text
freelan-pricing-calculator/
├── index.html
├── freelan_pricing_calculator.css
├── freelan_pricing_calculator.js
├── manifest.webmanifest
├── service-worker.js
├── pricing_calculator_logo.svg
└── icons/
    ├── pricing-calculator-192.png
    └── pricing-calculator-512.png
    
```

## Notes

This project performs calculations locally in the browser. It does not currently store data in a database or provide multi-user access.

## GitHub Pages deployment

The repository is configured as a static project site. Publish the `main` branch from the repository's **Settings → Pages** section. The project-site URL will normally use the repository base path:

```text
https://evminitharushika.github.io/Pricing-Calculate-System/
```

The manifest, service worker and asset paths are relative so they work under that base path. PWA installation requires HTTPS or localhost; a GitHub repository URL by itself is not a live website.

## Installing the app

On Android Chrome or another supported browser, open the deployed HTTPS site and use **Install App** when the browser makes installation available. If the button says **How to install**, use the browser menu and choose **Install app** or **Add to Home screen**.

On Windows Chrome or Edge, open the deployed site and choose **Install** from the address bar or browser menu. The app opens in a standalone window after installation where supported.

## License

This project is intended for learning and demonstration purposes. Add a license if you plan to distribute it publicly.