import React from "react";

/**
 * Dashboard component
 * Usage:
 *   <Dashboard
 *      scores={{ legal: 72, cyber: 40 }}
 *      userName="Alice"
 *      analysisSummary="..." // AI analysis text
 *      riskStats={...}       // clause/risk array
 *   />
 *
 * Props:
 *   - scores: { legal: number, cyber: number }
 *   - userName: string (optional)
 *   - analysisSummary: string
 *   - riskStats: array of { label, score, level }
 *   - children: (optional) additional dashboard panels
 */
import ReportExport from "./ReportExport";

// Tiny SVG Pie Chart for Risk Distribution
function RiskPieChart({ data = [] }) {
  // Expects data as [{level: "high"/"medium"/"low", value: int}]
  const colors = { high: "#e87a41", medium: "#fff174", low: "#bdecb6" };
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  let acc = 0;
  const arcs = data.map((d, i) => {
    const start = acc / total;
    acc += d.value;
    const end = acc / total;
    const x1 = 50 + 48 * Math.cos(2 * Math.PI * start - Math.PI/2);
    const y1 = 50 + 48 * Math.sin(2 * Math.PI * start - Math.PI/2);
    const x2 = 50 + 48 * Math.cos(2 * Math.PI * end - Math.PI/2);
    const y2 = 50 + 48 * Math.sin(2 * Math.PI * end - Math.PI/2);
    const large = end - start > 0.5 ? 1 : 0;
    const path = `M50,50 L${x1},${y1} A48,48 0 ${large} 1 ${x2},${y2} Z`;
    return (
      <path key={i} d={path} fill={colors[d.level] || "#eee"}>
        <title>{d.level}: {d.value}</title>
      </path>
    );
  });
  return (
    <svg width="100" height="100" style={{marginRight:12}}>
      <circle cx={50} cy={50} r={48} fill="#d6daf0" />
      {arcs}
      <circle cx={50} cy={50} r={30} fill="#fff" />
      <text x={50} y={56} textAnchor="middle" fontWeight="bold" fill="#4A90E2" fontSize={18}>
        {total}
      </text>
    </svg>
  );
}

// PUBLIC_INTERFACE
function Dashboard({
  scores = { legal: 0, cyber: 0 },
  userName = "",
  analysisSummary = "",
  riskStats = [],
  children
}) {
  // Mock risk distribution for pie chart
  const riskDist = riskStats && riskStats.length
    ? ["high", "medium", "low"].map(level => ({
        level,
        value: riskStats.filter(r => r.level === level).length
      }))
    : [
        { level: "high", value: 2 },
        { level: "medium", value: 1 },
        { level: "low", value: 1 }
      ];

  // Mocked chart for scores: simple horizontal bar
  function ScoreBar({ label, value, color }) {
    return (
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</div>
        <div style={{
          background: "#f4f4f8",
          borderRadius: 12,
          height: 18,
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${Math.max(Math.min(value,100),0)}%`,
            background: color,
            height: "100%",
            borderRadius: 12,
            transition: "width 0.6s"
          }} />
          <span style={{
            position: "absolute",
            right: 8, top: 2, fontSize: 13, fontWeight: 600, color: "#222"
          }}>{value}</span>
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2>Analysis Dashboard</h2>
      <div style={{ marginBottom: 16, color: "var(--text-secondary)" }}>
        {userName ? <>Welcome <b>{userName}</b>. </> : null}
        Here are your contract/legal and cyber safety stats:
      </div>
      <div style={{
        display: "flex",
        gap: 34,
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap"
      }}>
        <div>
          <ScoreBar
            label="Legal Risk Score"
            value={scores.legal}
            color="var(--accent)"
          />
          <ScoreBar
            label="Cyber Safety Score"
            value={scores.cyber}
            color="var(--primary)"
          />
        </div>
        <div style={{display:"flex",alignItems:"center"}}>
          <RiskPieChart data={riskDist} />
          <div>
            {riskDist.map(r =>
              <div key={r.level} style={{
                display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 2
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%", display: "inline-block",
                  background: r.level === "high" ? "#e87a41" : r.level === "medium" ? "#fff174" : "#bdecb6"
                }}/>
                <span style={{
                  color: "var(--text-secondary)"
                }}>{r.level.charAt(0).toUpperCase() + r.level.slice(1)} Risk</span> ({r.value})
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 18, color: "#212", fontSize: 15, background: "#f5fafd14", borderRadius: 7, padding: 12 }}>
        <b>AI Summary:</b> {analysisSummary
          || "This contract features moderate risk, with key issues in Data Privacy and high-risk in Termination clauses. Cyber safety is also below average."}
      </div>
      {children ? <div>{children}</div> : null}
      {/* Export/Download Section */}
      <div style={{
        marginTop: 18,
        padding: 10,
        background: "#f3f5f350",
        borderRadius: 8,
        textAlign: "right"
      }}>
        <ReportExport
          scores={scores}
          riskStats={riskStats}
          analysisSummary={analysisSummary}
          userName={userName}
        />
      </div>
    </section>
  );
}

export default Dashboard;
