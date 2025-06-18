import React, { useEffect, useState, useRef } from "react";

/**
 * NewsFeed component
 * Simulates a sidebar panel displaying cybersecurity news and phishing alerts with animated, timed notification effects.
 * 
 * Usage: <NewsFeed items={[...]} /> // items are optional; defaults to mock news/alerts.
 * 
 * - Animates appearance of alerts, most recent at top.
 * - Periodically injects new mock items if no 'items' prop is supplied.
 * - Type: 'news' (info) or 'alert' (phishing warning).
 * - Responsive and theme-aware.
 */

// PUBLIC_INTERFACE
function NewsFeed({ items }) {
  // Built-in mock updates (cycled if no items prop is used)
  const MOCK_NEWS = [
    {
      id: 101,
      type: "alert",
      title: "🚨 New Phishing Simulation: 'Your Cloud Invoice is Due!'",
      summary:
        "A simulated email pretending to be a cloud provider invoice is circulating. Always verify before clicking links.",
      time: "Just now",
    },
    {
      id: 102,
      type: "news",
      title: "Tech Firm Contract Breach Exposes Data",
      summary:
        "Sensitive contract files from a major vendor were exposed due to an unsecured backup server.",
      time: "3m ago",
    },
    {
      id: 103,
      type: "alert",
      title: "⚠️ Suspicious Login Alert",
      summary: "An attempt to access your account from a new device was blocked.",
      time: "5m ago",
    },
    {
      id: 104,
      type: "news",
      title: "Industry: Supply Chain Attacks on the Rise",
      summary:
        "Gartner reports a 40% increase in cyber-attacks via contract partners in 2024.",
      time: "10m ago",
    },
    {
      id: 105,
      type: "alert",
      title: "Phishing Alert: Fake Legal Notice Emails",
      summary:
        "If you receive unsolicited legal notices requesting urgent action, do not click any links—report to IT.",
      time: "17m ago",
    },
    {
      id: 106,
      type: "news",
      title: "AI Contract Clause Analyzer Launches",
      summary:
        "Automated tools now help spot legal risks and suspicious contract language. Try them for free.",
      time: "22m ago",
    },
  ];

  // Use supplied items as static feed, or mock+live updates if undefined
  const [liveItems, setLiveItems] = useState(items || []);
  const [animatingId, setAnimatingId] = useState(null);
  const itemSeq = useRef(0);
  const timerRef = useRef();

  useEffect(() => {
    if (items && Array.isArray(items)) {
      // If static, show them immediately, no simulation.
      setLiveItems(items);
      setAnimatingId(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      // Animation: Start with 2 items, periodically inject new
      setLiveItems(MOCK_NEWS.slice(0, 2));
      setAnimatingId(MOCK_NEWS[0].id);
      itemSeq.current = 2;

      function injectNextItem() {
        if (itemSeq.current < MOCK_NEWS.length) {
          setAnimatingId(MOCK_NEWS[itemSeq.current].id);
          setLiveItems((prev) => [MOCK_NEWS[itemSeq.current], ...prev]);
          itemSeq.current += 1;
          timerRef.current = setTimeout(injectNextItem, 3500 + Math.random() * 1800); // next update varied
        } else {
          setAnimatingId(null);
        }
      }
      timerRef.current = setTimeout(injectNextItem, 3200);
      return () => clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [items]);

  // Render helper
  function renderItem(item, idx) {
    const color =
      item.type === "alert"
        ? "var(--accent, #F5A623)"
        : "var(--secondary, #50E3C2)";
    const bg =
      item.type === "alert"
        ? "rgba(245,166,35,0.13)"
        : "rgba(80,227,194,0.10)";

    // Animate for newly appearing item
    const isNew = animatingId === item.id && idx === 0;
    return (
      <div
        key={item.id}
        style={{
          background: bg,
          borderLeft: `4px solid ${color}`,
          boxShadow: isNew ? `0 0 10px ${color}` : undefined,
          borderRadius: 8,
          padding: "10px 13px 6px 11px",
          marginBottom: 13,
          opacity: isNew ? 0 : 1,
          animation: isNew
            ? "cli-newsfadein 0.56s cubic-bezier(.68,-0.6,.32,1.6) forwards"
            : undefined,
          transition: "box-shadow 0.3s, background 0.35s",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 13.5, color }}>
          {item.title}
        </div>
        <div
          style={{
            fontSize: 12.2,
            fontWeight: 400,
            color: "var(--text-secondary)",
            margin: "2px 0 0 0",
          }}
        >
          {item.summary}
        </div>
        <div
          style={{
            fontSize: 10.8,
            color: "var(--text-secondary)",
            textAlign: "right",
            opacity: 0.82,
            marginTop: 2,
          }}
        >
          {item.time}
        </div>
      </div>
    );
  }

  return (
    <section>
      {/* Anim fade-in keyframes */}
      <style>
        {`
        @keyframes cli-newsfadein {
          from {
            opacity: 0;
            transform: translateY(-7px) scale(.97);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: none;
          }
        }
        `}
      </style>
      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--base-light)", margin: "0 0 7px 2px" }}>
        News & Phishing Alerts
      </div>
      <div>
        {(liveItems.length
          ? liveItems.slice(0, 5)
          : MOCK_NEWS.slice(0, 2)
        ).map(renderItem)}
      </div>
      <div
        style={{
          marginTop: 12,
          color: "var(--text-secondary)",
          fontSize: 11,
          fontStyle: "italic",
        }}
      >
        Updates are simulated. Remain cautious about "urgent" emails or requests!
      </div>
    </section>
  );
}

export default NewsFeed;

