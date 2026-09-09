import { createContext, useContext, useEffect, useState } from "react";

const THEME_KEY = "adroit-theme";
const LEGACY_KEY = "adroit-nav-color";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
});

function readTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_KEY);
    if (stored === "dark" || stored === "black") return "dark";
    if (stored === "light" || stored === "white") return "light";
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyThemeClass(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const next = readTheme();
    applyThemeClass(next);
    return next;
  });

  useEffect(() => {
    applyThemeClass(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
