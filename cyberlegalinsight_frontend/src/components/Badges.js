import React from "react";

/**
 * Badges component (Gamification overlay/cards).
 * Displays badges and achievements unlocked by the user, adapted for use as
 * an overlay or embedded UI card. Accepts unlocked badge keys via prop
 * or uses a mock set for demo. Theme-aware with clear visual prominence.
 *
 * Usage:
 *   <Badges unlocked={["first_upload", "answer_5", ...]} />
 *
 * Props:
 *  - unlocked: array of unlocked badge keys (strings)
 *  - style/position: (optional) parent controls overlay or inline, but defaults are visually prominent
 */

// Example badge definitions (would be static or backend-driven in full app)
const BADGE_CATALOG = [
  {
    key: "first_upload",
    label: "First Upload",
    icon: "📄",
    description: "Uploaded a contract for analysis.",
    color: "var(--accent,#F5A623)"
  },
  {
    key: "answer_5",
    label: "Active Responder",
    icon: "🧠",
    description: "Answered 5 adaptive questions.",
    color: "var(--primary,#4A90E2)"
  },
  {
    key: "risk_master",
    label: "Risk Master",
    icon: "🛡️",
    description: "Achieved a perfect risk score.",
    color: "var(--secondary,#50E3C2)"
  },
  {
    key: "chat_friend",
    label: "Chat Pro",
    icon: "💬",
    description: "Engaged with the AI assistant.",
    color: "#b765f4"
  },
  {
    key: "download_star",
    label: "Exporter",
    icon: "⬇️",
    description: "Exported a report as CSV or PDF.",
    color: "#359d60"
  },
  {
    key: "phishing_alert",
    label: "Phishing Spotter",
    icon: "🎣",
    description: "Identified a phishing simulation.",
    color: "#e34d4f"
  }
];

// PUBLIC_INTERFACE
function Badges({ unlocked }) {
  // Use mock data if not supplied.
  const unlockedSet = new Set(
    Array.isArray(unlocked)
      ? unlocked
      : ["first_upload", "answer_5", "chat_friend"] // mock demo unlocks
  );

  // Overlay effect: can be controlled via props, but defaults to bottom-right floating card
  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        right: 32,
        minWidth: 324,
        maxWidth: 422,
        zIndex: 1500,
        background: "var(--base-dark, #11152b)",
        border: "2.7px solid var(--primary, #4A90E2)",
        borderRadius: 16,
        boxShadow:
          "0 6px 34px 0 #4A90E240, 0 1px 5px #0004",
        color: "var(--text-color, #fff)",
        padding: "16px 20px 14px 20px",
        transition: "background 0.2s, border-color 0.2s",
        fontFamily: "Inter, Roboto, Arial, sans-serif",
        opacity: 0.97,
        pointerEvents: "auto"
      }}
      aria-label="Unlocked Badges & Achievements"
    >
      <div
        style={{
          fontWeight: 800,
          color: "var(--accent)",
          fontSize: 19,
          letterSpacing: 0.5,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 7
        }}
      >
        <span role="img" aria-label="medal" style={{ fontSize: 22 }}>
          🏆
        </span>
        Unlocked Badges
      </div>
      <div
        style={{
          display: "flex",
          gap: 17,
          flexWrap: "wrap",
          alignItems: "flex-start",
          marginBottom: 6
        }}
      >
        {BADGE_CATALOG.filter(b =>
          unlockedSet.has(b.key)
        ).length === 0 && (
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              fontStyle: "italic"
            }}
          >
            No badges unlocked yet!
          </div>
        )}
        {BADGE_CATALOG.filter(b =>
          unlockedSet.has(b.key)
        ).map(badge => (
          <div
            key={badge.key}
            style={{
              minWidth: 78,
              maxWidth: 112,
              background: "rgba(74,144,226,0.09)",
              border:
                "2.5px solid " +
                (badge.color || "var(--accent)"),
              borderRadius: 12,
              padding: "7px 10px 9px 10px",
              boxShadow: "0 0px 7px #2221",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 7,
              position: "relative",
              transition: "background 0.15s, border 0.2s"
            }}
            title={badge.description}
          >
            <span
              style={{
                fontSize: 30,
                marginBottom: 3,
                filter:
                  badge.key === "risk_master"
                    ? "drop-shadow(0 0 6px #F5A623a0)"
                    : undefined,
                color: badge.color
              }}
              aria-label={badge.label}
            >
              {badge.icon}
            </span>
            <div
              style={{
                fontWeight: 600,
                color: badge.color,
                fontSize: 13.7,
                marginBottom: 1,
                letterSpacing: 0.1,
                textAlign: "center"
              }}
            >
              {badge.label}
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: 11.7,
                textAlign: "center"
              }}
            >
              {badge.description}
            </div>
            <div
              style={{
                position: "absolute",
                right: 6,
                top: 4
              }}
            >
              {/* Glowing unlocked indicator dot */}
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  background:
                    "radial-gradient(ellipse at center, #8cffbc 60%, #00e29a00 100%)",
                  borderRadius: "50%",
                  boxShadow: "0 0 6px #8cffbc70",
                  opacity: 0.8
                }}
                aria-label="Unlocked"
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: 12.2,
          marginTop: 4
        }}
      >
        New achievements are earned as you explore features and engage with the app!
      </div>
    </div>
  );
}

export default Badges;
