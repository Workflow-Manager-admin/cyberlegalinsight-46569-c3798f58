import React, { useState, useRef, useEffect } from "react";

/**
 * ChatSidebar component
 * A visually distinct, floating right-side chat assistant for legal/cyber Q&A.
 * Theme-aware, always accessible, and handles chat history, input, and example legal/safety Q&A.
 *
 * Usage:
 *   <ChatSidebar />
 *
 * PUBLIC_INTERFACE
 */
function ChatSidebar() {
  // Example starter messages (history persisted only per session for privacy)
  const [messages, setMessages] = useState([
    {
      from: "AI",
      text:
        "👋 Hi! I'm your legal & safety assistant. Ask me about contracts, privacy, or cyber risks. (Type a question below ↓)"
    },
    {
      from: "AI",
      text:
        "e.g. \"What does an NDA protect?\" — or — \"What happens if I breach a security clause?\""
    }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef();

  // Scroll to bottom on message update
  useEffect(() => {
    if (messagesEndRef.current && isOpen)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    // Update unread if closed when new AI message arrives
    if (!isOpen && messages.length > 0 && messages[messages.length - 1].from === "AI") {
      setUnreadCount((c) => c + 1);
    }
    if (isOpen) setUnreadCount(0);
    // eslint-disable-next-line
  }, [messages, isOpen]);

  // Theme colors for shadow/glass effect (not CSS: for floating distinctness)
  const shadowColor = "rgba(74,144,226,0.32)"; // blue themed
  const glassBgLight = "rgba(255,255,255,0.76)";
  const glassBgDark = "rgba(10,30,44,0.99)"; // fallback for dark
  const floatingBlur = "blur(8px)";

  // Canned/logic: simple pattern matching over user question
  // PUBLIC_INTERFACE
  function getCannedResponse(msg) {
    const txt = (msg || "").trim().toLowerCase();
    if (!txt) return null;
    if (/nda|non-disclosure/.test(txt))
      return "Non-disclosure agreements (NDAs) help protect confidential info. Be sure it spells out what info is covered, and how long obligations last.";
    if (/termination/.test(txt))
      return "Termination clauses define how/when a contract ends. Watch for auto-renewal, notice periods, and penalties.";
    if (/data.*privacy|privacy.*data/.test(txt))
      return "For data privacy, ensure the contract covers data handling, GDPR/CCPA compliance, and breach notification obligations.";
    if (/(cyber ?security|cybersecurity)/.test(txt))
      return "Cybersecurity clauses often specify required protections, incident response, and who is liable after a breach.";
    if (/liability|indemnif(y|ication)/.test(txt))
      return "Liability and indemnification clauses impact who pays for damages. Caps and exclusions matter—review those carefully.";
    if (/jurisdiction|governing law/.test(txt))
      return "Jurisdiction/governing law clauses say which country/state laws apply. This affects where disputes must be resolved.";
    if (/contract.*risk|risk.*contract/.test(txt))
      return "Typical contract risks: unclear terms, hidden obligations, harsh penalties, vague dispute resolution, or overbroad liability.";
    if (/security breach/.test(txt))
      return "After a security breach, notify affected parties promptly and follow laws or the contract's incident response section.";
    if (/help|what can you do|what do you do/.test(txt))
      return "I can answer general questions about contracts, legal/safety risk, and privacy/cyber provisions. Try \"What is a limitation of liability?\"";
    if (/ai/.test(txt))
      return "I use simulated, pre-set answers, not real legal advice. For legal decisions, always consult a qualified professional.";
    if (/hello|hi|hey|start|hola|bonjour|sup/.test(txt))
      return "Hello! How can I help with your contract or safety questions?";
    // Example: Breach scenario
    if (/breach/.test(txt))
      return "A breach usually means someone didn’t meet their obligations in the contract. Remedies depend on what is specified in your agreement!";
    // Fallback
    return "Sorry, I’m a demo AI and can’t answer that in detail. Try asking about NDAs, risk, privacy, or cybersecurity clauses.";
  }

  // PUBLIC_INTERFACE
  // Handle user submission
  const handleSend = (e) => {
    e && e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setMessages((msgs) => [
      ...msgs,
      { from: "User", text: userMsg }
    ]);
    setInput("");
    // Simulate AI response after short delay
    setTimeout(() => {
      const aiMsg = getCannedResponse(userMsg);
      setMessages((msgs) =>
        [...msgs, { from: "AI", text: aiMsg }]
      );
    }, 600);
  };

  // Floating toggle button for mobile/collapsed view
  const sidebarWidth = isOpen ? 352 : 38;

  // "Always accessible": user can open/close, but it's always floating and not covered by main app scroll
  return (
    <div
      style={{
        position: "fixed",
        top: 98,
        right: 18,
        width: sidebarWidth,
        maxWidth: "95vw",
        zIndex: 1810,
        transition: "width 0.34s cubic-bezier(.6,0,.3,1), box-shadow 0.28s",
        boxShadow: isOpen
          ? `0 8px 44px 0 ${shadowColor}`
          : `0 0 12px 3px #31344522`,
        borderRadius: 15,
        overflow: "visible",
        pointerEvents: "auto",
        backdropFilter: isOpen ? floatingBlur : "none",
        WebkitBackdropFilter: isOpen ? floatingBlur : "none"
      }}
      aria-label="Chat Legal Assistant Sidebar"
      tabIndex={-1}
      role="complementary"
    >
      <div
        style={{
          background: "var(--base-dark, #191c34)",
          border: isOpen ? "2.7px solid var(--primary, #4A90E2)" : "2px solid var(--primary)",
          borderRadius: 15,
          padding: isOpen ? "20px 15px 12px 19px" : "6px 3px",
          minHeight: isOpen ? 90 : 42,
          minWidth: isOpen ? 333 : 36,
          width: isOpen ? 352 : 36,
          boxSizing: "border-box",
          color: "var(--text-color, #fff)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "stretch",
          transition: "all 0.30s cubic-bezier(.75,0,.31,1)"
        }}
      >
        {/* Floating toggle button */}
        <button
          onClick={() => {
            setIsOpen((v) => !v);
            if (!isOpen) setUnreadCount(0);
          }}
          aria-label={isOpen ? "Close chat" : "Open legal/safety AI chat"}
          style={{
            position: "absolute",
            left: isOpen ? -43 : -6,
            top: isOpen ? 20 : 9,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            boxShadow: "0 2px 10px #4A90E235",
            cursor: "pointer",
            zIndex: 2,
            fontSize: 22,
            transition: "all 0.18s"
          }}
        >
          {isOpen ? (
            <span aria-hidden title="Hide chat" style={{ display: "block", fontWeight: 700, fontSize: 26 }}>&#8594;</span>
          ) : (
            <span aria-hidden title="Open chat" style={{ display: "block", fontWeight: 500, fontSize: 23 }}>
              💬
              {!!unreadCount && (
                <span style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  display: "inline-block",
                  minWidth: 18,
                  height: 18,
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: 11,
                  fontWeight: 800,
                  lineHeight: "18px",
                  textAlign: "center",
                  boxShadow: "0 0 8px #F5A62377",
                  pointerEvents: "none"
                }}>{unreadCount}</span>
              )}
            </span>
          )}
        </button>
        {isOpen && (
          <>
            <div style={{
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "var(--base-light)",
              marginBottom: 7,
              fontSize: 17.5,
              display: "flex",
              alignItems: "center",
              gap: 7
            }}>
              <span role="img" aria-label="chat assistant" style={{ fontSize: 20 }}>🤖</span>
              Legal Assistant
            </div>
            <div
              style={{
                flex: "1 1 130px",
                maxHeight: "38vh",
                minHeight: 117,
                overflowY: "auto",
                background: "rgba(74,144,226,0.059)",
                borderRadius: 10,
                marginBottom: 8,
                padding: "9px 6px 7px 6px",
                fontSize: 15,
                transition: "background 0.2s"
              }}
              aria-live="polite"
              tabIndex={0}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: msg.from === "User" ? "flex-end" : "flex-start"
                  }}
                >
                  <span
                    style={{
                      background: msg.from === "AI"
                        ? "linear-gradient(97deg, var(--primary, #4A90E2) 80%, var(--accent,#F5A623) 180%)"
                        : "var(--base-light, #fff)",
                      color: msg.from === "AI" ? "#fff" : "#29313e",
                      borderRadius: 8,
                      padding: "7px 14px",
                      boxShadow: msg.from === "AI"
                        ? "0 1px 7px #4A90E210"
                        : "0 0px 3px #e0e7ff",
                      fontSize: 15,
                      maxWidth: "85%",
                      minWidth: 34,
                      overflowWrap: "break-word",
                      alignSelf: msg.from === "User" ? "flex-end" : "flex-start",
                      fontWeight: msg.from === "AI" ? 500 : 480,
                      lineHeight: 1.6
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <form
              onSubmit={handleSend}
              style={{ display: "flex", gap: 9, marginTop: 2 }}
              autoComplete="off"
              aria-label="Chat submission form"
            >
              <input
                name="chat"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your legal/cyber question…"
                style={{
                  flex: 1,
                  borderRadius: 8,
                  padding: "9px 14px",
                  fontSize: 15,
                  border: "1.5px solid var(--border-color, #ccd)",
                  background: "var(--base-light, #fff)",
                  outline: "none",
                  color: "var(--text-color, #10101f)",
                  fontWeight: 480
                }}
                disabled={input.length > 350}
                maxLength={400}
                aria-label="Type your question"
              />
              <button
                className="btn"
                style={{
                  fontSize: 14,
                  padding: "5px 18px",
                  borderRadius: 7,
                  minWidth: 38
                }}
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                Send
              </button>
            </form>
            <div style={{
              fontSize: 11.5,
              color: "var(--text-secondary)",
              margin: "6px 6px 0 6px",
              textAlign: "center",
              fontStyle: "italic"
            }}>
              Example Q&A: NDAs, cyber clauses, liability, and privacy. <br />
              <span style={{ color: "var(--accent)" }}>Not legal advice.</span>
            </div>
          </>
        )}
        {/* Show vertical label + notification dot when closed */}
        {!isOpen && (
          <div style={{
            writingMode: "vertical-rl",
            fontWeight: 800,
            color: "var(--primary)",
            fontSize: 15,
            opacity: 0.88,
            marginLeft: 7,
            marginTop: 18,
            letterSpacing: 1.2,
            textShadow: "0 2px 12px #4A90E260"
          }}>
            ASK AI
            {!!unreadCount && (
              <span style={{
                position: "absolute",
                right: 4,
                top: 12,
                display: "inline-block",
                minWidth: 17,
                height: 17,
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "60%",
                fontSize: 11,
                fontWeight: 800,
                lineHeight: "17px",
                textAlign: "center",
                boxShadow: "0 0 8px #F5A62377",
                pointerEvents: "none"
              }}>{unreadCount}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;

