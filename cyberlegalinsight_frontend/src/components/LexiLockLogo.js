import React from "react";

/**
 * LexiLockLogo – Inline SVG logo for LexiLock
 * - Stylized lock integrated with an "L" and subtle shield,
 * - Adapts to theme by using CSS variables for accent and text color.
 * - Scalable for navbar/icon usage.
 */
// PUBLIC_INTERFACE
function LexiLockLogo({ size = 30, style = {} }) {
  // SVG uses --accent (primary orange) and --base-dark or --base-light for background.
  // Outline is slightly thicker for professional look, readable on light/dark backgrounds.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LexiLock Logo"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        ...style,
      }}
    >
      {/* Shield backdrop */}
      <path
        d="M19 3.6C22.1 7.1 28.9 6.8 32.2 10.9C34 13.2 34.2 24.8 19 33.4C3.8 24.8 4 13.2 5.8 10.9C9.1 6.8 15.9 7.1 19 3.6Z"
        fill="var(--base-light)"
        stroke="var(--accent)"
        strokeWidth="2"
        style={{
          filter: "drop-shadow(0 2px 6px #e87a4135)",
          transition: "fill 0.35s, stroke 0.35s"
        }}
      />
      {/* Padlock body */}
      <rect
        x="11"
        y="15.6"
        width="16"
        height="13"
        rx="6"
        fill="var(--accent)"
        stroke="var(--accent)"
        strokeWidth="2"
        style={{ transition: "fill 0.35s, stroke 0.35s" }}
      />
      {/* Keyhole */}
      <circle
        cx="19"
        cy="23.7"
        r="2.1"
        fill="var(--base-dark)"
        style={{ opacity: 0.82, transition: "fill 0.35s" }}
      />
      {/* L bar (for 'LexiLock', bold, readable) */}
      <rect
        x="14.05"
        y="18"
        width="2.6"
        height="7.2"
        rx="1.3"
        fill="var(--base-dark)"
        style={{ transition: "fill 0.35s" }}
      />
      <rect
        x="14.07"
        y="23.3"
        width="6"
        height="2"
        rx="1"
        fill="var(--base-dark)"
        style={{ transition: "fill 0.35s" }}
      />
      {/* Arc shackle */}
      <path
        d="M15.2 18C15.2 14 22.8 14 22.8 18"
        stroke="var(--base-dark)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        style={{
          transition: "stroke 0.35s"
        }}
      />
    </svg>
  );
}

export default LexiLockLogo;
