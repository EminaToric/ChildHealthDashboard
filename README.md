🌍 Global Child Health Equity Dashboard
An interactive data dashboard examining child health outcomes across seven global regions — analyzing how geography and income level shape child survival, nutrition, water access, and food security.
Live Demo: [View Dashboard](https://child-health-dashboard.vercel.app/)

Why I Built This

The data on global child health is publicly available but rarely presented in a way that tells the full story. This project brings together four interconnected indicators — child mortality, stunting, water access, and food insecurity — to show how these factors compound on each other and why where a child is born still determines so much about whether they thrive.
This is the kind of analysis I find most meaningful: using data not just to describe a problem but to understand the life circumstances behind it.

What It Shows

IndicatorSourceCoverageUnder-5 mortality rateWHO Global Health Observatory7 regions, 2000–2022Child stunting prevalenceUNICEF State of the World's Children 20237 regions, ~2022Access to safe drinking waterWorld Bank Development Indicators7 regions, ~2022Food insecurityFAO / World Bank7 regions, ~2022

Dashboard Tabs

Overview — Four interactive bar charts comparing all regions across each health indicator.
Mortality Trends — Line chart tracking under-5 mortality from 2000 to 2022, showing where progress has been made and where the gap remains.
Composite View — Radar charts showing the full health profile of four regions simultaneously, making it easy to see where intervention opportunities are strongest.
Writeup — A four-finding analysis connecting the data back to human development theory and the structural drivers behind the numbers.

Key Findings

A child born in Sub-Saharan Africa is 13 times more likely to die before age 5 than one born in North America — a gap that cannot be explained by biology.
Water access is the most structurally predictive variable. Regions with access below 75% show consistently higher mortality and stunting regardless of other factors.
Food insecurity and stunting track almost perfectly across regions, suggesting they require integrated rather than independent interventions.
Global under-5 mortality has fallen by over 53% since 2000 — proof that targeted intervention works. But Sub-Saharan Africa's progress has lagged the global average.


Tech Stack

React with Vite
Recharts for all data visualizations
CSS-in-JS (no external CSS frameworks)
Deployed on Vercel


Data Sources

WHO Global Health Observatory
UNICEF State of the World's Children 2023
World Bank Development Indicators

All figures reference approximately 2022 unless otherwise noted in trend data.

About
Built by Emina Toric — data professional with a background in computer science, human development, and healthcare analytics.
Portfolio · LinkedIn · GitHub
