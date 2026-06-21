import type { Entry } from "../lib/types";
import { formatDate, formatTonnes } from "../lib/format";

interface Props {
  entries: Entry[];
}

/** Tracking history: shows past footprint snapshots so users see their trend. */
export function HistoryPanel({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <section className="card" aria-labelledby="history-heading">
        <h2 id="history-heading">Your history</h2>
        <p>No saved entries yet. Calculate and save a footprint to start tracking your progress.</p>
      </section>
    );
  }

  const latest = entries[0].result.total_annual_tonnes;
  const previous = entries.length > 1 ? entries[1].result.total_annual_tonnes : null;
  const trend = previous === null ? null : latest - previous;

  // Calculate Stats
  const totalCalculations = entries.length;
  const avgFootprint = entries.reduce((sum, e) => sum + e.result.total_annual_tonnes, 0) / totalCalculations;
  const bestFootprint = Math.min(...entries.map((e) => e.result.total_annual_tonnes));

  // Graph Calculations (Chronological order)
  const chronological = [...entries].reverse();
  const W = 500;
  const H = 60;
  const pad = 8;
  const values = chronological.map((e) => e.result.total_annual_tonnes);
  const maxVal = Math.max(...values, 2.0); // Show at least sustainable target
  const minVal = Math.min(...values, 0); // Ground at 0 or min
  const range = maxVal - minVal || 1;

  const getX = (idx: number) => {
    if (values.length <= 1) return W / 2;
    return (idx / (values.length - 1)) * (W - 2 * pad) + pad;
  };

  const getY = (val: number) => {
    return H - pad - ((val - minVal) / range) * (H - 2 * pad);
  };

  const pathData = values
    .map((val, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(val)}`)
    .join(" ");

  return (
    <section className="card" aria-labelledby="history-heading">
      <h2 id="history-heading">Your history</h2>

      {/* History Stats Cards */}
      <div className="history-stats-grid">
        <div className="history-stat-card">
          <span>Entries</span>
          <strong>{totalCalculations}</strong>
        </div>
        <div className="history-stat-card">
          <span>Average</span>
          <strong>{formatTonnes(avgFootprint)}</strong>
        </div>
        <div className="history-stat-card">
          <span>Best Result</span>
          <strong>{formatTonnes(bestFootprint)}</strong>
        </div>
      </div>

      {/* Sparkline Trend Graph */}
      {values.length >= 2 ? (
        <div className="sparkline-wrapper" aria-hidden="true">
          <div className="sparkline-title">Carbon Trend (t CO₂e/yr)</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="sparkline-svg">
            <path d={pathData} className="sparkline-path" />
            <g className="sparkline-dots">
              {values.map((val, idx) => (
                <circle
                  key={idx}
                  cx={getX(idx)}
                  cy={getY(idx === values.length - 1 ? latest : val)}
                  r="4"
                  title={`Entry ${idx + 1}: ${formatTonnes(val)} t`}
                />
              ))}
            </g>
          </svg>
        </div>
      ) : (
        <div
          className="sparkline-wrapper"
          style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}
        >
          Save another entry to unlock your carbon trend graph.
        </div>
      )}

      {trend !== null && (
        <p aria-live="polite" style={{ marginBottom: "1rem" }}>
          {trend < 0 ? (
            <span className="under" style={{ fontWeight: 700 }}>
              ▼ Down {formatTonnes(Math.abs(trend))} since your last entry.
            </span>
          ) : trend > 0 ? (
            <span className="over" style={{ fontWeight: 700 }}>
              ▲ Up {formatTonnes(trend)} since your last entry.
            </span>
          ) : (
            <span>No change since your last entry.</span>
          )}
        </p>
      )}

      <table className="history">
        <caption className="visually-hidden">Saved footprint entries, newest first</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Total (t CO₂e / year)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <th scope="row">{formatDate(e.created_at)}</th>
              <td>{formatTonnes(e.result.total_annual_tonnes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
