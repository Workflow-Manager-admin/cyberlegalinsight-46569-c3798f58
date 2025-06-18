import React from "react";

/**
 * AdaptiveQuestions component
 * Usage: <AdaptiveQuestions questions={[...]} onAnswer={fn} />
 *
 * Props:
 *   - questions: array of question objects { id, text, options }
 *   - onAnswer: function(questionId, answer) => void
 */
// PUBLIC_INTERFACE
function AdaptiveQuestions({ questions = [], onAnswer }) {
  return (
    <div>
      <h3>Adaptive Questions</h3>
      <div style={{ margin: "12px 0" }}>
        {[...(questions.length ? questions : [{ id: 1, text: "Placeholder question: Did you read your contract?", options: ["Yes", "No"] }])]
          .map(q =>
            <div key={q.id} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{q.text}</div>
              {q.options && q.options.length
                ? <div style={{ display: "flex", gap: 8 }}>
                    {q.options.map(opt =>
                      <button
                        key={opt}
                        className="btn"
                        onClick={() => onAnswer && onAnswer(q.id, opt)}
                        style={{ fontSize: 13, padding: "5px 14px" }}
                      >
                        {opt}
                      </button>
                    )}
                  </div>
                : <input
                    type="text"
                    placeholder="Your answer"
                    style={{ borderRadius: 4, padding: "6px 8px", fontSize: 13 }}
                    onBlur={e => onAnswer && onAnswer(q.id, e.target.value)}
                  />}
            </div>
          )}
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
        [Dynamic adaptation not implemented - placeholder only]
      </div>
    </div>
  );
}

export default AdaptiveQuestions;
