import React, { useRef, useState } from "react";

/**
 * FileUpload component - Secure, unified user contract input
 * Usage: <FileUpload ... />
 *
 * Props:
 *   - onUpload: function({ type: 'file'|'text', content: string|File, name?: string }) => void
 *   - onRemove: function() => void  // optional, notifies parent when input cleared
 *   - value: { type, content, name? } // current uploaded data (optional, for controlled)
 */
// PUBLIC_INTERFACE
function FileUpload({ onUpload, onRemove, value }) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const allowedExts = [".pdf", ".doc", ".docx", ".txt"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const fileInputRef = useRef();
  const [textArea, setTextArea] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [inputValue, setInputValue] = useState(value || null);

  // Validate file selection
  const handleFile = (file) => {
    if (
      !allowedTypes.includes(file.type) &&
      !allowedExts.some(ext => file.name.toLowerCase().endsWith(ext))
    ) {
      setStatus("Unsupported file type.");
      fileInputRef.current.value = "";
      return;
    }
    if (file.size > maxSize) {
      setStatus("File size exceeds 10 MB.");
      fileInputRef.current.value = "";
      return;
    }
    setStatus("");
    setPreview(null);
    if (typeof onUpload === "function") {
      onUpload({ type: "file", content: file, name: file.name });
    }
    setInputValue({ type: "file", content: file, name: file.name });
    // Optional: preview plaintext for .txt files (show content in a preview below)
    if (
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result.slice(0, 1000));
      reader.readAsText(file);
    }
  };

  // Clean and validate pasted text
  const sanitizeText = (txt) => {
    return (txt || "")
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  };

  const handleTextChange = (e) => {
    setTextArea(e.target.value);
  };

  const handleTextSubmit = (e) => {
    e && e.preventDefault();
    const value = sanitizeText(textArea);
    if (!value) {
      setStatus("Please paste contract text.");
      return;
    }
    if (value.length > 200000) {
      setStatus("Text too long (max 200,000 chars).");
      return;
    }
    setStatus("");
    setPreview(value.slice(0, 1000));
    setInputValue({ type: "text", content: value });
    if (typeof onUpload === "function") {
      onUpload({ type: "text", content: value });
    }
  };

  // Remove/reset input (file or text)
  const handleRemove = () => {
    setInputValue(null);
    setTextArea("");
    setPreview(null);
    setStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (typeof onRemove === "function") onRemove();
  };

  // Display details/status
  let detailBlock = null;
  if (inputValue && inputValue.type === "file") {
    detailBlock = (
      <div style={{ margin: "10px 0", fontSize: 13 }}>
        <b>Uploaded file:</b> {inputValue.name}{" "}
        <span style={{ color: "var(--text-secondary)" }}>
          ({Math.round(inputValue.content.size / 1024)} KB)
        </span>
        <button
          className="btn"
          style={{
            marginLeft: 15,
            background: "#e34d4f", color: "#fff", fontSize: 12, padding: "2px 12px"
          }}
          type="button"
          onClick={handleRemove}
        >Remove</button>
        {preview && (
          <div
            style={{
              marginTop: 7,
              padding: 8,
              background: "rgba(255,255,255,0.09)",
              borderRadius: 6,
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              color: "#80f9e5",
              fontSize: 12,
              maxHeight: 120,
              overflow: "auto",
            }}
          >
            <b>Preview:</b>
            <div>{preview}</div>
          </div>
        )}
      </div>
    );
  } else if (inputValue && inputValue.type === "text") {
    detailBlock = (
      <div style={{ margin: "10px 0", fontSize: 13 }}>
        <b>Text provided.</b>{" "}
        <span style={{ color: "var(--text-secondary)" }}>
          ({inputValue.content.length} chars)
        </span>
        <button
          className="btn"
          style={{
            marginLeft: 15,
            background: "#e34d4f", color: "#fff", fontSize: 12, padding: "2px 12px"
          }}
          type="button"
          onClick={handleRemove}
        >Remove</button>
        <div
          style={{
            marginTop: 7,
            padding: 8,
            background: "rgba(255,255,255,0.09)",
            borderRadius: 6,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            color: "#80f9e5",
            fontSize: 12,
            maxHeight: 120,
            overflow: "auto",
          }}
        >
          <b>Preview:</b>
          <div>{inputValue.content.slice(0, 1000)}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label style={{ fontWeight: 500, fontSize: 15 }}>
        Upload Contract or Paste Text
      </label>
      {detailBlock ? (
        <div style={{ margin: "8px 0 8px 0" }}>
          {detailBlock}
          <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            Document ready for analysis. <span role="img" aria-label="success">✅</span>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 10, margin: "14px 0", flexWrap: "wrap" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ flex: 1, minWidth: 140, fontSize: 14 }}
              onChange={e => {
                const f = e.target.files && e.target.files[0];
                if (f) handleFile(f);
              }}
              aria-label="Select file to upload"
            />
            <form style={{ flex: 2, minWidth: 200, display: "flex", flexDirection: "column" }} onSubmit={handleTextSubmit}>
              <textarea
                rows={4}
                placeholder="Or paste contract text here..."
                style={{
                  borderRadius: 6,
                  padding: 6,
                  minWidth: 180,
                  fontSize: 13,
                  marginBottom: 7,
                  resize: "vertical",
                }}
                value={textArea}
                onChange={handleTextChange}
                onPaste={e => {
                  // Ensure paste is sanitized
                  setTimeout(() => setTextArea(sanitizeText(e.target.value)), 12);
                }}
                aria-label="Paste contract text"
              />
              <button className="btn" type="submit" style={{ alignSelf: "flex-end", fontSize: 12, padding: "4px 15px" }}>
                Paste & Use Text
              </button>
            </form>
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            Supported: PDF, DOC, DOCX, TXT or plain text. Max 10MB file.
          </div>
        </>
      )}
      <div style={{ minHeight: 20, color: status.includes("success") ? "var(--secondary)" : "#d97070", fontSize: 13 }}>
        {status}
      </div>
    </div>
  );
}

export default FileUpload;
