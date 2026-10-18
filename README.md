# Freelan Pricing Calculator

A responsive, mobile-friendly pricing calculator built with HTML, CSS, and JavaScript.

## Overview

The Freelan Pricing Calculator helps calculate and manage GP (Gross Price) and NP (Net Price) values across four pricing stages.

## Features

- **Nadugala Factory** – Add multiple items, enter base prices and percentages, and calculate individual final costs and total costs.
- **Freelan Factory** – Calculate final GP and NP prices using the prices received from Nadugala Factory.
- **Agency** – Calculate Agency GP and NP prices using Freelan's final prices.
- **Shops** – Calculate shop GP and NP prices using Agency's final prices.
- **Automatic Calculations** – Update prices whenever input values change.
- **Percentage-Based Pricing** – Apply separate percentages to GP and NP prices.
- **Responsive Design** – Green-and-white interface designed for desktop and mobile screens.
- **Print / Save as PDF** – Print the pricing calculations or save them as a PDF.

## Technologies Used

- HTML5
- CSS3
- JavaScript

## How to Run

1. Clone or download this repository.
2. Open `freelan_pricing_calculator.html` in a web browser.
3. Enter item prices and percentages in the Nadugala Factory section.
4. Review the calculated GP and NP prices in each subsequent stage.

No installation or database connection is required.

## Calculation Formula

Final Price = Received Price × (1 + Percentage / 100)

Each stage uses the previous stage's final GP and NP prices as its input.

## Project Structure

```text
freelan-pricing-calculator/
├── freelan_pricing_calculator.html
└── README.md
```

## Notes

This project performs calculations locally in the browser. It does not currently store data in a database or provide multi-user access.

## License

This project is intended for learning and demonstration purposes. Add a license if you plan to distribute it publicly.