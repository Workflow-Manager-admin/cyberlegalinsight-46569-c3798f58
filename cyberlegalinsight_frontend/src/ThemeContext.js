import React, { createContext, useContext, useMemo, useEffect, useState } from "react";

// PUBLIC_INTERFACE
export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * ThemeProvider: Provides theme state (light or dark) and handles CSS variable switching/animation.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Prefer user's saved preference or match media
    let local = typeof window !== "undefined" ? window.localStorage.getItem("cli_theme") : null;
    if (local === "light" || local === "dark") return local;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches)
      return "light";
    return "dark";
  });

  // PUBLIC_INTERFACE
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Apply theme CSS variables with an animated transition
  useEffect(() => {
    const root = document.documentElement;
    // Add CSS class for transitions (if not already)
    root.classList.add("theme-transition");
    window.localStorage.setItem("cli_theme", theme);

    // Define color palettes for both themes
    const palettes = {
      light: {
        "--primary": "#4A90E2",
        "--secondary": "#50E3C2",
        "--accent": "#F5A623",
        "--base-light": "#ffffff",
        "--base-dark": "#e8edf7",
        "--text-color": "#1A1A1A",
        "--text-secondary": "rgba(28,28,28,0.7)",
        "--border-color": "rgba(74,144,226,0.15)",
      },
      dark: {
        "--primary": "#4A90E2",
        "--secondary": "#50E3C2",
        "--accent": "#F5A623",
        "--base-light": "#00ffff",
        "--base-dark": "#00002a",
        "--text-color": "#ffffff",
        "--text-secondary": "rgba(255,255,255,0.7)",
        "--border-color": "rgba(255,255,255,0.11)",
      },
    };
    // Animated variable change
    for (const [k, v] of Object.entries(palettes[theme])) {
      root.style.setProperty(k, v);
    }
    // Remove the transition class after animation
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 350); // matches CSS transition duration
    return () => clearTimeout(timeout);
  }, [theme]);

  const contextValue = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTheme() {
  return useContext(ThemeContext);
}
