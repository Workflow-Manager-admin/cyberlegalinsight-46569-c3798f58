import React, { useState, useRef } from 'react';
import './App.css';
import { ThemeProvider, useTheme } from './ThemeContext';
import FileUpload from "./components/FileUpload";
import QuestionFlow from "./components/QuestionFlow";
import LexiLockLogo from "./components/LexiLockLogo";

import AnalysisStep from "./components/AnalysisStep";

// Step labels for navigation/progress mockup
const STEP_LABELS = [
  'Intro',
  'Upload Contract',
  'Adaptive Questions',
  'AI Analysis',
  'Review Dashboard',
  'Export',
];

// Utility for trigger reflow (for animation resets)
function forceReflow(node) {
  void node?.offsetHeight;
}

function FadeSlideTransition({ children, mode, duration = 380 }) {
  // mode: "in"|"out"
  const nodeRef = useRef();
  React.useLayoutEffect(() => {
    if (mode === "in" && nodeRef.current) {
      forceReflow(nodeRef.current);
      nodeRef.current.classList.add("slide-fade-in");
      nodeRef.current.classList.remove("slide-fade-out");
    }
    if (mode === "out" && nodeRef.current) {
      forceReflow(nodeRef.current);
      nodeRef.current.classList.remove("slide-fade-in");
      nodeRef.current.classList.add("slide-fade-out");
    }
  }, [mode]);
  return (
    <div
      ref={nodeRef}
      className="slide-fade"
      style={{
        transition: `opacity ${duration}ms cubic-bezier(.62,0,.28,1), transform ${duration}ms cubic-bezier(.62,0,.28,1)`,
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
}

function ModalTransition({ open, children, duration = 350 }) {
  // CSS-based modal fade + scale pop
  const nodeRef = useRef();
  React.useLayoutEffect(() => {
    if (nodeRef.current) {
      if (open) {
        nodeRef.current.classList.add("modal-fade-in");
        nodeRef.current.classList.remove("modal-fade-out");
      } else {
        nodeRef.current.classList.remove("modal-fade-in");
        nodeRef.current.classList.add("modal-fade-out");
      }
    }
  }, [open]);
  return (
    <div
      ref={nodeRef}
      className="modal-fade"
      style={{
        transition: `opacity ${duration}ms cubic-bezier(.54,.01,.45,1.03), transform ${duration}ms cubic-bezier(.54,.01,.45,1.03)`,
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
}



// (Ensure there are no additional import statements for AnalysisPanel or RiskHighlighter below this point.)

function AppInner() {
  // SPA step/progress state (0: Intro; progresses by user interaction)
  const [currentStep, setCurrentStep] = useState(0);
  const [prevStep, setPrevStep] = useState(null);

  // Step 1 contract upload state
  const [step1upload, setStep1upload] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Adaptive Answers State
  // eslint-disable-next-line
  const [adaptiveAnswers, setAdaptiveAnswers] = useState({});

  // For modal/dialog showcase (e.g., for Export/email, badges overlay - demo only)
  const [modal, setModal] = useState(null); // null or { type, props }

  // Theme & animated toggle state
  const { theme, toggleTheme } = useTheme();
  const [themeIconAnim, setThemeIconAnim] = useState(false);

  // Navigation logic: forward/back
  const goNext = () => {
    setPrevStep(currentStep);
    setCurrentStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };
  const goBack = () => {
    setPrevStep(currentStep);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  // --- Step 3 Analysis logic and rendering ---
  // (AnalysisStep now imported as component)

  // Step content as keyed object to easily animate in/out
  const stepContents = {
    0: (
      <section className="hero" key={0}>
        <div className="subtitle">LexiLock</div>
        <h1 className="title">Contract Risk & Cyber Behavior Analyzer</h1>
        <div className="description">
          Interactive legal safety, contract AI, and cyber risk dashboard—all in one. Start by uploading your document.
        </div>
        <button className="btn btn-large" onClick={goNext}>Get Started</button>
      </section>
    ),
    1: (
      <section key={1}>
        <h2>Step 1: Upload Contract</h2>
        <FileUpload
          value={typeof step1upload === "object" ? step1upload : null}
          onUpload={data => {
            setStep1upload(data);
            setUploadError(null);
            setUploadSuccess(true);
          }}
          onRemove={() => {
            setStep1upload(null);
            setUploadError(null);
            setUploadSuccess(false);
          }}
        />
        <div className="description" style={{ minHeight: 22 }}>
          {uploadError && <span style={{ color: "#e34d4f" }}>{uploadError}</span>}
          {uploadSuccess && step1upload && (
            <span style={{ color: "var(--secondary)" }}>Upload successful! Your contract is ready.</span>
          )}
        </div>
        <button className="btn" onClick={goBack}>Back</button>
        <button
          className="btn btn-large"
          onClick={() => {
            if (!step1upload) {
              setUploadError("Please upload a contract file or enter text to continue.");
              setUploadSuccess(false);
              return;
            }
            setUploadError(null);
            setUploadSuccess(false);
            goNext();
          }}
          disabled={!step1upload}
        >
          Continue
        </button>
      </section>
    ),
    2: (
      <section key={2}>
        <h2>Step 2: Adaptive Questions</h2>
        <QuestionFlow
          // Example adaptive question set, fully extensible:
          questions={[
            {
              id: "q1",
              text: "What type of contract did you upload?",
              type: "single",
              options: ["Employment", "NDA", "Vendor/Supplier", "Consulting", "Other"],
              required: true,
              // Branch: go to NDA questions if NDA, else go to q2
              next: (val) => val === "NDA" ? "nda1" : "q2"
            },
            {
              id: "q2",
              text: "Are there clauses about data privacy in your contract?",
              type: "single",
              options: ["Yes", "No", "Not sure"],
              required: true,
              next: "q3"
            },
            {
              id: "q3",
              text: "What is your primary goal for this analysis?",
              type: "single",
              options: [
                "Check for legal/financial risk",
                "Data security review",
                "Regulatory compliance",
                "General contract understanding"
              ],
              required: true,
              next: "q4"
            },
            {
              id: "q4",
              text: "Any specific concerns with this agreement?",
              type: "text",
              required: false,
              next: null // End
            },
            // NDA branch example
            {
              id: "nda1",
              text: "Does the NDA specify a term (duration) of confidentiality?",
              type: "single",
              options: ["Yes", "No", "Not specified"],
              next: "nda2"
            },
            {
              id: "nda2",
              text: "Whose information is covered by this NDA?",
              type: "single",
              options: ["Your company", "Other party", "Both", "Not sure"],
              next: "nda3"
            },
            {
              id: "nda3",
              text: "Are there exceptions, such as prior knowledge or legal disclosure?",
              type: "single",
              options: ["Yes (exceptions listed)", "No exceptions", "Not sure"],
              next: "nda4"
            },
            {
              id: "nda4",
              text: "Enter any special clauses, carve-outs, or unique obligations if known:",
              type: "text",
              required: false,
              next: null
            },
          ]}
          onComplete={(answers) => {
            setAdaptiveAnswers(answers);
            goNext();
          }}
        />
        <button className="btn" onClick={goBack} style={{ marginTop: 28 }}>Back</button>
      </section>
    ),
    3: (
      <section key={3}>
        <h2>Step 3: AI-driven Analysis</h2>
        <AnalysisStep
          contract={step1upload}
          answers={adaptiveAnswers}
          onBack={goBack}
          onNext={goNext}
        />
      </section>
    ),
    4: (
      <section key={4}>
        <h2>Step 4: Results Dashboard</h2>
        <div className="description">[Placeholder: Charts, scores, detailed analysis, download/email options]</div>
        <button className="btn" onClick={goBack}>Back</button>
        <button className="btn btn-large" onClick={goNext}>Finish</button>
      </section>
    ),
    5: (
      <section key={5}>
        <h2>Export & Save Reports</h2>
        <div className="description">[Placeholder: Download, email, user history/profile/badges]</div>
        <button className="btn" onClick={goBack}>Back</button>
        <button className="btn btn-large" onClick={() => setCurrentStep(0)}>Restart</button>
      </section>
    ),
  };

  // Step transition direction for animation (right = next, left = back)
  const stepDirection = prevStep === null || currentStep > prevStep ? "right" : "left";


  // Progress Bar/Step Indicator
  const renderProgressBar = () => (
    <div style={{ margin: '24px 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
      {STEP_LABELS.map((label, i) => (
        <React.Fragment key={label}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 14,
              background: i === currentStep ? 'var(--base-light)' : 'var(--border-color)',
              color: i === currentStep ? '#000' : 'var(--text-secondary)',
              fontWeight: i === currentStep ? 600 : 400,
              fontSize: 14,
              minWidth: 60,
              textAlign: 'center',
              boxShadow: i === currentStep ? '0 0 4px #00ffff80' : undefined,
              transition: 'all 0.38s cubic-bezier(.62,0,.28,1)'
            }}
          >
            {label}
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div style={{
              width: 16,
              height: 2,
              background: i < currentStep ? 'var(--base-light)' : 'var(--border-color)',
              borderRadius: 1,
              transition: "background 0.35s cubic-bezier(.62,0,.28,1)"
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Modal dialog sample - REPLACE with real modal system as needed
  const showModal = (type, props) => setModal({ type, props });
  const hideModal = () => setModal(null);

  // Subtle animated icon + ripple for theme toggle
  const handleThemeToggle = () => {
    setThemeIconAnim(true);
    toggleTheme();
    setTimeout(() => setThemeIconAnim(false), 480);
  };

  // Sidebars as placeholders: Chat (right), News/Phishing (left)
  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="logo" style={{ gap: 10 }}> {/* Visually balance the gap */}
            <LexiLockLogo size={30} style={{ marginRight: 2 }} />
            <span>LexiLock</span>
          </div>
          {/* Animated theme toggle */}
          <button
            className="btn btn-theme-anim"
            style={{
              marginLeft: 14,
              background: "var(--secondary)",
              color: "#111",
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              gap: 8,
              transition: 'background 0.3s'
            }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            onClick={handleThemeToggle}
          >
            <span
              aria-hidden
              className={themeIconAnim ? "theme-icon-anim" : ""}
              style={{
                fontSize: 18,
                display: "inline-block",
                transition: "transform 0.38s cubic-bezier(.72,.01,.31,1.14)",
                transform: themeIconAnim
                  ? "scale(1.15) rotate(25deg)"
                  : "none"
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </span>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        </div>
      </nav>

      <div style={{
        display: 'flex',
        flex: 1,
        marginTop: 80, // below navbar
        minHeight: 0
      }}>
        {/* LEFT SIDEBAR (news feed/phishing simulation) */}
        <aside style={{
          width: 220,
          minWidth: 160,
          borderRight: '1px solid var(--border-color)',
          background: 'rgba(0,255,255,0.03)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            fontWeight: 600, color: 'var(--base-light)', marginBottom: 12
          }}>
            News & Phishing Alerts
          </div>
          <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 13 }}>
            [Placeholder: Cybersecurity news and phishing simulation feed]
          </div>
        </aside>

        {/* MAIN CONTENT WITH ANIMATED STEP TRANSITIONS */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 0,
          minWidth: 0, // keeps flex grow
          position: "relative", // needed for step stacking
          overflow: "hidden"
        }}>
          <div className="container" style={{ width: '100%' }}>
            {renderProgressBar()}
            <div
              className={`step-slider slider-${stepDirection}`}
              style={{
                minHeight: 350,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: "relative",
                width: "100%",
                overflow: "visible"
              }}
            >
              <FadeSlideTransition key={currentStep} mode="in">
                {stepContents[currentStep]}
              </FadeSlideTransition>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR (chat assistant) */}
        <aside style={{
          width: 280,
          minWidth: 180,
          borderLeft: '1px solid var(--border-color)',
          background: 'rgba(0,255,255,0.05)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            fontWeight: 600,
            color: 'var(--base-light)',
            marginBottom: 12
          }}>
            AI Chat Legal Assistant
          </div>
          <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 13 }}>
            [Placeholder: Chat about legal or safety topics]
          </div>
        </aside>
      </div>

      {/* Example animated modal/dialog, for demonstration */}
      {modal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.16)", zIndex: 1001,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
          <ModalTransition open={!!modal}>
            <div
              className="modal-content"
              style={{
                background: "var(--base-dark)",
                color: "var(--text-color)",
                borderRadius: 12,
                boxShadow: "0 2px 18px #0155d054",
                padding: "36px 38px",
                border: "2px solid var(--primary)",
                minWidth: 240, maxWidth: "94vw", minHeight: 96,
                textAlign: "center"
              }}>
              <div style={{ fontWeight: 700, fontSize: 21, color: "var(--accent)", marginBottom: 7 }}>
                {modal.type === "success" ? "Action Completed!" : "Dialog"}
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 21 }}>
                Example smooth entrance/exit. Integrate for real modals!
              </div>
              <button className="btn btn-large" onClick={hideModal}>Close</button>
            </div>
          </ModalTransition>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
