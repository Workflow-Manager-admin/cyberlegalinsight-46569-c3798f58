import React, { useState } from "react";

/**
 * QuestionFlow component
 * Handles adaptive, branching question flows with state and response data capture.
 *
 * Usage:
 *   <QuestionFlow
 *      questions={questionSet}
 *      onComplete={(answers) => ...}
 *      initialData={optionalInitialAnswers}
 *   />
 *
 * Props:
 *   - questions: array of { id, text, type, options, next, required }
 *       * type: "single" (one-choice), "multi" (multi-choice), "text" (free input)
 *       * options: [string] (for single/multi)
 *       * next: function(currentAnswer, allAnswers) => id (question id to branch to) or string/question-id for direct (optional)
 *       * required: bool (must answer to proceed)
 *   - onComplete: function(answersObject) => void
 *   - initialData: { [id]: value } (optional)
 *
 * Features:
 *   - Handles dynamic branching via 'next' field/function
 *   - Captures all questions/answers in result object
 *   - Supports 'Back' navigation/history through flow
 *   - Validates required fields
 *   - Prepared for saving/loading of job state
 */
// PUBLIC_INTERFACE
function QuestionFlow({ questions = [], onComplete, initialData }) {
  // Build id->question lookup for fast access
  const questionMap = Object.fromEntries(questions.map(q => [q.id, q]));
  // Tracks answers
  const [answers, setAnswers] = useState({ ...(initialData || {}) });
  // Tracks ordered history of question id's traversed (for back navigation)
  const [history, setHistory] = useState(
    questions.length ? [questions[0].id] : []
  );
  // Current position in the history (not always at the end if user goes Back!)
  const [pos, setPos] = useState(history.length - 1);
  // For state on 'in progress' answer
  const [pendingValue, setPendingValue] = useState();

  if (!questions.length) {
    return <div>No questions to display.</div>;
  }

  const currentQid = history[pos];
  const currentQ = questionMap[currentQid];
  const isLast = (() => {
    // No next question based on current answer, or no next field
    if (!currentQ) return false;
    if (!currentQ.next) return true;
    // For branching, "next" may resolve to undefined
    const nextId = typeof currentQ.next === 'function'
      ? currentQ.next(answers[currentQid], answers)
      : currentQ.next;
    return !nextId || !questionMap[nextId];
  })();

  const handleNext = (value) => {
    // Save answer for this question
    const updatedAnswers = { ...answers, [currentQid]: value };
    setAnswers(updatedAnswers);

    // Determine next QID
    let nextId;
    if (currentQ.next) {
      nextId =
        typeof currentQ.next === "function"
          ? currentQ.next(value, updatedAnswers)
          : currentQ.next;
    }
    // If no more questions or invalid branch, submit
    if (!nextId || !questionMap[nextId]) {
      if (typeof onComplete === "function") onComplete(updatedAnswers);
      setHistory([...history.slice(0, pos + 1), "__COMPLETE__"]);
      setPos(pos + 1);
      setPendingValue(undefined);
    } else {
      // Branch to next question, drop any extra history
      setHistory([...history.slice(0, pos + 1), nextId]);
      setPos(pos + 1);
      setPendingValue(undefined);
    }
  };

  const goBack = () => {
    if (pos > 0) {
      setPos(pos - 1);
      setPendingValue(undefined);
    }
  };

  // Render adaptive UI for various types
  let content = null;
  if (currentQ) {
    content = (
      <div style={{ margin: "12px 0" }}>
        <div style={{ fontWeight: 500, fontSize: 17 }}>{currentQ.text}</div>
        {currentQ.type === "single" && currentQ.options ? (
          <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
            {currentQ.options.map(opt => (
              <button
                key={opt}
                className="btn"
                onClick={() => handleNext(opt)}
                style={{
                  fontSize: 13,
                  padding: "7px 22px",
                  fontWeight: 500,
                  background:
                    answers[currentQid] === opt
                      ? "var(--primary)"
                      : undefined,
                  color: answers[currentQid] === opt ? "#fff" : undefined,
                  outline:
                    answers[currentQid] === opt
                      ? "2px solid var(--secondary)"
                      : undefined
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : currentQ.type === "multi" && currentQ.options ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentQ.options.map(opt => (
              <label key={opt} style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={(
                    Array.isArray(answers[currentQid]) ? answers[currentQid] : []
                  ).includes(opt)}
                  onChange={e => {
                    const prev = Array.isArray(answers[currentQid])
                      ? answers[currentQid]
                      : [];
                    const nextVal = e.target.checked
                      ? [...prev, opt]
                      : prev.filter(v => v !== opt);
                    setPendingValue(nextVal);
                  }}
                />
                {" "}{opt}
              </label>
            ))}
            <button
              className="btn"
              style={{ marginTop: 12, padding: "7px 22px" }}
              disabled={!pendingValue || !pendingValue.length}
              onClick={() =>
                handleNext(
                  pendingValue ||
                    (Array.isArray(answers[currentQid]) ? answers[currentQid] : [])
                )
              }
            >
              Continue
            </button>
          </div>
        ) : (
          // Default: text/free entry
          <form
            onSubmit={e => {
              e.preventDefault();
              const v = pendingValue ?? "";
              if (currentQ.required && !v.trim()) return;
              handleNext(v);
            }}
            style={{ margin: "18px 0" }}
          >
            <input
              type="text"
              placeholder="Type your answer..."
              style={{
                borderRadius: 5,
                padding: "7px 12px",
                fontSize: 14,
                minWidth: 210
              }}
              value={pendingValue ?? answers[currentQid] ?? ""}
              onChange={e => setPendingValue(e.target.value)}
              required={!!currentQ.required}
            />
            <button className="btn" style={{ marginLeft: 12, padding: "7px 22px" }}>
              Submit
            </button>
          </form>
        )}
      </div>
    );
  } else if (history[pos] === "__COMPLETE__") {
    content = (
      <div style={{ fontWeight: 500, fontSize: 16, color: "var(--primary)" }}>
        Thank you! All questions completed.
      </div>
    );
  }

  return (
    <div>
      <h3>Dynamic Question Flow</h3>
      {content}
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn" onClick={goBack} disabled={pos === 0}>
          Back
        </button>
        {isLast && currentQ && (
          <button
            className="btn btn-large"
            onClick={() => handleNext(answers[currentQid])}
            style={{ marginLeft: 10 }}
            disabled={currentQ.required && !answers[currentQid]}
          >
            {history[pos] === "__COMPLETE__" ? "Done" : "Finish"}
          </button>
        )}
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 8 }}>
        [Answers and path are saved for later analysis. Branching adapts to user choices.]
      </div>
    </div>
  );
}

export default QuestionFlow;
