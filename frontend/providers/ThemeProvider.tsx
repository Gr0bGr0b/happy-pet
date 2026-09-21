import { colorScheme, useColorScheme } from 'nativewind';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import colors from '@/constants/colors';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  /** Raw hex for component *props* that className cannot reach. */
  palette: {
    text: string;
    muted: string;
    card: string;
    bg: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Backed by NativeWind so the in-app toggle and the dark: variants agree.
  // Requires darkMode: "class" in tailwind.config.js.
  const { colorScheme: scheme } = useColorScheme();
  const isDark = scheme === 'dark';

  const toggleTheme = useCallback(() => {
    colorScheme.set(isDark ? 'light' : 'dark');
  }, [isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme,
      palette: {
        text: isDark ? colors.white : colors.dark.bg,
        muted: isDark ? colors.muted.light : colors.muted.DEFAULT,
        card: isDark ? colors.dark.card : colors.light.card,
        bg: isDark ? colors.dark.bg : colors.light.bg,
        border: isDark ? colors.dark.border : colors.light.border
      }
    }),
    [isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
