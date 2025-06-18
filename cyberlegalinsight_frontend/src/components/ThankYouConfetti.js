import React from "react";

// PUBLIC_INTERFACE
/**
 * ThankYouConfetti – A celebratory thank you screen with animated confetti and two primary CTA buttons.
 * Props:
 *   - onRetake: function to handle the "Retake Assessment" button click
 *   - onSubscribe: function to handle the "Subscribe for Tips" button click
 */
function ThankYouConfetti({ onRetake, onSubscribe }) {
  // Simple SVG confetti animation (for demo: pure CSS-keyframes)
  // In production, could swap for a package like react-confetti if desired.
  return (
    <div
      style={{
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Confetti animated with CSS */}
      <style>{`
        .confetti-piece {
          position: absolute;
          top: 0;
          border-radius: 100%;
          opacity: 0.7;
          pointer-events: none;
          animation: confetti-fall 2.4s cubic-bezier(.34,.91,.7,1.1) infinite;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-40px) scale(1) rotate(0deg); opacity:1; }
          76% { opacity:0.84; }
          100% { transform: translateY(330px) scale(1.25) rotate(330deg); opacity:0; }
        }
      `}</style>
      {/* Render several SVG/confetti divs with staggered timing/colors */}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => {
        const lefts = ["10%", "23%", "38%", "52%", "67%", "84%", "30%", "58%", "77%", "61%", "42%"];
        const colors = [
          "var(--primary)", "var(--accent)", "#fff174", "#bdecb6", "var(--secondary)",
          "#e87a41", "#7ae451", "#ffd170", "#4A90E2", "#50E3C2", "#F5A623"
        ];
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: lefts[i % lefts.length],
              width: 22 + (i%3)*5,
              height: 16 + (i%2)*7,
              background: colors[i % colors.length],
              filter:
                i % 2
                  ? "drop-shadow(0 1.5px 6px #fec)"
                  : "drop-shadow(0 2.7px 10px #4A90E250)",
              animationDelay: `${i * 0.19 + (i%2)*0.22}s`,
              zIndex: 0,
            }}
          />
        );
      })}
      <div style={{ zIndex: 1, textAlign: "center", marginTop: 52 }}>
        <div>
          {/* Large success icon */}
          <span
            style={{
              fontSize: 70,
              lineHeight: "72px",
              color: "var(--accent)",
              filter: "drop-shadow(0 0 12px #ffc33222)"
            }}
            aria-hidden
          >
            🎉
          </span>
        </div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "2.7rem",
            margin: "35px 0 14px 0",
            color: "var(--primary)",
            textShadow: "0 1.5px 9px #1bc18610",
            letterSpacing: 0.2
          }}
          tabIndex={-1}
        >
          You’re one step safer now.
        </h2>
        <div
          style={{
            color: "var(--text-secondary)",
            fontSize: 20,
            marginBottom: 32,
            fontWeight: 500
          }}
        >
          Thanks for completing your cyber & contract assessment.
        </div>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginBottom: 20 }}>
          <button
            className="btn btn-large"
            style={{
              background: "var(--secondary)",
              color: "#111",
              fontWeight: 700,
              fontSize: 18,
              minWidth: 170,
              boxShadow: "0 3px 18px #50E3C220"
            }}
            onClick={() => onRetake && onRetake()}
          >
            Retake Assessment
          </button>
          <button
            className="btn btn-large"
            style={{
              border: "2.3px solid var(--primary)",
              background: "var(--accent)",
              color: "#222",
              fontWeight: 700,
              fontSize: 18,
              minWidth: 170,
              boxShadow: "0 3px 18px #F5A62318"
            }}
            onClick={() => onSubscribe && onSubscribe()}
          >
            Subscribe for Tips
          </button>
        </div>
        <div style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 9 }}>
          We don’t share your info. Stay vigilant, stay safe!
        </div>
      </div>
    </div>
  );
}

export default ThankYouConfetti;
