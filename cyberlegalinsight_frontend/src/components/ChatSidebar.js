import React, { useState, useRef, useEffect } from "react";

/**
 * ChatSidebar component
 * A floating right-side chat panel for legal/cyber Q&A using simulated/canned logic.
 *
 * Usage:
 *   <ChatSidebar />
 *
 * Manages its own message state and basic canned-response logic.
 * Stylish, fits main app branding, supports light/dark themes.
 *
 */
// PUBLIC_INTERFACE
function ChatSidebar() {
  const [messages, setMessages] = useState([
    {
      from: "AI",
      text:
        "👋 Hi! I'm your legal & safety assistant. Ask me about contracts, privacy, or cyber risk."
    }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const messagesEndRef = useRef();

  // Scroll to bottom on message update
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Canned/logic: simple pattern matching over user question
  function getCannedResponse(msg) {
    const txt = msg.trim().toLowerCase();
    if (!txt) return null;
    if (txt.includes("nda") || txt.includes("non-disclosure"))
      return "Non-disclosure agreements (NDAs) help protect confidential info. Be sure it spells out what info is covered, and how long obligations last.";
    if (txt.includes("termination"))
      return "Termination clauses define how/when a contract ends. Watch for auto-renewal, notice periods, and penalties.";
    if (txt.includes("data") && txt.includes("privacy"))
      return "For data privacy, ensure the contract covers data handling, GDPR/CCPA compliance, and breach notification obligations.";
    if (txt.includes("cyber security") || txt.includes("cybersecurity"))
      return "Cybersecurity clauses often specify required protections, incident response, and who is liable after a breach.";
    if (txt.includes("liability") || txt.includes("indemnify"))
      return "Liability and indemnification clauses impact who pays for damages. Caps and exclusions matter—review those carefully.";
    if (txt.includes("jurisdiction") || txt.includes("governing law"))
      return "Jurisdiction/gov. law clauses say which country/state laws apply. This affects where disputes must be resolved.";
    if (txt.includes("contract") && txt.includes("risk"))
      return "Typical contract risks: unclear terms, hidden obligations, harsh penalties, vague dispute resolution, or overbroad liability.";
    if (txt.includes("security breach"))
      return "After a security breach, notify affected parties promptly and follow laws or the contract's incident response section.";
    if (txt.includes("help") || txt.includes("what can you do"))
      return "I can answer general questions about contracts, risk, and safety. Try asking about NDAs or cyber clauses!";
    if (txt.includes("ai"))
      return "I use pre-set answers (not real legal advice). For legal decisions, always consult a qualified professional.";
    if (/hello|hi|hey|start|hola|bonjour/.test(txt))
      return "Hello! How can I help with your contract or safety questions?";
    // Fallback
    return "Sorry, I'm just a demo and can't answer that in detail. Try asking about NDAs, risk, privacy, or cybersecurity.";
  }

  // Handle user submission
  const handleSend = e => {
    e && e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setMessages(msgs => [
      ...msgs,
      { from: "User", text: userMsg }
    ]);
    setInput("");
    // Simulate AI response after short delay
    setTimeout(() => {
      const aiMsg = getCannedResponse(userMsg);
      setMessages(msgs =>
        [...msgs, { from: "AI", text: aiMsg }]
      );
    }, 600);
  };

  // Floating toggle button for mobile/collapsed view
  const sidebarWidth = isOpen ? 320 : 38;

  return (
    <div
      style={{
        position: "fixed",
        top: 94,
        right: 14,
        width: sidebarWidth,
        maxWidth: "94vw",
        zIndex: 1112,
        transition: "width 0.33s cubic-bezier(.7,0,.3,1), box-shadow 0.33s",
        boxShadow: isOpen
          ? "0 2px 24px #4A90E220"
          : "0 0 12px 3px #0001",
        borderRadius: 14,
        overflow: "visible",
        pointerEvents: "auto"
      }}
      aria-label="Chat Assistant Sidebar"
    >
      <div
        style={{
          background: "var(--base-dark, #00132a)",
          border: "2px solid var(--primary, #4A90E2)",
          borderRadius: 14,
          padding: isOpen ? "16px 13px 10px 15px" : "6px 3px",
          minHeight: 60,
          minWidth: isOpen ? 300 : 36,
          width: isOpen ? 320 : 36,
          boxSizing: "border-box",
          color: "var(--text-color, #fff)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "stretch",
          transition: "all 0.33s cubic-bezier(.7,0,.3,1)"
        }}
      >
        {/* Floating toggle button */}
        <button
          onClick={() => setIsOpen(v => !v)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          style={{
            position: "absolute",
            left: isOpen ? -39 : -2,
            top: 16,
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            boxShadow: "0 2px 10px #4A90E235",
            cursor: "pointer",
            zIndex: 2,
            fontSize: 19,
            transition: "all 0.23s"
          }}
        >
          {isOpen ? "→" : "💬"}
        </button>
        {isOpen && (
          <>
            <div style={{ fontWeight: 700, letterSpacing: 0.5, color: "var(--base-light)", marginBottom: 6, fontSize: 17, display: "flex", alignItems: "center", gap: 6 }}>
              <span role="img" aria-label="chat assistant" style={{ fontSize: 18 }}>🤖</span> Chat Assistant
            </div>
            <div
              style={{
                flex: 1,
                maxHeight: "36vh",
                minHeight: 102,
                overflowY: "auto",
                background: "rgba(74,144,226,0.06)",
                borderRadius: 9,
                marginBottom: 7,
                padding: 7,
                fontSize: 14,
                transition: "background 0.2s"
              }}
              aria-live="polite"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: 7,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: msg.from === "User" ? "flex-end" : "flex-start"
                  }}
                >
                  <span
                    style={{
                      background: msg.from === "AI" ? "var(--primary, #4A90E2)" : "var(--base-light, #fff)",
                      color: msg.from === "AI" ? "#fff" : "#10121a",
                      borderRadius: 8,
                      padding: "6px 12px",
                      boxShadow: msg.from === "AI" ? "0 1px 7px #4A90E215" : "0 0px 3px #ddd1",
                      fontSize: 14,
                      maxWidth: "84%",
                      overflowWrap: "break-word",
                      alignSelf: msg.from === "User" ? "flex-end" : "flex-start"
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSend}
              style={{ display: "flex", gap: 8, marginTop: 1 }}
              autoComplete="off"
            >
              <input
                name="chat"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a legal/cyber question…"
                style={{
                  flex: 1,
                  borderRadius: 6,
                  padding: "7px 12px",
                  fontSize: 14,
                  border: "1.5px solid var(--border-color, #ccd)",
                  background: "var(--base-light, #fff)",
                  outline: "none",
                  color: "var(--text-color, #111)"
                }}
                disabled={input.length > 300}
                maxLength={400}
                aria-label="Chat input"
              />
              <button
                className="btn"
                style={{
                  fontSize: 13,
                  padding: "4px 15px",
                  borderRadius: 6,
                  minWidth: 38
                }}
                type="submit"
                disabled={!input.trim()}
              >
                Send
              </button>
            </form>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", margin: "4px 4px 0 4px", textAlign: "center" }}>
              Answers are for informational/demo purposes only.<br />Not legal advice.
            </div>
          </>
        )}
        {/* (Optionally: Show vertical label when closed) */}
        {!isOpen && (
          <div style={{
            writingMode: "vertical-rl",
            fontWeight: 600,
            color: "var(--primary)",
            fontSize: 14,
            opacity: 0.8,
            marginLeft: 5,
            marginTop: 22,
            letterSpacing: 1
          }}>ASK AI</div>
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;

