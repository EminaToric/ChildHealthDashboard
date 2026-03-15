
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, LineChart, Line, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// ── Data (WHO / UNICEF published figures, ~2022) ─────────────────────────────

const REGIONS = [
  "Sub-Saharan Africa",
  "South Asia",
  "East Asia & Pacific",
  "Middle East & N. Africa",
  "Latin America",
  "Europe & Central Asia",
  "North America",
];

const REGION_SHORT = [
  "Sub-Saharan Africa",
  "South Asia",
  "E. Asia & Pacific",
  "Middle East & N. Africa",
  "Latin America",
  "Europe & C. Asia",
  "North America",
];

// Under-5 mortality rate per 1,000 live births
const MORTALITY_DATA = [
  { region: "Sub-Saharan Africa", rate: 74.4, income: "Low", color: "#C4714A" },
  { region: "South Asia", rate: 37.1, income: "Lower-Middle", color: "#D4896A" },
  { region: "E. Asia & Pacific", rate: 13.8, income: "Upper-Middle", color: "#7A8C72" },
  { region: "Middle East & N. Africa", rate: 19.2, income: "Lower-Middle", color: "#B8A898" },
  { region: "Latin America", rate: 14.1, income: "Upper-Middle", color: "#C4908A" },
  { region: "Europe & C. Asia", rate: 8.9, income: "Upper-Middle", color: "#A0B4C8" },
  { region: "North America", rate: 6.2, income: "High", color: "#8A9E88" },
];

// Stunting prevalence (% of children under 5)
const STUNTING_DATA = [
  { region: "Sub-Saharan Africa", rate: 33.5 },
  { region: "South Asia", rate: 31.7 },
  { region: "E. Asia & Pacific", rate: 7.8 },
  { region: "Middle East & N. Africa", rate: 14.2 },
  { region: "Latin America", rate: 9.1 },
  { region: "Europe & C. Asia", rate: 7.1 },
  { region: "North America", rate: 2.6 },
];

// Access to safe drinking water (% of population)
const WATER_DATA = [
  { region: "Sub-Saharan Africa", rate: 46.2 },
  { region: "South Asia", rate: 72.4 },
  { region: "E. Asia & Pacific", rate: 87.3 },
  { region: "Middle East & N. Africa", rate: 81.6 },
  { region: "Latin America", rate: 85.9 },
  { region: "Europe & C. Asia", rate: 94.1 },
  { region: "North America", rate: 98.8 },
];

// Food insecurity (% of population experiencing moderate or severe food insecurity)
const FOOD_DATA = [
  { region: "Sub-Saharan Africa", rate: 57.3 },
  { region: "South Asia", rate: 38.8 },
  { region: "E. Asia & Pacific", rate: 14.2 },
  { region: "Middle East & N. Africa", rate: 28.1 },
  { region: "Latin America", rate: 31.7 },
  { region: "Europe & C. Asia", rate: 8.2 },
  { region: "North America", rate: 8.8 },
];

// Radar: composite scores per region (normalized 0-100, higher = better outcomes)
const RADAR_DATA = REGIONS.map((r, i) => ({
  region: REGION_SHORT[i],
  "Child Survival": Math.round(100 - (MORTALITY_DATA[i].rate / 74.4) * 100),
  "Nutrition": Math.round(100 - (STUNTING_DATA[i].rate / 33.5) * 100),
  "Water Access": Math.round(WATER_DATA[i].rate),
  "Food Security": Math.round(100 - (FOOD_DATA[i].rate / 57.3) * 100),
}));

// Trend data: under-5 mortality globally over time
const TREND_DATA = [
  { year: "2000", "Sub-Saharan Africa": 152, "South Asia": 90, "Global Avg": 77 },
  { year: "2005", "Sub-Saharan Africa": 127, "South Asia": 72, "Global Avg": 63 },
  { year: "2010", "Sub-Saharan Africa": 103, "South Asia": 57, "Global Avg": 50 },
  { year: "2015", "Sub-Saharan Africa": 85, "South Asia": 46, "Global Avg": 41 },
  { year: "2020", "Sub-Saharan Africa": 75, "South Asia": 38, "Global Avg": 37 },
  { year: "2022", "Sub-Saharan Africa": 74, "South Asia": 37, "Global Avg": 36 },
];

// Key insights
const INSIGHTS = [
  {
    icon: "⚠️",
    stat: "13x",
    label: "Mortality gap",
    detail: "A child born in Sub-Saharan Africa is 13 times more likely to die before age 5 than one born in North America."
  },
  {
    icon: "💧",
    stat: "46%",
    label: "Water access",
    detail: "Less than half of Sub-Saharan Africa's population has access to safely managed drinking water, directly driving preventable disease."
  },
  {
    icon: "🌱",
    stat: "1 in 3",
    label: "Children stunted",
    detail: "In Sub-Saharan Africa and South Asia, roughly one in three children under five experiences stunting from chronic malnutrition."
  },
  {
    icon: "📉",
    stat: "53%",
    label: "Progress made",
    detail: "Global under-5 mortality has fallen by over 53% since 2000, proof that targeted intervention works at scale."
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #242018;
    --bg2: #2E2A24;
    --bg3: #38342E;
    --border: rgba(255,255,255,0.07);
    --terra: #C4714A;
    --terra-light: #D4896A;
    --sage: #7A8C72;
    --blush: #C4908A;
    --gold: #C8A96A;
    --sky: #7AA0B8;
    --cream: #F0EBE3;
    --cream-faint: rgba(240,235,227,0.5);
    --cream-ghost: rgba(240,235,227,0.2);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--cream);
    min-height: 100vh;
  }

  .dash {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 2rem 5rem;
  }

  /* ── Header ── */
  .dash-header {
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2rem;
  }

  .dash-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--terra);
    margin-bottom: 0.75rem;
  }

  .dash-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 400;
    line-height: 1.2;
    color: var(--cream);
    margin-bottom: 0.75rem;
  }

  .dash-title em {
    font-style: italic;
    color: var(--terra);
  }

  .dash-subtitle {
    font-size: 0.9rem;
    color: var(--cream-faint);
    max-width: 600px;
    line-height: 1.7;
    margin-bottom: 1.25rem;
  }

  .dash-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .dash-meta-item {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--cream-ghost);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .dash-meta-item span { color: var(--sage); }

  /* ── Insight cards ── */
  .insights-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    margin-bottom: 3rem;
    border: 1px solid var(--border);
  }

  .insight-card {
    background: var(--bg2);
    padding: 1.5rem;
    transition: background 0.2s;
  }

  .insight-card:hover { background: var(--bg3); }

  .insight-icon { font-size: 1.25rem; margin-bottom: 0.75rem; }

  .insight-stat {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--terra);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .insight-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--cream-faint);
    margin-bottom: 0.6rem;
  }

  .insight-detail {
    font-size: 0.78rem;
    color: var(--cream-ghost);
    line-height: 1.6;
  }

  /* ── Tab nav ── */
  .tab-nav {
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }

  .tab-btn {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--cream-faint);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.2s;
  }

  .tab-btn:hover { color: var(--cream); }
  .tab-btn.active { color: var(--terra); border-bottom-color: var(--terra); }

  /* ── Chart containers ── */
  .chart-section {
    margin-bottom: 3rem;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .chart-header {
    margin-bottom: 1.25rem;
  }

  .chart-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--cream);
    margin-bottom: 0.3rem;
  }

  .chart-desc {
    font-size: 0.8rem;
    color: var(--cream-faint);
    line-height: 1.6;
    max-width: 600px;
  }

  .chart-box {
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 1.5rem 1.5rem 0.5rem;
  }

  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* ── Writeup ── */
  .writeup {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-left: 3px solid var(--terra);
    padding: 2rem 2.5rem;
    margin-top: 3rem;
  }

  .writeup-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--terra);
    margin-bottom: 1rem;
  }

  .writeup h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--cream);
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .writeup p {
    font-size: 0.88rem;
    color: var(--cream-faint);
    line-height: 1.85;
    margin-bottom: 1rem;
  }

  .writeup p:last-child { margin-bottom: 0; }

  .writeup strong { color: var(--cream); font-weight: 500; }

  .writeup-findings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .finding {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    background: var(--bg3);
    border: 1px solid var(--border);
  }

  .finding-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--terra);
    line-height: 1;
    flex-shrink: 0;
    width: 2rem;
  }

  .finding p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--cream-faint);
    line-height: 1.7;
  }

  /* ── Source ── */
  .source-bar {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .source-item {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cream-ghost);
  }

  .source-item span { color: var(--sage); }

  /* ── Custom tooltip ── */
  .custom-tooltip {
    background: var(--bg3);
    border: 1px solid var(--border);
    padding: 0.75rem 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .tooltip-label {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cream-faint);
    margin-bottom: 0.3rem;
  }

  .tooltip-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: var(--terra);
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .insights-grid { grid-template-columns: 1fr 1fr; }
    .chart-grid { grid-template-columns: 1fr; }
    .dash { padding: 2rem 1.25rem 4rem; }
    .tab-btn { padding: 0.6rem 0.9rem; font-size: 0.75rem; }
  }
`;

// ── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="tooltip-value" style={{ color: p.color || "#C4714A" }}>
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}{unit}
            <span style={{ fontSize: "0.7rem", color: "rgba(240,235,227,0.5)", marginLeft: "0.3rem" }}>{p.name}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Main Component ────────────────────────────────────────────────────────────

const TABS = ["Overview", "Mortality Trends", "Composite View", "Writeup"];

export default function ChildHealthDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      <style>{styles}</style>
      <div className="dash">

        {/* Header */}
        <div className="dash-header">
          <p className="dash-eyebrow">Global Child Health · WHO / UNICEF Data Analysis</p>
          <h1 className="dash-title">
            Where a child is born<br />
            still determines whether they <em>survive it.</em>
          </h1>
          <p className="dash-subtitle">
            An analysis of child mortality, malnutrition, food insecurity, and water access across seven global regions — examining how geography and income level shape the most fundamental human outcomes.
          </p>
          <div className="dash-meta">
            <span className="dash-meta-item">Data sources <span>WHO · UNICEF · World Bank</span></span>
            <span className="dash-meta-item">Reference year <span>2022</span></span>
            <span className="dash-meta-item">Population <span>Children under 5</span></span>
            <span className="dash-meta-item">Built by <span>Emina Toric</span></span>
          </div>
        </div>

        {/* Insight cards */}
        <div className="insights-grid">
          {INSIGHTS.map((ins, i) => (
            <div key={i} className="insight-card">
              <div className="insight-icon">{ins.icon}</div>
              <div className="insight-stat">{ins.stat}</div>
              <div className="insight-label">{ins.label}</div>
              <p className="insight-detail">{ins.detail}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === "Overview" && (
          <div className="chart-section">
            <div className="chart-grid">

              <div>
                <div className="chart-header">
                  <h3 className="chart-title">Under-5 Mortality Rate</h3>
                  <p className="chart-desc">Deaths per 1,000 live births by region. The gap between Sub-Saharan Africa and high-income regions represents over 68 preventable deaths per thousand births.</p>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={MORTALITY_DATA} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "rgba(240,235,227,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="region" tick={{ fill: "rgba(240,235,227,0.6)", fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip unit=" per 1k" />} />
                      <Bar dataKey="rate" name="Mortality rate" radius={[0, 2, 2, 0]}>
                        {MORTALITY_DATA.map((entry, i) => (
                          <rect key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="chart-header">
                  <h3 className="chart-title">Child Stunting Prevalence</h3>
                  <p className="chart-desc">Percentage of children under 5 with stunted growth due to chronic malnutrition. Stunting has lifelong consequences for cognitive and physical development.</p>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={STUNTING_DATA} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "rgba(240,235,227,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="region" tick={{ fill: "rgba(240,235,227,0.6)", fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip unit="%" />} />
                      <Bar dataKey="rate" name="Stunting rate" fill="#C4908A" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="chart-header">
                  <h3 className="chart-title">Access to Safe Drinking Water</h3>
                  <p className="chart-desc">Percentage of population with access to safely managed drinking water. Unsafe water is one of the leading drivers of child mortality from preventable diarrheal disease.</p>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={WATER_DATA} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "rgba(240,235,227,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="region" tick={{ fill: "rgba(240,235,227,0.6)", fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip unit="%" />} />
                      <Bar dataKey="rate" name="Water access" fill="#7AA0B8" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="chart-header">
                  <h3 className="chart-title">Food Insecurity</h3>
                  <p className="chart-desc">Percentage of population experiencing moderate or severe food insecurity. Food insecurity and stunting track closely, reinforcing cycles of poor development outcomes.</p>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={FOOD_DATA} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "rgba(240,235,227,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="region" tick={{ fill: "rgba(240,235,227,0.6)", fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip unit="%" />} />
                      <Bar dataKey="rate" name="Food insecurity" fill="#C8A96A" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Tab: Mortality Trends ── */}
        {activeTab === "Mortality Trends" && (
          <div className="chart-section">
            <div className="chart-header">
              <h3 className="chart-title">Under-5 Mortality Over Time (2000 to 2022)</h3>
              <p className="chart-desc">Progress is real and measurable. Global under-5 mortality has fallen by more than half since 2000. But the gap between Sub-Saharan Africa and the global average has narrowed far more slowly than the overall trend suggests, meaning the children most at risk are still being left behind.</p>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={TREND_DATA} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: "rgba(240,235,227,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(240,235,227,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} unit="" label={{ value: "per 1,000 births", angle: -90, position: "insideLeft", fill: "rgba(240,235,227,0.3)", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip unit=" per 1k" />} />
                  <Legend wrapperStyle={{ fontSize: "0.8rem", color: "rgba(240,235,227,0.6)", paddingTop: "1rem" }} />
                  <Line type="monotone" dataKey="Sub-Saharan Africa" stroke="#C4714A" strokeWidth={2.5} dot={{ fill: "#C4714A", r: 4 }} />
                  <Line type="monotone" dataKey="South Asia" stroke="#C4908A" strokeWidth={2} dot={{ fill: "#C4908A", r: 4 }} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="Global Avg" stroke="#7A8C72" strokeWidth={2} dot={{ fill: "#7A8C72", r: 4 }} strokeDasharray="6 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Tab: Composite View ── */}
        {activeTab === "Composite View" && (
          <div className="chart-section">
            <div className="chart-header">
              <h3 className="chart-title">Composite Health Outcomes by Region</h3>
              <p className="chart-desc">A normalized view of all four outcome areas together — child survival, nutrition, water access, and food security. Higher scores indicate better outcomes. The shape of each region's profile reveals where the strongest intervention opportunities lie.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {["Sub-Saharan Africa", "South Asia", "E. Asia & Pacific", "North America"].map(region => {
                const d = RADAR_DATA.find(r => r.region === region);
                return (
                  <div key={region} className="chart-box">
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,235,227,0.4)", marginBottom: "0.5rem" }}>{region}</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={[
                        { axis: "Child Survival", value: d["Child Survival"] },
                        { axis: "Nutrition", value: d["Nutrition"] },
                        { axis: "Water Access", value: d["Water Access"] },
                        { axis: "Food Security", value: d["Food Security"] },
                      ]}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(240,235,227,0.5)", fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name={region} dataKey="value" stroke="#C4714A" fill="#C4714A" fillOpacity={0.25} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: Writeup ── */}
        {activeTab === "Writeup" && (
          <div className="chart-section">
            <div className="writeup">
              <p className="writeup-label">Analysis · Emina Toric</p>
              <h2>The geography of survival: what the data says and what it means</h2>

              <p>
                This analysis examines child health outcomes across seven global regions using data from the World Health Organization, UNICEF, and the World Bank. The four indicators — under-5 mortality, stunting prevalence, access to safe drinking water, and food insecurity — were selected because they are both measurable at scale and deeply interconnected. A child experiencing food insecurity is more likely to be stunted. A stunted child has compromised immune function. Compromised immune function combined with unsafe water access is a direct pathway to preventable death.
              </p>

              <p>
                <strong>The core finding is not surprising, but it is important to make explicit:</strong> where a child is born remains the single strongest predictor of whether they survive childhood and develop to their full potential. A child born in Sub-Saharan Africa faces a under-5 mortality rate of 74.4 per 1,000 live births. In North America that figure is 6.2. The 13-fold difference cannot be explained by biology. It is explained by the circumstances into which children are born.
              </p>

              <div className="writeup-findings">
                <div className="finding">
                  <span className="finding-num">01</span>
                  <p><strong>Water access is the most structurally predictive variable.</strong> Regions with water access below 75% showed consistently higher mortality and stunting rates regardless of other factors. This suggests that water infrastructure investment may be the highest-leverage single intervention for child health outcomes in low-access regions.</p>
                </div>
                <div className="finding">
                  <span className="finding-num">02</span>
                  <p><strong>Food insecurity and stunting track almost perfectly across regions.</strong> The correlation between the two indicators suggests that food security interventions are likely to produce downstream reductions in stunting, which in turn reduces mortality risk. These are not independent problems requiring independent solutions.</p>
                </div>
                <div className="finding">
                  <span className="finding-num">03</span>
                  <p><strong>Progress is real, but unevenly distributed.</strong> Global under-5 mortality has fallen by over 53% since 2000, which represents millions of children who survived who would not have in prior decades. However, Sub-Saharan Africa's rate of improvement has lagged the global average, meaning the absolute gap between the most and least vulnerable populations has not closed proportionally to overall progress.</p>
                </div>
                <div className="finding">
                  <span className="finding-num">04</span>
                  <p><strong>The composite radar analysis reveals that no region performs uniformly.</strong> Even high-income regions show relative weaknesses in specific indicators, suggesting that a targeted, multi-factor intervention model outperforms single-indicator approaches in every context.</p>
                </div>
              </div>

              <p>
                The human development framing matters here. These numbers represent children whose cognitive development, physical capacity, and life trajectory are shaped before they turn five. Stunting is not just a nutrition statistic — it is a predictor of educational attainment, economic productivity, and intergenerational poverty. Addressing child health outcomes is not a humanitarian exercise separate from development strategy. It is development strategy.
              </p>

              <p>
                Data sources: WHO Global Health Observatory, UNICEF State of the World's Children 2023, World Bank Development Indicators. All figures reference approximately 2022 unless otherwise noted in trend data.
              </p>
            </div>
          </div>
        )}

        {/* Source bar */}
        <div className="source-bar">
          <span className="source-item">Source <span>WHO Global Health Observatory</span></span>
          <span className="source-item">Source <span>UNICEF SOWC 2023</span></span>
          <span className="source-item">Source <span>World Bank Development Indicators</span></span>
          <span className="source-item">Built by <span>Emina Toric · eminatoric.github.io</span></span>
        </div>

      </div>
    </>
  );
}
