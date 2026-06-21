import type { FootprintResult } from "../lib/types";
import { categoryLabel, formatKg, formatTonnes } from "../lib/format";

interface Props {
  result: FootprintResult;
}

/**
 * Shows the total footprint and a per-category bar chart. The chart is built
 * from semantic markup with text values beside each bar, so it is fully
 * understandable without color or vision (no canvas, no color-only encoding).
 */
export function ResultBreakdown({ result }: Props) {
  const entries = Object.entries(result.breakdown_kg);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  const overTarget = result.comparison.ratio_to_sustainable_target > 1;

  // SVG Donut calculations (R = 80, C = 502.65)
  const R = 80;
  const C = 2 * Math.PI * R;
  // Scale the gauge relative to a maximum reference of 10.0 tonnes
  const maxTonnesRef = 10.0;
  const fillPercent = Math.min(100, (result.total_annual_tonnes / maxTonnesRef) * 100);
  const strokeDashoffset = C - (C * fillPercent) / 100;

  return (
    <section className="card" aria-labelledby="result-heading">
      <h2 id="result-heading">Your estimated footprint</h2>

      {/* SVG Circular Gauge */}
      <div className="gauge-wrapper" aria-hidden="true">
        <svg width="180" height="180" className="gauge-svg">
          <circle cx="90" cy="90" r={R} className="gauge-track" />
          <circle
            cx="90"
            cy="90"
            r={R}
            className={`gauge-fill ${overTarget ? "over-limit" : ""}`}
            strokeDasharray={C}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="gauge-center-text">
          <span className="gauge-value">{formatTonnes(result.total_annual_tonnes)}</span>
          <span className="gauge-unit">CO₂e / Year</span>
          <span className={`gauge-status ${overTarget ? "over" : "under"}`}>
            {overTarget ? "Action Needed ⚠️" : "Sustainable ✅"}
          </span>
        </div>
      </div>

      <div className="visually-hidden">
        <p>
          Your total footprint is {formatTonnes(result.total_annual_tonnes)} CO2e per year.
        </p>
        <span>{formatTonnes(result.total_annual_tonnes)} CO₂e</span>
      </div>

      {/* Comparison Ratio Badges */}
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>vs Sustainable Target</span>
          <strong>{result.comparison.ratio_to_sustainable_target.toFixed(1)}×</strong>
          <span>Target is {formatTonnes(result.comparison.sustainable_target_annual_kg / 1000)}</span>
        </div>
        <div className="comparison-card">
          <span>vs Global Average</span>
          <strong>{result.comparison.ratio_to_global_average.toFixed(1)}×</strong>
          <span>Global Avg is {formatTonnes(4.8)}</span>
        </div>
      </div>

      <h3>Breakdown by category</h3>
      <div
        className="category-bars"
        role="img"
        aria-label="Bar chart of emissions by category, values listed in the table below"
      >
        {entries.map(([key, value]) => (
          <div className="bar-row" key={key}>
            <div className="bar-header">
              <span>{categoryLabel(key)}</span>
              <span>{formatKg(value)}</span>
            </div>
            <div className="bar-track" aria-hidden="true">
              <div className="bar-fill" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Accessible data table equivalent of the chart. */}
      <table className="history">
        <caption className="visually-hidden">Annual emissions by category in kg CO2e</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">kg CO₂e / year</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <th scope="row">{categoryLabel(key)}</th>
              <td>{formatKg(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
