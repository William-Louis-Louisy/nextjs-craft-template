'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SetStateAction,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (value: SetStateAction<Theme>) => void;
};

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'system';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') {
    return resolveTheme(theme);
  }

  const resolvedTheme = resolveTheme(theme);
  const root = document.documentElement;

  root.setAttribute('data-theme', resolvedTheme);
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

function persistTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.cookie = `${STORAGE_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(defaultTheme));

  useEffect(() => {
    const storedTheme = readStoredTheme();

    if (storedTheme !== theme) {
      setThemeState(storedTheme);
      setResolvedTheme(applyTheme(storedTheme));
      return;
    }

    setResolvedTheme(applyTheme(theme));
  }, []);

  useEffect(() => {
    setResolvedTheme(applyTheme(theme));
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        setResolvedTheme(applyTheme(theme));
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const nextTheme = isTheme(event.newValue) ? event.newValue : DEFAULT_THEME;
      setThemeState(nextTheme);
      setResolvedTheme(applyTheme(nextTheme));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = useCallback((value: SetStateAction<Theme>) => {
    setThemeState((currentTheme) => {
      const nextTheme = typeof value === 'function' ? value(currentTheme) : value;
      persistTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
