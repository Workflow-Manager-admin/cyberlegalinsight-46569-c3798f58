import React from 'react';

/**
 * FileUpload component
 * Usage: <FileUpload onUpload={handleUpload} />
 *
 * Props:
 *   - onUpload: function(File | string) => void
 */
// PUBLIC_INTERFACE
function FileUpload({ onUpload }) {
  return (
    <div>
      <label style={{ fontWeight: 500, fontSize: 15 }}>
        Upload Contract or Paste Text
      </label>
      <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
        <input
          type="file"
          style={{ flex: 1 }}
          accept=".pdf,.doc,.docx,.txt"
          onChange={e => {
            if (e.target.files && e.target.files[0] && onUpload) {
              onUpload(e.target.files[0]);
            }
          }}
        />
        <textarea
          rows={4}
          placeholder="Or paste contract text here..."
          style={{ flex: 2, borderRadius: 6, padding: 6, minWidth: 180, fontSize: 13 }}
          onBlur={e => {
            if (e.target.value.trim() && onUpload) {
              onUpload(e.target.value);
            }
          }}
        />
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
        Supported: PDF, DOC, DOCX, TXT or plain text.
      </div>
    </div>
  );
}

export default FileUpload;
