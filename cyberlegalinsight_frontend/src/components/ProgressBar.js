import React from "react";

/**
 * ProgressBar component
 * Displays a horizontal progress indicator based on current and total steps.
 * Example usage:
 *   <ProgressBar currentStep={2} totalSteps={5} labels={["Step 1", "Step 2", ...]} />
 */
// PUBLIC_INTERFACE
function ProgressBar({ currentStep = 0, totalSteps = 1, labels = [] }) {
  return (
    <div style={{ margin: "24px 0 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
      {labels.length
        ? labels.map((label, i) => (
            <React.Fragment key={label}>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: 14,
                  background: i === currentStep ? "var(--base-light)" : "var(--border-color)",
                  color: i === currentStep ? "#000" : "var(--text-secondary)",
                  fontWeight: i === currentStep ? 600 : 400,
                  fontSize: 14,
                  minWidth: 60,
                  textAlign: "center",
                  boxShadow: i === currentStep ? "0 0 4px #00ffff80" : undefined,
                  transition: "all 0.2s"
                }}
              >
                {label}
              </div>
              {i < labels.length - 1 && (
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: i < currentStep ? "var(--base-light)" : "var(--border-color)",
                    borderRadius: 1
                  }}
                />
              )}
            </React.Fragment>
          ))
        : (
            <>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "var(--border-color)",
                  width: "90%",
                  flex: 1,
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    height: "100%",
                    background: "var(--base-light)",
                    borderRadius: 4,
                    transition: "width 0.25s"
                  }}
                />
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {currentStep + 1}/{totalSteps}
              </div>
            </>
          )
      }
    </div>
  );
}

export default ProgressBar;
