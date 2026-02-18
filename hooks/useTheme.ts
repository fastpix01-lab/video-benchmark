"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("streambench-theme");
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      // No stored preference — apply light default
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = useCallback((t: "light" | "dark") => {
    setThemeState(t);
    localStorage.setItem("streambench-theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
