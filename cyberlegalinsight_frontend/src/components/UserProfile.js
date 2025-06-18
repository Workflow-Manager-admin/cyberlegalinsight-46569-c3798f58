import React, { useState, useEffect } from "react";

/**
 * UserProfile component
 * 
 * - Saves and loads user analysis reports/results to localStorage
 * - Displays user's history of past assessments with details
 * - Allows user to compare previous assessments in a simple diff/side-by-side view
 * 
 * Usage:
 *   <UserProfile
 *       currentReport={...}           // latest analysis result object to offer saving
 *       onRestore={(report) => {}}    // callback when a historical report is selected/restored
 *   />
 * 
 * Convention for saved report object:
 * {
 *   id: string, // unique (timestamped) id
 *   savedAt: ISODateString,
 *   reportName: string,
 *   userName: string,    // optional
 *   scores: { legal, cyber },
 *   riskStats: [{label, score, level}],
 *   analysisSummary: string
 * }
 */
// PUBLIC_INTERFACE
function UserProfile({ currentReport = null, onRestore }) {
  const LOCAL_KEY = "cli_report_history";

  // State: History of saved reports
  const [reports, setReports] = useState([]);
  // State: For compare mode (array of two selected ids)
  const [compare, setCompare] = useState([]);
  // For modals
  const [showModal, setShowModal] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setReports(Array.isArray(arr) ? arr : []);
    } catch {
      setReports([]);
    }
  }, []);

  // Helper: Save report to local storage
  const saveCurrentReport = () => {
    if (!currentReport) return;
    // Prepare object to save
    const cleaned = {
      ...currentReport,
      id: currentReport.id || ("rpt_" + Date.now()),
      savedAt: new Date().toISOString(),
    };
    const next = [
      cleaned,
      ...reports.filter(r => r.id !== cleaned.id) // replace/update if ID exists
    ].slice(0, 8); // Limit to last 8 reports
    setReports(next);
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  };

  // Helper: Delete a report
  const deleteReport = (id) => {
    const next = reports.filter(r => r.id !== id);
    setReports(next);
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    setCompare(compare.filter(cid => cid !== id));
  };

  // Helper: Format date
  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Begin compare mode by selecting up to 2 reports
  const toggleCompare = (id) => {
    setCompare(compare.includes(id)
      ? compare.filter(cid => cid !== id)
      : compare.length < 2
        ? [...compare, id]
        : [compare[1], id] // keep latest two
    );
  };

  // Get report details for compare mode
  const compareReports = reports.filter(r => compare.includes(r.id));

  return (
    <section style={{
      border: "1px solid var(--border-color)", borderRadius: 12, padding: 18, marginTop: 18,
      background: "rgba(255,255,255,0.03)", boxShadow: "0 1px 10px #4a90e215"
    }}>
      <div style={{ fontWeight: 700, fontSize: 19, color: "var(--primary)", marginBottom: 10 }}>
        User Profile & Assessment History
      </div>
      <div style={{ marginBottom: 10, color: "var(--text-secondary)", fontSize: 13 }}>
        Your assessment results are saved locally in your browser (<b>private</b>, never uploaded). View and compare past analysis here.
      </div>

      {/* Save Current Report Button */}
      {currentReport &&
        <div style={{ marginBottom: 15 }}>
          <button
            className="btn"
            style={{ fontSize: 14 }}
            onClick={saveCurrentReport}
            disabled={reports.some(r => r.id === currentReport.id)}
            title={reports.some(r => r.id === currentReport.id) ? "Already saved!" : "Save this result"}
          >💾 Save Latest Report</button>
        </div>
      }

      {/* List of Past Reports */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Assessment History</div>
        {reports.length === 0 ? (
          <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>No assessments saved yet.</div>
        ) : (
          <table style={{ width: "100%", fontSize: 13, borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", fontWeight: 400, color: "var(--text-secondary)" }}>Date</th>
                <th style={{ textAlign: "left", fontWeight: 400, color: "var(--text-secondary)" }}>Name</th>
                <th colSpan={2} style={{ textAlign: "center", fontWeight: 400, color: "var(--text-secondary)" }}>Scores</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={{ background: compare.includes(r.id) ? "var(--base-light)" : "none" }}>
                  <td>{fmtDate(r.savedAt)}</td>
                  <td style={{ fontWeight: 500 }}>{r.reportName || "Assessment"}</td>
                  <td style={{ textAlign: "center" }}>Legal: <b>{r.scores?.legal ?? "-"}</b></td>
                  <td style={{ textAlign: "center" }}>Cyber: <b>{r.scores?.cyber ?? "-"}</b></td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn"
                      style={{ padding: "2px 10px", fontSize: 12, marginRight: 5 }}
                      onClick={() => { if (onRestore) onRestore(r); }}
                    >
                      Load
                    </button>
                    <button
                      className="btn"
                      style={{
                        padding: "2px 10px", fontSize: 12,
                        background: compare.includes(r.id) ? "var(--accent)" : "var(--primary)",
                        color: compare.includes(r.id) ? "#212" : "#fff",
                        border: compare.includes(r.id) ? "2px solid #F5A623" : undefined
                      }}
                      onClick={() => toggleCompare(r.id)}
                    >
                      {compare.includes(r.id) ? "Unselect" : compare.length < 2 ? "Compare" : "Swap"}
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn"
                      style={{ background: "#e34d4f", color: "#fff", fontSize: 12, padding: "2px 12px" }}
                      onClick={() => setShowModal(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Compare Section */}
        {compare.length === 2 && compareReports.length === 2 && (
          <div style={{ marginTop: 16, padding: 13, border: "1.5px dashed var(--primary)", borderRadius: 10, background: "#f5fafd11"}}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 7 }}>Compare Assessments</div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", justifyContent: "space-between" }}>
              {compareReports.map(rep => (
                <div key={rep.id} style={{
                  flex: 1, padding: 10, borderRadius: 7, background: "#fff4", minWidth: 175, maxWidth: 270,
                  border: "1px solid var(--border-color)"
                }}>
                  <div style={{ fontWeight: 500, marginBottom: 3 }}>{rep.reportName || "Assessment"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 3 }}>{fmtDate(rep.savedAt)}</div>
                  <div>Legal: <b style={{color:"var(--accent)"}}>{rep.scores?.legal ?? "-"}</b></div>
                  <div>Cyber: <b style={{color:"var(--primary)"}}>{rep.scores?.cyber ?? "-"}</b></div>
                  <div style={{ margin:"7px 0 3px 0", fontSize: 12 }}>
                    Key Risks: {Array.isArray(rep.riskStats)
                      ? rep.riskStats.map(ris => (
                        <span key={ris.label}
                          style={{
                            display: "inline-block",
                            background:
                              ris.level === "high" ? "#e87a41" :
                              ris.level === "medium" ? "#fff174" : "#bdecb6",
                            color: ris.level === "high" ? "#fff" : "#222",
                            borderRadius: 7,
                            padding: "2px 6px",
                            marginRight: 5,
                            marginBottom: 2,
                            fontSize: 11,
                            boxShadow:
                              ris.level === "high" ? "0 0 4px #e87a4190" : undefined,
                          }}
                        >
                          {ris.label}: {ris.level}
                        </span>
                      )) : "-"}
                  </div>
                  <div style={{ fontSize: 12, color: "#222", marginTop: 4 }}>
                    {rep.analysisSummary ? <span><b>Summary:</b> {rep.analysisSummary.slice(0, 90)}{rep.analysisSummary.length > 90 ? "..." : ""}</span> : null}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 9 }}>
              <span style={{ fontWeight: 600 }}>Diff:</span> Legal (Δ {Math.abs(compareReports[0].scores.legal - compareReports[1].scores.legal)}) | Cyber (Δ {Math.abs(compareReports[0].scores.cyber - compareReports[1].scores.cyber)})
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.18)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div style={{
            background: "var(--base-dark)",
            color: "var(--text-color)",
            borderRadius: 10,
            boxShadow: "0 2px 18px #0003",
            width: 280, maxWidth: "90vw",
            padding: 22,
            border: "2px solid #e87a41"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>
              Delete this assessment?
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
              This will remove it from your local device and cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn"
                style={{ background: "#e34d4f", color: "#fff", flex: 1 }}
                onClick={() => { deleteReport(showModal); setShowModal(false); }}
              >
                Delete
              </button>
              <button
                className="btn"
                style={{ flex: 1 }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 14 }}>
        Reports are saved only in your current browser (not synced across devices). Clear browser storage to reset.
      </div>
    </section>
  );
}

export default UserProfile;
