'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'taskflow-theme';

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

// A tiny external store: localStorage is the source of truth, and the DOM
// attribute is derived from it. Reading it here (instead of in an effect)
// keeps the component free of set-state-in-effect and avoids a hydration
// mismatch, because the server snapshot is always 'system'.
const listeners = new Set<() => void>();
let current: Theme = 'system';
let initialized = false;

function read(): Theme {
  if (!initialized) {
    const stored = localStorage.getItem(STORAGE_KEY);
    current = isTheme(stored) ? stored : 'system';
    initialized = true;
  }
  return current;
}

function write(next: Theme) {
  current = next;

  if (next === 'system') {
    delete document.documentElement.dataset.theme;
    localStorage.removeItem(STORAGE_KEY);
  } else {
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
  }

  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function serverSnapshot(): Theme {
  return 'system';
}

// Cycles system → light → dark. The choice is applied through `data-theme`,
// which flips `color-scheme` and therefore resolves every `light-dark()` token.
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, serverSnapshot);

  const nextTheme: Theme =
    theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  const currentLabel =
    theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark';
  const nextLabel =
    nextTheme === 'system'
      ? 'System'
      : nextTheme === 'light'
        ? 'Light'
        : 'Dark';

  return (
    <button
      type="button"
      onClick={() => write(nextTheme)}
      aria-label={`Theme: ${currentLabel}. Switch to ${nextLabel}.`}
      title={`Theme: ${currentLabel} (click for ${nextLabel})`}
      className="focus-ring rounded-md border border-border-strong px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      {currentLabel}
    </button>
  );
}
