import { CalculatorForm } from "./components/CalculatorForm";
import { ResultBreakdown } from "./components/ResultBreakdown";
import { InsightsPanel } from "./components/InsightsPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { useFootprint } from "./hooks/useFootprint";

const WelcomePlaceholder = () => (
  <div className="welcome-placeholder card" style={{ animation: "fadeIn 0.5s ease-out" }}>
    <div className="welcome-logo">🌱</div>
    <h3>Welcome to Cintrack</h3>
    <p>
      Understanding your carbon footprint is the first step toward a sustainable future. 
      Complete the questionnaire on the left to analyze your transport, home energy, and diet impact.
    </p>
  </div>
);

/**
 * Application shell: composes the calculator, results, insights, and history
 * panels around the `useFootprint` hook, which owns all async state.
 */
export default function App() {
  const { result, insights, entries, loading, saving, error, status, calculate, save } =
    useFootprint();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="app-header">
        <div className="header-brand">
          <h1>Cintrack</h1>
        </div>
        <p>Understand, track, and reduce your carbon footprint.</p>
      </header>

      <main id="main">
        {/* Left Column: Form Inputs */}
        <div className="left-column">
          <CalculatorForm onSubmit={calculate} loading={loading} />
        </div>

        {/* Right Column: Dynamic Results, Insights, and History */}
        <div className="right-column results-container">
          <div role="alert" aria-live="assertive">
            {error && <p className="error">{error}</p>}
          </div>
          <p role="status" className="visually-hidden">
            {status}
          </p>

          {result ? (
            <>
              <ResultBreakdown result={result} />
              {insights && <InsightsPanel insights={insights} />}
              <div className="card" style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="btn secondary"
                  style={{ width: "100%" }}
                  onClick={save}
                  disabled={saving}
                  aria-busy={saving}
                  aria-label="Save this entry to my history"
                >
                  {saving ? "Logging…" : "Log Data"}
                </button>
              </div>
            </>
          ) : (
            <WelcomePlaceholder />
          )}

          <HistoryPanel entries={entries} />
        </div>
      </main>
    </>
  );
}
