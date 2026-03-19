import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
  listeners.forEach((fn) => fn());
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

// Apply on module load so DOM matches system/stored preference immediately
if (typeof window !== "undefined") applyTheme(getTheme());

// Minimal external store for React
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
}
