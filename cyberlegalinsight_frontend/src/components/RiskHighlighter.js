import React from "react";

/**
 * RiskHighlighter component
 * Usage:
 *   <RiskHighlighter text="..." highlights={[{start:0,end:14,level:'high'},...]} />
 *
 * Props:
 *   - text: The contract or legal string to display
 *   - highlights: [{ start, end, level }] positions and risk level, where level is 'low'|'medium'|'high'
 *
 * NOTE: This is visual only, highlight info must be pre-computed and passed as prop.
 */
// PUBLIC_INTERFACE
function RiskHighlighter({ text = "", highlights = [] }) {
  if (!text) return null;

  // Sort and merge highlights for coverage
  const processed = [...(highlights || [])]
    .sort((a, b) => a.start - b.start)
    .filter(h => h.end > h.start && (h.level === "low" || h.level === "medium" || h.level === "high"));

  const colored = [];
  let curr = 0;

  for (let i = 0; i < processed.length; i++) {
    const { start, end, level } = processed[i];
    if (curr < start) {
      colored.push({
        part: text.slice(curr, start),
        level: null,
        idx: `plain_${curr}_${start}`
      });
    }
    colored.push({
      part: text.slice(start, end),
      level,
      idx: `hl_${start}_${end}`
    });
    curr = end;
  }
  if (curr < text.length) {
    colored.push({
      part: text.slice(curr),
      level: null,
      idx: `plain_${curr}_${text.length}`
    });
  }

  // Highlight color map
  const riskColor = {
    high: "#f58285",
    medium: "#fff174",
    low: "#bdecb6"
  };
  const riskFg = {
    high: "#fff",
    medium: "#222",
    low: "#225d24"
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        padding: 14,
        marginTop: 8,
        whiteSpace: "pre-wrap",
        fontFamily: "Inter, 'Roboto', 'Segoe UI', Arial, sans-serif",
        fontSize: 15,
        minHeight: 80,
        letterSpacing: 0.01,
        lineHeight: 1.6,
        boxShadow: "0 2px 10px #4A90E212"
      }}
      aria-label="Contract text with highlighted risk"
    >
      {colored.map(seg =>
        seg.level ? (
          <span
            key={seg.idx}
            style={{
              background: riskColor[seg.level] || "#bdecb6",
              color: riskFg[seg.level] || "#000",
              borderRadius: 6,
              padding: "2px 5px",
              margin: "0 1px",
              fontWeight: 600,
              boxShadow: seg.level === "high" ? "0 0 5px #e87a41" : undefined,
              border: seg.level === "medium" ? "1px dotted #adab2c" : "none",
              transition: "background 0.3s"
            }}
            title={`Risk level: ${seg.level}`}
          >
            {seg.part}
          </span>
        ) : (
          <span key={seg.idx}>{seg.part}</span>
        )
      )}
    </div>
  );
}

export default RiskHighlighter;
