# 📊 Alexandria Ocasio-Cortez (AOC) 2024 Campaign Finance Interactive Analyzer

This repository contains an interactive HTML/JS data visualization tool to analyze the Federal Election Commission (FEC) [Schedule B expenditure data for the Alexandria Ocasio-Cortez (AOC) 2024](https://www.fec.gov/data/disbursements/?committee_id=C00639591&two_year_transaction_period=2024&data_type=processed) Congressional campaign.

## Overview
The application processes raw campaign finance CSV data into a JSON file, which is then dynamically visualized using an interactive dashboard. The dashboard provides insights into:
- The total volume of campaign spending.
- A longitudinal breakdown of spending over the reporting period.
- An analysis of the primary spending categories.
- A deep dive into the opaque "OTHER" spending category, detailing specific descriptions and payees.
- An aggregate view of the organizations and individuals receiving the most campaign funds.

## How to View
To use the tool, run a local web server in the repository directory and navigate to `index.html`.
For example:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

Or, alternatively, use the live demo at [http://nsanders.me/where-does-the-money-go/](http://nsanders.me/where-does-the-money-go/)

# Disclosure

This code generated with Google Gemini 3.1 Pro.
