'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Attribute = 'class' | 'data-theme' | 'data-bs-theme' | 'data-theme';

type ThemeProviderProps = {
  children: React.ReactNode;
  /**
   * The key used to store the theme in localStorage
   * @default 'theme'
   */
  storageKey?: string;
  /**
   * The default theme
   * @default 'system'
   */
  defaultTheme?: string;
  /**
   * Enable system theme detection
   * @default true
   */
  enableSystem?: boolean;
  /**
   * Disable all CSS transitions when switching themes
   * @default false
   */
  disableTransitionOnChange?: boolean;
  /**
   * HTML attribute modified based on the active theme
   * @default 'class'
   */
  attribute?: Attribute | Attribute[];
  /**
   * Value of the HTML attribute when the theme is dark
   * @default 'dark'
   */
  value?: {
    light: string;
    dark: string;
  };
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
