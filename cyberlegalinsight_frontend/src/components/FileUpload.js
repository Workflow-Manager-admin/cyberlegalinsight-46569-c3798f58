import React, { useRef } from "react";

/**
 * FileUpload component - Secure, unified user contract input
 * Usage: <FileUpload onUpload={handleUpload} />
 *
 * Props:
 *   - onUpload: function({ type: 'file'|'text', content: string|File, name?: string }) => void
 *       * type: whether upload was a file or pasted text
 *       * content: sanitized text (for text) or File (with .name/.size/.type)
 *
 * Security:
 *   - Accepts only allowed doc/text formats (PDF/DOC/DOCX/TXT)
 *   - Max file size enforced (10MB)
 *   - Sanitizes pasted text
 *   - Prepared for secure upload & processing pipeline
 */
// PUBLIC_INTERFACE
function FileUpload({ onUpload }) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  // Max 10MB
  const maxSize = 10 * 1024 * 1024;
  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (
      !allowedTypes.includes(file.type) &&
      ![".pdf", ".doc", ".docx", ".txt"].some(ext => file.name.toLowerCase().endsWith(ext))
    ) {
      alert("Unsupported file type.");
      fileInputRef.current.value = ""; // reset file input
      return;
    }
    if (file.size > maxSize) {
      alert("File size exceeds 10 MB.");
      fileInputRef.current.value = "";
      return;
    }
    if (typeof onUpload === "function") {
      onUpload({ type: "file", content: file, name: file.name });
    }
  };

  const sanitizeText = (txt) => {
    // Remove code/script tags, excessive whitespace etc
    return (txt || "")
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  };

  const handleText = (e) => {
    const value = sanitizeText(e.target.value);
    if (value.length > 0 && typeof onUpload === "function") {
      onUpload({ type: "text", content: value });
    }
  };

  return (
    <div>
      <label style={{ fontWeight: 500, fontSize: 15 }}>
        Upload Contract or Paste Text
      </label>
      <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ flex: 1, fontSize: 14 }}
          onChange={e => {
            const f = e.target.files && e.target.files[0];
            if (f) handleFile(f);
          }}
        />
        <textarea
          rows={4}
          placeholder="Or paste contract text here..."
          style={{
            flex: 2,
            borderRadius: 6,
            padding: 6,
            minWidth: 180,
            fontSize: 13,
          }}
          onBlur={handleText}
          onPaste={e => {
            // Optional: clean pasted text live on Ctrl+V
            setTimeout(() => handleText(e), 10);
          }}
        />
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
        Supported: PDF, DOC, DOCX, TXT or plain text. Max 10MB file.
      </div>
    </div>
  );
}

export default FileUpload;
