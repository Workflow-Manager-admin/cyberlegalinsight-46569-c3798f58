import React from "react";

/**
 * ChatSidebar component
 * Usage:
 *   <ChatSidebar messages={[{from: "AI", text: "Hello"}]} onSend={fn} />
 *
 * Props:
 *   - messages: array of { from: "AI"|"User", text: string }
 *   - onSend: function(messageText) => void
 */
// PUBLIC_INTERFACE
function ChatSidebar({ messages = [], onSend }) {
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 10 }}>AI Chat Legal Assistant</div>
      <div style={{
        flex: 1,
        fontSize: 13,
        color: "var(--text-secondary)",
        marginBottom: 10,
        maxHeight: 180,
        overflowY: "auto"
      }}>
        {(messages.length ? messages : [{ from: "AI", text: "Ask me about contracts, legal risks, or cyber safety." }])
          .map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 6, textAlign: msg.from === "User" ? "right" : "left" }}>
              <span
                style={{
                  background: msg.from === "AI" ? "var(--primary)" : "var(--base-light)",
                  color: msg.from === "AI" ? "#fff" : "#111",
                  borderRadius: 9,
                  padding: "3px 10px",
                  display: "inline-block",
                  fontSize: 13
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
      </div>
      <form
        style={{ display: "flex", gap: 8 }}
        onSubmit={e => {
          e.preventDefault();
          const input = e.target.elements.chat;
          if (input.value.trim() && onSend) {
            onSend(input.value);
            input.value = "";
          }
        }}
      >
        <input
          name="chat"
          type="text"
          placeholder="Type your question..."
          style={{ flex: 1, borderRadius: 5, padding: "5px 8px", fontSize: 13 }}
        />
        <button className="btn" style={{ fontSize: 13, padding: "4px 10px" }}>Send</button>
      </form>
    </div>
  );
}

export default ChatSidebar;
