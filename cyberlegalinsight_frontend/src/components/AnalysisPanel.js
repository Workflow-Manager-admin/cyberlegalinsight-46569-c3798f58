import React from "react";

/**
 * AnalysisPanel component
 * Usage:
 *   <AnalysisPanel analysis={{ summary: "...", risks: ..., confidence: ... }} status="complete" />
 *
 * Props:
 *   - analysis: { summary: string, confidence: number, risks: [{label, score, level, highlight}], ... }
 *   - status: "loading" | "complete" | "error"
 */
// PUBLIC_INTERFACE
function AnalysisPanel({ analysis = {}, status = "loading" }) {
  // Simulate content if not provided
  const defaultRisks = [
    { label: "Termination Clause", score: 85, level: "high", highlight: "red" },
    { label: "Data Privacy", score: 60, level: "medium", highlight: "yellow" },
    { label: "Jurisdiction", score: 20, level: "low", highlight: "green" },
  ];

  const summary =
    analysis.summary ||
    "AI Summary: This contract contains moderate risk clauses and potential issues regarding data privacy and termination. Please review highlighted sections.";

  const confidence = typeof analysis.confidence === "number" ? analysis.confidence : 0.93;

  const riskDetails = Array.isArray(analysis.risks) && analysis.risks.length ? analysis.risks : defaultRisks;

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 10,
        background: "rgba(255,255,255,0.01)",
        padding: 18,
        boxShadow: "0 1px 10px #4a90e210",
        minWidth: 300,
        width: "100%",
        maxWidth: 540,
        margin: "0 auto"
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, color: "var(--primary)", marginBottom: 8 }}>
        AI Contract Analysis
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 14 }}>
        {status === "loading"
          ? <span>Analyzing contract... <span className="blinker" aria-hidden style={{ fontWeight: 800 }}>⏳</span></span>
          : status === "error"
            ? <span style={{ color: "var(--accent)" }}>Error performing analysis. Please retry.</span>
            : <span>{summary}</span>
        }
      </div>
      <div style={{ margin: "18px 0 10px 0" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Risk/Clause Assessment:</div>
        <table style={{ width: "100%", fontSize: 13, borderSpacing: 6 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: "var(--text-secondary)", fontWeight: 400 }}>Clause</th>
              <th style={{ textAlign: "center", color: "var(--text-secondary)", fontWeight: 400 }}>Score</th>
              <th style={{ textAlign: "center", color: "var(--text-secondary)", fontWeight: 400 }}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {riskDetails.map(risk => (
              <tr key={risk.label}>
                <td>{risk.label}</td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>{risk.score}</td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      borderRadius: 7,
                      padding: "2px 9px",
                      color: risk.level === "high"
                        ? "#fff"
                        : risk.level === "medium"
                        ? "#111"
                        : "#0c0",
                      background: risk.level === "high"
                        ? "#e87a41"
                        : risk.level === "medium"
                        ? "#fff174"
                        : "#bdecb6",
                      fontWeight: risk.level === "high" ? 700 : 500,
                      fontSize: 13
                    }}
                  >
                    {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
        <span>Model Confidence: <b>{Math.round(confidence * 100)}%</b></span>
        <span style={{ marginLeft: 12, fontStyle: "italic", color: "#ccc" }}>[Simulated]</span>
      </div>
    </div>
  );
}

export default AnalysisPanel;
