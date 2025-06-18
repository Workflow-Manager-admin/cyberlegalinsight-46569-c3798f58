import React, { useState } from 'react';
import './App.css';
import { ThemeProvider, useTheme } from './ThemeContext';

// Step labels for navigation/progress mockup
const STEP_LABELS = [
  'Intro',
  'Upload Contract',
  'Adaptive Questions',
  'AI Analysis',
  'Review Dashboard',
  'Export',
];

function AppInner() {
  // SPA step/progress state (0: Intro; progresses by user interaction)
  const [currentStep, setCurrentStep] = useState(0);

  // Theme
  const { theme, toggleTheme } = useTheme();

  // Navigation logic: forward/back
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Placeholder for main content steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <section className="hero">
            <div className="subtitle">CyberLegalInsight</div>
            <h1 className="title">Contract Risk & Cyber Behavior Analyzer</h1>
            <div className="description">
              Interactive legal safety, contract AI, and cyber risk dashboard—all in one. Start by uploading your document.
            </div>
            <button className="btn btn-large" onClick={goNext}>Get Started</button>
          </section>
        );
      case 1:
        return (
          <section>
            <h2>Step 1: Upload Contract</h2>
            <div className="description">[Placeholder: File Upload & Text Input area]</div>
            <button className="btn" onClick={goBack}>Back</button>
            <button className="btn btn-large" onClick={goNext}>Continue</button>
          </section>
        );
      case 2:
        return (
          <section>
            <h2>Step 2: Adaptive Questions</h2>
            <div className="description">[Placeholder: Dynamic question flow based on user answers]</div>
            <button className="btn" onClick={goBack}>Back</button>
            <button className="btn btn-large" onClick={goNext}>Continue</button>
          </section>
        );
      case 3:
        return (
          <section>
            <h2>Step 3: AI-driven Analysis</h2>
            <div className="description">[Placeholder: Real-time summary & clause risk highlighting]</div>
            <button className="btn" onClick={goBack}>Back</button>
            <button className="btn btn-large" onClick={goNext}>Continue</button>
          </section>
        );
      case 4:
        return (
          <section>
            <h2>Step 4: Results Dashboard</h2>
            <div className="description">[Placeholder: Charts, scores, detailed analysis, download/email options]</div>
            <button className="btn" onClick={goBack}>Back</button>
            <button className="btn btn-large" onClick={goNext}>Finish</button>
          </section>
        );
      case 5:
        return (
          <section>
            <h2>Export & Save Reports</h2>
            <div className="description">[Placeholder: Download, email, user history/profile/badges]</div>
            <button className="btn" onClick={goBack}>Back</button>
            <button className="btn btn-large" onClick={() => setCurrentStep(0)}>Restart</button>
          </section>
        );
      default:
        return null;
    }
  };

  // Placeholder progress bar/step indicator
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
              transition: 'all 0.2s'
            }}
          >
            {label}
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div style={{
              width: 16,
              height: 2,
              background: i < currentStep ? 'var(--base-light)' : 'var(--border-color)',
              borderRadius: 1
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Sidebars as placeholders: Chat (right), News/Phishing (left)
  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="logo">
            <span className="logo-symbol">*</span> CyberLegalInsight
          </div>
          {/* Animated theme toggle */}
          <button
            className="btn"
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
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <span aria-hidden style={{ fontSize: 18, display: "inline-block", transition: "transform 0.3s" }}>🌙</span>
            ) : (
              <span aria-hidden style={{ fontSize: 18, display: "inline-block", transition: "transform 0.3s" }}>☀️</span>
            )}
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

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 0,
          minWidth: 0, // keeps flex grow
        }}>
          <div className="container" style={{ width: '100%' }}>
            {renderProgressBar()}
            <div style={{ minHeight: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {renderStepContent()}
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