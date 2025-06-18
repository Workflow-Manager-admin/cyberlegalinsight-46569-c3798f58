import React from "react";
import RiskHighlighter from "./RiskHighlighter";

// PUBLIC_INTERFACE
/**
 * AnalysisStep component
 * Displays AI contract analysis:
 *  - Clause highlighting with simulated GPT labels/types
 *  - Color-coded risks (Red/Yellow/Green)
 *  - Q&A-style summary
 *  - Tip/info privacy box
 *  - GPT-style alert below highlights
 * Modern, theme-aware, and clear UI.
 * 
 * Props:
 *  - contract: { type, content, name? } // From upload step (text or file)
 *  - answers: object // User's answers (for future logic if needed)
 *  - onBack: function
 *  - onNext: function
 */
function AnalysisStep({ contract, answers, onBack, onNext }) {
  // DEMO: Use a mock contract clause for display if none uploaded
  const sampleText = (
    `1. Termination: Either party may terminate this agreement with thirty (30) days written notice. ` +
    `2. Payment Terms: Payment must be made within 60 days of invoice receipt. ` +
    `3. Limitation of Liability: Neither party is liable for indirect damages; total liability is capped. ` +
    `4. Auto-Renewal: This contract will auto-renew annually unless terminated by either party.`
  );

  // Extract text to display (plain string for highlighting)
  let displayText = "";
  if (contract?.type === "text" && typeof contract.content === "string") {
    displayText = contract.content;
  } else if (contract?.type === "file" && contract.content?.name && contract.content?.textContent) {
    // [If file uploading included extracted .textContent. Otherwise fallback:]
    displayText = contract.content.textContent || sampleText;
  } else {
    displayText = sampleText;
  }
  // Highlighting logic: (Simulated clause detection for demo)
  // In real use, parse/generate highlights and labels via backend-AI.
  // For each clause type, find and highlight; assign a risk.
  // Simulated rules for demo:
  const clauses = [
    {
      type: "Termination",
      risk: "high",
      color: "#e87a41",
      riskLabel: "High",
      label: "Termination Clause",
      gptLabel: "⚠️ High-Risk: Lacks specific grounds for termination period",
      find: /(Termination:.*?\.)(\s|$)/i
    },
    {
      type: "Payment",
      risk: "medium",
      color: "#fff174",
      riskLabel: "Moderate",
      label: "Payment Terms",
      gptLabel: "💡 Review payment timing and late penalties",
      find: /(Payment Terms:.*?\.)(\s|$)/i
    },
    {
      type: "Liability",
      risk: "medium",
      color: "#fff174",
      riskLabel: "Moderate",
      label: "Limitation of Liability",
      gptLabel: "🛡️ Review liability cap and indirect damages",
      find: /(Limitation of Liability:.*?\.)(\s|$)/i
    },
    {
      type: "Auto-renewal",
      risk: "low",
      color: "#bdecb6",
      riskLabel: "Safe",
      label: "Auto-Renewal",
      gptLabel: "ℹ️ Auto-renewal present: Remind to review notice window",
      find: /(Auto-Renewal:.*?\.)(\s|$)/i
    }
  ];

  // Compute highlights with their positions and risk mapping
  const highlights = [];
  const clauseSummaries = [];
  clauses.forEach(clause => {
    const match = displayText.match(clause.find);
    if (match && match.index !== undefined) {
      highlights.push({
        start: match.index,
        end: match.index + match[1].length,
        level: clause.risk,
        type: clause.type
      });
      clauseSummaries.push({
        label: clause.label,
        risk: clause.riskLabel,
        riskClass: clause.risk,
        summary: clause.gptLabel
      });
    }
  });

  // For clear demo, ensure order by position
  highlights.sort((a, b) => a.start - b.start);

  // Q&A-style summary: Simulated answers based on clause detection
  const qaSummary = [
    {
      question: "Does the contract specify clear termination terms?",
      answer: highlights.some(h => h.type === "Termination")
        ? "Yes, but the period may need clarification. Termination is allowed with 30 days notice."
        : "Not found. Risk: The contract may lack a defined termination process."
    },
    {
      question: "Are payment terms and timing defined?",
      answer: highlights.some(h => h.type === "Payment")
        ? "Yes, payment must be made within 60 days of invoice. Review for late fees."
        : "Payment terms not detected."
    },
    {
      question: "Is there a limitation of liability clause?",
      answer: highlights.some(h => h.type === "Liability")
        ? "Yes, liability is limited to direct damages and a cap is set."
        : "No liability limitation found. Risk: Uncapped liability possible."
    },
    {
      question: "Is auto-renewal included?",
      answer: highlights.some(h => h.type === "Auto-renewal")
        ? "Yes, contract auto-renews annually unless notice is given."
        : "No auto-renewal detected."
    }
  ];

  // GPT-style alert: Rendered if high/medium risk is detected (simulate, pick one)
  let gptAlert = "";
  if (highlights.some(h => h.type === "Termination")) {
    gptAlert = "This clause lacks a detailed termination period or requirements.";
  } else if (highlights.some(h => h.type === "Liability")) {
    gptAlert = "Liability clause found: Verify if the cap is appropriate.";
  } else {
    gptAlert = "Contract appears standard, but always review with legal counsel.";
  }

  return (
    <div style={{ width: "100%", maxWidth: 650, margin: "0 auto", marginTop: 10 }}>
      {/* Highlighted contract region */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: "var(--primary)", marginBottom: 4 }}>
          AI Contract Clause Highlighting
        </div>
        <RiskHighlighter
          text={displayText}
          highlights={highlights.map(h => ({
            start: h.start,
            end: h.end,
            level: h.level
          }))}
        />
        {/* Render clause badges/labels inline */}
        <div style={{ display: "flex", flexWrap: "wrap", margin: "16px 0 8px 0", gap: 11 }}>
          {clauseSummaries.map(cs => (
            <div
              key={cs.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "6px 14px",
                borderRadius: 13,
                fontWeight: 600,
                background: cs.riskClass === "high"
                  ? "#f58285"
                  : cs.riskClass === "medium"
                  ? "#fff174"
                  : "#bdecb6",
                color: cs.riskClass === "high"
                  ? "#fff"
                  : cs.riskClass === "medium"
                  ? "#222"
                  : "#225d24",
                boxShadow: cs.riskClass === "high"
                  ? "0 0 7px #e87a41"
                  : undefined,
                fontSize: 14,
                border: cs.riskClass === "medium" ? "1.5px dotted #adab2c" : "none",
                marginBottom: 2
              }}
              title={cs.summary}
            >
              <span style={{ fontWeight: 800, fontSize: 14 }}>
                {cs.label}
              </span>
              <span
                style={{
                  background: "#2222",
                  borderRadius: 7,
                  padding: "2px 6px",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#888",
                  marginLeft: 5
                }}
              >
                {cs.risk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GPT-style alert */}
      <div
        style={{
          background: "linear-gradient(98deg, #212a 70%, #2366ed0a 120%)",
          color: "var(--text-color)",
          borderLeft: "5px solid var(--accent)",
          borderRadius: "9px",
          boxShadow: "0 1.5px 8px #e87a4115",
          padding: "13px 18px",
          fontSize: 15,
          fontWeight: 500,
          margin: "0 0 18px 0",
          display: "flex",
          alignItems: "center",
          gap: 9
        }}
      >
        <span
          role="img"
          aria-label="AI Alert"
          style={{
            fontSize: 22,
            filter: "drop-shadow(0 0 3px #F5A62344)"
          }}
        >
          💡
        </span>
        {gptAlert}
      </div>

      {/* Q&A summary */}
      <div
        style={{
          margin: "18px 0 16px 0",
          border: "1.5px solid var(--border-color)",
          borderRadius: 10,
          background: "rgba(255,255,255,0.02)",
          padding: 14,
          boxShadow: "0 1px 10px #4a90e208"
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "var(--primary)",
            marginBottom: 7
          }}
        >
          Q&A Summary
        </div>
        <ul style={{ paddingLeft: 22, margin: 0 }}>
          {qaSummary.map(q => (
            <li key={q.question} style={{ marginBottom: 7 }}>
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>{q.question} </span>
              <br />
              <span style={{ color: "var(--text-color)" }}>{q.answer}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip/info box below everything */}
      <div
        style={{
          borderRadius: 11,
          background: "linear-gradient(98deg, #2227 76%, #2366ed0a 140%)",
          color: "var(--text-color)",
          fontSize: 14.5,
          padding: "12px 17px",
          margin: "10px 0 0 0",
          boxShadow: "0 1.2px 5px #23e3c220",
          position: "relative"
        }}
        aria-label="User Tip"
      >
        <span role="img" aria-label="Shield" style={{ fontSize: 18, marginRight: 7 }}>🛡️</span>
        <span style={{ fontWeight: 600, marginRight: 6 }}>Tip:</span>
        We don’t store your contract. All data is processed securely.
      </div>

      {/* Step navigation buttons */}
      <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-large" style={{ minWidth: 90 }} onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default AnalysisStep;
