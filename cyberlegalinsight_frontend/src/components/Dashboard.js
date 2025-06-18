import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * Dashboard – Standalone Review Dashboard with:
 *   - Progress bar, scores, radar (spider) chart, threat heatmap,
 *   - Tabbed content: Hygiene Tips, Phishing Alert, Suggestions,
 *   - Summary, breakdown, red flags, negotiation, action plan, checklist,
 *   - Download Report as PDF button,
 *   - Modular, themed, mock/sample data, previewable as <Dashboard />
 *
 * All logic/UI is self-contained for preview or integration.
 */
function Dashboard({
  // Optionally override mock data via props.
  scores,
  radar,
  radarLabels,
  clauseHeat,
  summary,
  questionAnswers,
  redFlags,
  negotiation,
  actionPlan,
  checklist,
  suggestionCards,
  hygieneTips,
  phishingAlert,
  userName,
  previewMode,
}) {
  // --- Mock/sample data for preview/integration demo ---
  scores = scores || { cyber: 41, legal: 77, safety: 56 };
  userName = userName || "Alex";
  radarLabels =
    radarLabels ||
    ["Email", "Cloud", "Contracts", "Devices", "Social", "Passwords"];
  radar = radar || [66, 72, 39, 80, 47, 61];
  clauseHeat =
    clauseHeat ||
    [
      { clause: "Termination", severity: 2, riskLabel: "High" },
      { clause: "Data Privacy", severity: 1, riskLabel: "Medium" },
      { clause: "Liability", severity: 1, riskLabel: "Medium" },
      { clause: "Auto-Renewal", severity: 0, riskLabel: "Low" },
      { clause: "Jurisdiction", severity: 0, riskLabel: "Low" }
    ];
  summary =
    summary ||
    "This contract exposes moderate legal risks, particularly regarding termination conditions and data privacy inadequacy.";
  questionAnswers =
    questionAnswers ||
    [
      { q: "Is there a clear definition of confidential information?", a: "Yes" },
      { q: "Does the contract specify notice periods?", a: "30 days" },
      { q: "Are payment terms fair?", a: "60 days, but no late penalty clause." }
    ];
  redFlags =
    redFlags ||
    [
      "Termination is too broadly defined.",
      "No clear dispute resolution.",
      "Liability cap is vague.",
      "Data privacy handling ambiguous."
    ];
  negotiation =
    negotiation ||
    [
      "Can termination conditions be narrowed?",
      "Clarify data retention obligations.",
      "Specify governing law for disputes."
    ];
  actionPlan =
    actionPlan ||
    [
      "Request clarification on early termination notice.",
      "Negotiate explicit liability caps.",
      "Demand data privacy clause revision."
    ];
  checklist =
    checklist ||
    [
      { item: "Enable Two-Factor Authentication", priority: "Urgent" },
      { item: "Avoid public Wi-Fi for negotiation", priority: "Recommended" },
      { item: "Review legal counsel's comments", priority: "Optional" }
    ];
  suggestionCards =
    suggestionCards ||
    [
      { title: "Enable 2FA", tip: "Protect all key accounts with two-factor authentication." },
      { title: "Review Third-party Apps", tip: "Audit 3rd-party access to cloud files." },
      { title: "Phishing Caution", tip: "Hover before clicking suspicious links." }
    ];
  hygieneTips =
    hygieneTips ||
    [
      "Create unique passwords for work, legal, and cloud accounts.",
      "Update software before sending or receiving contracts.",
      "Store legal files in a secure, private folder (cloud or offline)."
    ];
  phishingAlert =
    phishingAlert ||
    "🚨 Simulated phishing email detected: 'Your invoice is overdue' - Do not click links, check sender identity.";

  // --- Dashboard Progress Bar ---
  const progressPct = 92;
  const stepLabels = [
    "Start",
    "Upload",
    "Adapt",
    "Analyze",
    "Dashboard",
    "Export"
  ];

  // --- Score Cards ---
  const cardColors = [
    "linear-gradient(92deg, #4A90E2 60%, #50E3C2 120%)",
    "linear-gradient(96deg, #F5A623 70%, #ffd170 120%)",
    "linear-gradient(95deg, #1bc186 60%, #37e4be 120%)"
  ];
  const cardVals = [
    { label: "Cyber Hygiene Score", v: scores.cyber, color: cardColors[0] },
    { label: "Contract Risk Score", v: scores.legal, color: cardColors[1] },
    { label: "Overall Safety Index", v: scores.safety, color: cardColors[2] }
  ];

  // --- Tabs States ---
  const tabList = [
    {
      title: "Cyber Hygiene Tips",
      content: (
        <ul style={{
          paddingLeft: 22, margin: 0, color: "var(--text-color)", fontSize: 15.2
        }}>
          {hygieneTips.map(tip => <li key={tip}>{tip}</li>)}
        </ul>
      )
    },
    {
      title: "Phishing Alert",
      content: (
        <div style={{
          background: "linear-gradient(98deg, #212a 70%, #e87a410a 120%)",
          borderLeft: "5px solid var(--accent)",
          borderRadius: "9px", color: "var(--text-color)",
          boxShadow: "0 1.5px 9px #e87a4112", padding: "13px 18px",
          fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 9
        }}>
          <span style={{ fontSize: 23, filter: "drop-shadow(0 0 3px #F5A62344)" }}>{phishingAlert[0]}</span>
          {phishingAlert.slice(2)}
        </div>
      )
    },
    {
      title: "Suggestion Cards",
      content: (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          {suggestionCards.map(sug => (
            <div key={sug.title} style={{
              minWidth: 148, maxWidth: 208, background: "rgba(80,227,194,0.12)",
              border: "1.2px dashed var(--secondary)", borderRadius: 13,
              padding: "13px 16px", marginBottom: 5,
            }}>
              <div style={{
                color: "var(--primary)", fontWeight: 700, fontSize: 15, marginBottom: 6
              }}>{sug.title}</div>
              <div style={{
                color: "var(--text-secondary)", fontSize: 13.5
              }}>{sug.tip}</div>
            </div>
          ))}
        </div>
      )
    }
  ];
  const [tabIdx, setTabIdx] = useState(0);

  // === Modular Components Inside Dashboard ===

  // Radar/Spider Chart
  function RadarChart({ axes = [], data = [] }) {
    const N = axes.length;
    if (N === 0 || data.length !== N) return null;
    const angleStep = (2 * Math.PI) / N;
    const radius = 80, center = 90, min = 12;
    // Polar coordinate conversion helper
    const polar = (i, val) => {
      const a = i * angleStep - Math.PI / 2;
      const r = min + (radius - min) * (val / 100);
      return [center + r * Math.cos(a), center + r * Math.sin(a)];
    };
    const points = data.map((v, i) => polar(i, v).join(",")).join(" ");
    const axisEls = axes.map((ax, i) => {
      const [x, y] = polar(i, 100);
      const [lx, ly] = polar(i, 110);
      return (
        <g key={ax}>
          <line x1={center} y1={center} x2={x} y2={y} stroke="var(--border-color)" strokeWidth={1.7} />
          <text x={lx} y={ly} fontSize={12.5} textAnchor="middle" fill="var(--text-secondary)" alignmentBaseline="middle" style={{ fontWeight: 600 }}>
            {ax}
          </text>
        </g>
      );
    });
    return (
      <svg width={180} height={180} style={{ background: "none" }}>
        {axisEls}
        {/* Scale rings */}
        {[0.33, 0.66, 1].map(f => (
          <circle
            key={f}
            cx={center}
            cy={center}
            r={min + (radius - min) * f}
            fill="none"
            stroke="var(--border-color)"
            strokeDasharray="3 3"
            strokeWidth={f === 1 ? 2.2 : 0.9}
          />
        ))}
        {/* Data polygon */}
        <polygon
          points={points}
          fill="rgba(74,144,226,0.30)"
          stroke="var(--primary)"
          strokeWidth={2.5}
          style={{ filter: "drop-shadow(0 1px 4px #50e3c230)" }}
        />
        {data.map((v, i) => {
          const [x, y] = polar(i, v);
          return <circle key={i} cx={x} cy={y} r={4.1} fill="var(--accent)" stroke="var(--primary)" strokeWidth={1.4} />;
        })}
      </svg>
    );
  }

  // Clause Threat Heatmap
  function ClauseHeatmap({ clauses = [] }) {
    // severity: 0=low, 1=med, 2=high
    const colors = ["#bdecb6", "#fff174", "#e87a41"];
    const textColors = ["#225d24", "#222", "#fff"];
    return (
      <div style={{ display: "flex", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
        {clauses.map(({ clause, severity = 0, riskLabel }) => (
          <div key={clause} style={{
            minWidth: 88, padding: "10px 13px", borderRadius: 12,
            background: colors[severity], color: textColors[severity],
            fontWeight: 600, fontSize: 14, marginBottom: 2,
            boxShadow: severity === 2 ? "0 0 7px #e87a41" : undefined,
            border: severity === 1 ? "1.5px dotted #adab2c" : "none",
          }}>
            <span>{clause}</span>
            <span style={{
              marginLeft: 6, fontWeight: 700, background: "#2222", borderRadius: 7, padding: "2px 7px", fontSize: 13, color: "#888"
            }}>{riskLabel}</span>
          </div>
        ))}
      </div>
    );
  }

  // Priority badge for checklist priorities
  function PriorityBadge({ label }) {
    const color =
      label === "Urgent"
        ? "#e34d4f"
        : label === "Recommended"
        ? "#F5A623"
        : "#7ae451";
    return (
      <span style={{
        background: color,
        color: "#111",
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 11,
        marginLeft: 7,
        padding: "2px 9px 2px 8px",
        letterSpacing: 0.3
      }}>{label}</span>
    );
  }

  // Tabbed panels component
  function TabbedPanels({ tabs, curIdx, setCurIdx }) {
    return (
      <div style={{
        border: "1.3px solid var(--border-color)",
        borderRadius: 16,
        background: "var(--base-dark, #191c32)",
        margin: "22px 0 20px 0",
        padding: 0,
        boxShadow: "0 2px 10px #4a90e212"
      }}>
        <div style={{
          display: "flex", borderBottom: "1.3px solid var(--border-color)", background: "rgba(255,255,255,0.02)", borderRadius: "16px 16px 0 0"
        }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.title}
              className="btn"
              style={{
                borderRadius: "16px 16px 0 0",
                background: i === curIdx ? "var(--primary)" : "transparent",
                color: i === curIdx ? "#fff" : "var(--text-secondary)",
                fontWeight: 600, fontSize: 15, marginRight: 6, border: "none", borderBottom: "none"
              }}
              onClick={() => setCurIdx(i)}
            >{tab.title}</button>
          ))}
        </div>
        <div style={{ padding: "22px 16px", fontSize: 15, minHeight: 66 }}>
          {tabs[curIdx]?.content}
        </div>
      </div>
    );
  }

  // Download/Export Section: Download as PDF/HTML report
  function handleDownloadPDF() {
    // Just export an HTML file for mock PDF
    const html = `
      <html>
        <head>
          <meta charset="utf-8"><title>CyberLegalInsight Dashboard Report</title>
        </head>
        <body style="font-family:Arial,sans-serif;">
          <h2>CyberLegalInsight Dashboard Report</h2>
          <div><b>User:</b> ${userName}</div>
          <div><b>Scores:</b> Cyber Hygiene: ${scores.cyber} | Legal: ${scores.legal} | Safety Index: ${scores.safety}</div>
          <div><b>Summary:</b> ${summary}</div>
          <div><b>Contract Q&A:</b>
            <ul>
            ${questionAnswers.map(qa => `<li><b>${qa.q}</b> <br/>${qa.a}</li>`).join("")}
            </ul>
          </div>
          <div><b>Red Flags:</b>
            <ul>${redFlags.map(f => `<li>${f}</li>`).join("")}</ul>
          </div>
          <div><b>Negotiation Suggestions:</b>
            <ul>${negotiation.map(n => `<li>${n}</li>`).join("")}</ul>
          </div>
          <div><b>Checklist:</b>
            <ul>${checklist.map(c => `<li>${c.item} [${c.priority}]</li>`).join("")}</ul>
          </div>
          <div style="color:#999; margin-top:22px;font-size:12px;">(Demo Export powered by CyberLegalInsight Dashboard v1.0)</div>
        </body>
      </html>
    `;
    const blob = new Blob([html], {type:"text/html"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cyberlegalinsight_dashboard_report.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 160);
  }

  // MAIN RENDER
  return (
    <div className="cli-dashboard-main" style={{
      margin: "0 auto", maxWidth: 980, padding: "26px 0 54px 0",
      minHeight: 640, width: "100%", boxSizing: "border-box"
    }}>
      {/* Progress Steps Indicator */}
      <div style={{ margin: '24px 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        {stepLabels.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{
              padding: '4px 12px',
              borderRadius: 14,
              background: i === 4 ? 'var(--base-light)' : 'var(--border-color)',
              color: i === 4 ? '#000' : 'var(--text-secondary)',
              fontWeight: i === 4 ? 600 : 400,
              fontSize: 14,
              minWidth: 60,
              textAlign: 'center',
              boxShadow: i === 4 ? '0 0 4px #00ffff80' : undefined,
              transition: 'all 0.38s cubic-bezier(.62,0,.28,1)'
            }}>
              {label}
            </div>
            {i < stepLabels.length - 1 && (
              <div style={{
                width: 16,
                height: 2,
                background: i < 4 ? 'var(--base-light)' : 'var(--border-color)',
                borderRadius: 1,
                transition: "background 0.35s cubic-bezier(.62,0,.28,1)"
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <h2 style={{
        fontWeight: 800, fontSize: "2.2rem", margin: "10px 0 9px 0",
        color: "var(--primary)"
      }}>Results Dashboard</h2>

      {/* Scores and Progress Bar */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", marginBottom: 5
      }}>
        {/* Horizontal progress bar */}
        <div style={{
          flex: 1,
          minWidth: 200,
          maxWidth: 400,
          margin: "16px 0 18px 0",
          paddingRight: 32
        }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Report Completion</div>
          <div style={{
            background: "var(--border-color)", height: 12, borderRadius: 17,
            width: "100%", overflow: "hidden", marginTop: 5, position: "relative"
          }}>
            <div style={{
              height: 12,
              borderRadius: 17,
              background: "linear-gradient(90deg, var(--primary), #50e3c2 90%)",
              width: `${progressPct}%`,
              boxShadow: "0 0 10px #50E3C280",
              transition: "width 0.8s"
            }}></div>
            <span style={{
              position: "absolute", right: 9, top: 0, color: "#222", fontWeight: 700, fontSize: 13
            }}>{progressPct}%</span>
          </div>
        </div>
        {/* Score cards display */}
        <div style={{
          display: "flex", gap: 18, minWidth: 312, flex: 2, justifyContent: "flex-end"
        }}>
          {cardVals.map(card => (
            <div key={card.label} style={{
              minWidth: 109, minHeight: 54, borderRadius: 15,
              background: card.color, color: "#fff", fontWeight: 800,
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", boxShadow: "0 1.5px 12px #4a90e222",
              letterSpacing: 1.6, fontSize: 15, position: "relative"
            }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{card.label}</span>
              <span style={{
                fontSize: 28, fontWeight: 900, letterSpacing: 0.5,
                lineHeight: "35px", marginTop: 2, textShadow: "0 2px 10px #0005"
              }}>{card.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radar chart & Heatmap */}
      <div style={{
        display: "flex", gap: 26, flexWrap: "wrap", alignItems: "center", marginTop: 12
      }}>
        <div style={{
          flex: 1, minWidth: 210, display: "flex", flexDirection: "column",
          alignItems: "center", background: "rgba(255,255,255,0.015)", borderRadius: 12, padding: "18px 10px"
        }}>
          <div style={{
            fontWeight: 700, color: "var(--secondary)", fontSize: 16, marginBottom: 7
          }}>Behavioral Risk Radar</div>
          <RadarChart axes={radarLabels} data={radar} />
        </div>
        <div style={{
          flex: 1, minWidth: 230, maxWidth: 390, background: "rgba(255,255,255,0.012)",
          borderRadius: 12, padding: "18px 12px"
        }}>
          <div style={{
            fontWeight: 700, color: "var(--accent)", fontSize: 16, marginBottom: 8
          }}>Clause Threat Heatmap</div>
          <ClauseHeatmap clauses={clauseHeat} />
        </div>
      </div>

      {/* Tabbed Info */}
      <TabbedPanels tabs={tabList} curIdx={tabIdx} setCurIdx={setTabIdx} />

      {/* Contract summary, breakdown, red flags, negotiation, etc. */}
      <div style={{ margin: "30px 0 0 0", padding: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: 17, color: "var(--primary)", marginBottom: 6,
        }}>Contract Summary</div>
        <div style={{
          background: "rgba(255,255,255,0.10)", borderRadius: 9,
          padding: "12px 15px", color: "var(--text-color)", fontSize: 15.5, marginBottom: 19
        }}>{summary}</div>
        <div style={{
          marginBottom: 13, border: "1.2px solid var(--border-color)",
          borderRadius: 8, padding: 11, background: "rgba(255,255,255,0.025)"
        }}>
          <div style={{
            fontWeight: 600, fontSize: 15, color: "var(--accent)", marginBottom: 5
          }}>Q&A Breakdown</div>
          <ul style={{ paddingLeft: 22, margin: 0, fontSize: 14.7 }}>
            {questionAnswers.map(qa => (
              <li key={qa.q} style={{ marginBottom: 6 }}>
                <span style={{ color: "var(--secondary)", fontWeight: 500 }}>{qa.q}</span>
                <br />
                <span style={{ color: "var(--text-color)" }}>{qa.a}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Red Flags */}
        <div style={{
          marginBottom: 13, border: "1.2px solid #e87a41", borderRadius: 8, padding: 11,
          background: "rgba(232,122,65,0.035)"
        }}>
          <div style={{
            fontWeight: 600, fontSize: 15, color: "#e87a41", marginBottom: 5
          }}>Red Flags</div>
          <ul style={{ paddingLeft: 22, margin: 0, fontSize: 14.7 }}>
            {redFlags.map(flag =>
              <li key={flag} style={{
                color: "#e87a41", fontWeight: 500, marginBottom: 5
              }}>⚠️ {flag}</li>
            )}
          </ul>
        </div>
        {/* Negotiation Suggestions */}
        <div style={{
          marginBottom: 15, background: "rgba(80,227,194,0.025)",
          border: "1.1px solid var(--secondary)", borderRadius: 8, padding: 10
        }}>
          <div style={{
            fontWeight: 600, fontSize: 15, color: "var(--secondary)", marginBottom: 5
          }}>Negotiation Suggestions</div>
          <ul style={{ paddingLeft: 22, margin: 0, fontSize: 14.2 }}>
            {negotiation.map(q =>
              <li key={q} style={{
                color: "var(--secondary)", fontWeight: 500, marginBottom: 6
              }}>🤝 {q}</li>
            )}
          </ul>
        </div>
        {/* Action Plan */}
        <div style={{
          marginBottom: 15, background: "rgba(245,166,35,0.035)",
          border: "1.1px solid var(--accent)", borderRadius: 8, padding: 10
        }}>
          <div style={{
            fontWeight: 600, fontSize: 15, color: "var(--accent)", marginBottom: 5
          }}>Action Plan</div>
          <ul style={{ paddingLeft: 22, margin: 0, fontSize: 14.2 }}>
            {actionPlan.map(a =>
              <li key={a} style={{
                color: "var(--accent)", fontWeight: 500, marginBottom: 6
              }}>⭐ {a}</li>
            )}
          </ul>
        </div>
        {/* Checklist with Priorities */}
        <div style={{
          padding: 0,
          border: "none"
        }}>
          <div style={{
            fontWeight: 600, fontSize: 15, color: "var(--primary)", marginBottom: 6
          }}>Checklist</div>
          <ul style={{ paddingLeft: 22, margin: 0, fontSize: 14.7 }}>
            {checklist.map(ch =>
              <li key={ch.item} style={{ marginBottom: 6, color: "var(--text-color)", fontWeight: 500 }}>
                {ch.item}
                <PriorityBadge label={ch.priority} />
              </li>
            )}
          </ul>
        </div>
      </div>
      {/* Download Report */}
      <div style={{ marginTop: 24, paddingTop: 18, textAlign: "right" }}>
        <button
          className="btn btn-large"
          onClick={handleDownloadPDF}
          style={{
            fontWeight: 700,
            fontSize: 15,
            minWidth: 170,
            background: "var(--primary)",
            color: "#fff"
          }}
        >
          Download Report as PDF
        </button>
      </div>

      {previewMode && (
        <div style={{ marginTop: 28, fontSize: 11, color: "#888", textAlign: "center" }}>
          Preview mode: To integrate, import & use <b>&lt;Dashboard /&gt;</b> in your page.
        </div>
      )}
    </div>
  );
}

export default Dashboard;
