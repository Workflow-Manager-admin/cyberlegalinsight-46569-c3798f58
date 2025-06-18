import React from "react";

/**
 * NewsFeed component
 * Usage: <NewsFeed items={[...]} />
 *
 * Props:
 *   - items: array of { id, type, title, summary, time }
 */
// PUBLIC_INTERFACE
function NewsFeed({ items = [] }) {
  const fallback = [
    { id: 1, type: "alert", title: "New phishing campaign mimics government notice.", summary: "Stay vigilant against suspicious emails.", time: "10m ago" },
    { id: 2, type: "news", title: "Major contract data breach in tech sector.", summary: "Sensitive contracts leaked via unsecured storage.", time: "1h ago" }
  ];

  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>News & Phishing Alerts</div>
      { (items.length ? items : fallback).map(item => (
        <div key={item.id} style={{
          background: item.type === "alert" ? "rgba(245,166,35,0.14)" : "rgba(80,227,194,0.09)",
          borderLeft: `4px solid ${item.type === "alert" ? "var(--accent)" : "var(--secondary)"}`,
          borderRadius: 6,
          padding: "8px 10px",
          marginBottom: 10
        }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.summary}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "right" }}>{item.time}</div>
        </div>
      ))}
    </div>
  );
}

export default NewsFeed;
