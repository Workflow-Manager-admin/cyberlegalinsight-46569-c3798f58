import React from "react";

/**
 * Dashboard component
 * Usage:
 *   <Dashboard scores={{ legal: 72, cyber: 40 }} userName="Alice" />
 *
 * Props:
 *   - scores: { legal: number, cyber: number }
 *   - userName: string
 *   - children: (optional) additional dashboard panels
 */
// PUBLIC_INTERFACE
function Dashboard({ scores = { legal: 0, cyber: 0 }, userName = "", children }) {
  return (
    <section>
      <h2>Analysis Dashboard</h2>
      <div style={{ marginBottom: 16, color: "var(--text-secondary)" }}>
        {userName ? <>Welcome <b>{userName}</b>. </> : null}
        Here are your contract/legal and cyber safety stats:
      </div>
      <div style={{
        display: "flex",
        gap: 24,
        alignItems: "flex-end",
        marginBottom: 12
      }}>
        <div>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            color: "var(--accent)"
          }}>
            {scores.legal}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Legal Risk Score</div>
        </div>
        <div>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            color: "var(--primary)"
          }}>
            {scores.cyber}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Cyber Safety Score</div>
        </div>
      </div>
      {children ? <div>{children}</div> : null}
      <div style={{ marginTop: 18, color: "#999", fontSize: 13 }}>
        [Placeholder: More charts, details, export/download tools, etc.]
      </div>
    </section>
  );
}

export default Dashboard;
