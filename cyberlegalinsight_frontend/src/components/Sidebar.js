import React from "react";

/**
 * Sidebar component
 * Usage:
 *   <Sidebar position="left" title="News & Alerts">[custom content]</Sidebar>
 *   <Sidebar position="right" title="AI Chat Assistant">[custom content]</Sidebar>
 *
 * Props:
 *    - position: 'left' | 'right'
 *    - title: Sidebar section header
 *    - children: Sidebar body
 */
// PUBLIC_INTERFACE
function Sidebar({ position = "left", title = "", children }) {
  const baseStyle = {
    width: position === "right" ? 280 : 220,
    minWidth: position === "right" ? 180 : 160,
    borderRight: position === "left" ? "1px solid var(--border-color)" : undefined,
    borderLeft: position === "right" ? "1px solid var(--border-color)" : undefined,
    background: position === "right" ? "rgba(0,255,255,0.05)" : "rgba(0,255,255,0.03)",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box"
  };

  return (
    <aside style={baseStyle}>
      <div style={{
        fontWeight: 600,
        color: 'var(--base-light)',
        marginBottom: 12
      }}>
        {title}
      </div>
      <div style={{
        flex: 1,
        color: 'var(--text-secondary)',
        fontSize: 13
      }}>
        {children || "[Sidebar placeholder]"}
      </div>
    </aside>
  );
}

export default Sidebar;
