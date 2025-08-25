import React from 'react';

declare module 'next-themes' {
  export interface ThemeProviderProps {
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
    attribute?: string | 'class';
    /**
     * Value of the HTML attribute when the theme is dark
     * @default 'dark'
     */
    value?: {
      light: string;
      dark: string;
    };
    /**
     * Nonce for the style tag
     */
    nonce?: string;
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    systemTheme: 'light' | 'dark' | undefined;
    themes: string[];
  };
}
