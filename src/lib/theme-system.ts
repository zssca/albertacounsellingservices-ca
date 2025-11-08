/**
 * Advanced Theme System with CSS Variables
 * Supports light/dark/system themes with custom color schemes
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'high-contrast' | 'colorblind-safe';

interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;
  
  // Component colors
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Interactive colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  
  // Semantic colors
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  
  // UI colors
  border: string;
  input: string;
  ring: string;
  
  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

interface ThemeConfig {
  mode: ThemeMode;
  scheme: ColorScheme;
  radius: number;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

const defaultTheme: ThemeConfig = {
  mode: 'system',
  scheme: 'default',
  radius: 0.625,
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
};

// Color definitions for different schemes
const colorSchemes: Record<ColorScheme, { light: ThemeColors; dark: ThemeColors }> = {
  default: {
    light: {
      background: 'oklch(0.99 0.002 85.87)',
      foreground: 'oklch(0.25 0.015 85.87)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.25 0.015 85.87)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.25 0.015 85.87)',
      primary: 'oklch(0.45 0.08 160)',
      primaryForeground: 'oklch(0.99 0.002 85.87)',
      secondary: 'oklch(0.85 0.04 200)',
      secondaryForeground: 'oklch(0.25 0.015 85.87)',
      muted: 'oklch(0.93 0.01 85.87)',
      mutedForeground: 'oklch(0.52 0.02 85.87)',
      accent: 'oklch(0.75 0.06 35)',
      accentForeground: 'oklch(0.99 0.002 85.87)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.99 0 0)',
      border: 'oklch(0.88 0.008 85.87)',
      input: 'oklch(0.96 0.005 85.87)',
      ring: 'oklch(0.45 0.08 160)',
      chart1: 'oklch(0.55 0.12 160)',
      chart2: 'oklch(0.65 0.08 200)',
      chart3: 'oklch(0.7 0.08 35)',
      chart4: 'oklch(0.6 0.06 280)',
      chart5: 'oklch(0.72 0.05 120)',
    },
    dark: {
      background: 'oklch(0.15 0.01 85.87)',
      foreground: 'oklch(0.95 0.005 85.87)',
      card: 'oklch(0.18 0.01 85.87)',
      cardForeground: 'oklch(0.95 0.005 85.87)',
      popover: 'oklch(0.18 0.01 85.87)',
      popoverForeground: 'oklch(0.95 0.005 85.87)',
      primary: 'oklch(0.65 0.1 160)',
      primaryForeground: 'oklch(0.15 0.01 85.87)',
      secondary: 'oklch(0.25 0.02 200)',
      secondaryForeground: 'oklch(0.95 0.005 85.87)',
      muted: 'oklch(0.22 0.008 85.87)',
      mutedForeground: 'oklch(0.65 0.01 85.87)',
      accent: 'oklch(0.6 0.08 35)',
      accentForeground: 'oklch(0.95 0.005 85.87)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.95 0 0)',
      border: 'oklch(0.3 0.01 85.87)',
      input: 'oklch(0.2 0.008 85.87)',
      ring: 'oklch(0.65 0.1 160)',
      chart1: 'oklch(0.6 0.12 160)',
      chart2: 'oklch(0.55 0.08 200)',
      chart3: 'oklch(0.6 0.08 35)',
      chart4: 'oklch(0.55 0.06 280)',
      chart5: 'oklch(0.62 0.05 120)',
    },
  },
  'high-contrast': {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0 0 0)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0 0 0)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0 0 0)',
      primary: 'oklch(0.3 0.15 160)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.8 0.05 200)',
      secondaryForeground: 'oklch(0 0 0)',
      muted: 'oklch(0.9 0 0)',
      mutedForeground: 'oklch(0.3 0 0)',
      accent: 'oklch(0.7 0.1 35)',
      accentForeground: 'oklch(0 0 0)',
      destructive: 'oklch(0.5 0.3 27)',
      destructiveForeground: 'oklch(1 0 0)',
      border: 'oklch(0 0 0)',
      input: 'oklch(0.95 0 0)',
      ring: 'oklch(0.3 0.15 160)',
      chart1: 'oklch(0.4 0.2 160)',
      chart2: 'oklch(0.5 0.15 200)',
      chart3: 'oklch(0.6 0.15 35)',
      chart4: 'oklch(0.5 0.1 280)',
      chart5: 'oklch(0.6 0.1 120)',
    },
    dark: {
      background: 'oklch(0 0 0)',
      foreground: 'oklch(1 0 0)',
      card: 'oklch(0.05 0 0)',
      cardForeground: 'oklch(1 0 0)',
      popover: 'oklch(0.05 0 0)',
      popoverForeground: 'oklch(1 0 0)',
      primary: 'oklch(0.7 0.15 160)',
      primaryForeground: 'oklch(0 0 0)',
      secondary: 'oklch(0.3 0.05 200)',
      secondaryForeground: 'oklch(1 0 0)',
      muted: 'oklch(0.15 0 0)',
      mutedForeground: 'oklch(0.7 0 0)',
      accent: 'oklch(0.65 0.1 35)',
      accentForeground: 'oklch(1 0 0)',
      destructive: 'oklch(0.75 0.25 22)',
      destructiveForeground: 'oklch(0 0 0)',
      border: 'oklch(1 0 0)',
      input: 'oklch(0.1 0 0)',
      ring: 'oklch(0.7 0.15 160)',
      chart1: 'oklch(0.65 0.2 160)',
      chart2: 'oklch(0.6 0.15 200)',
      chart3: 'oklch(0.65 0.15 35)',
      chart4: 'oklch(0.6 0.1 280)',
      chart5: 'oklch(0.65 0.1 120)',
    },
  },
  'colorblind-safe': {
    light: {
      background: 'oklch(0.99 0.002 85.87)',
      foreground: 'oklch(0.25 0.015 85.87)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.25 0.015 85.87)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.25 0.015 85.87)',
      primary: 'oklch(0.5 0.15 265)', // Blue
      primaryForeground: 'oklch(0.99 0.002 85.87)',
      secondary: 'oklch(0.7 0.15 90)', // Orange
      secondaryForeground: 'oklch(0.25 0.015 85.87)',
      muted: 'oklch(0.93 0.01 85.87)',
      mutedForeground: 'oklch(0.52 0.02 85.87)',
      accent: 'oklch(0.6 0.1 180)', // Cyan
      accentForeground: 'oklch(0.99 0.002 85.87)',
      destructive: 'oklch(0.55 0.25 30)', // Vermillion
      destructiveForeground: 'oklch(0.99 0 0)',
      border: 'oklch(0.88 0.008 85.87)',
      input: 'oklch(0.96 0.005 85.87)',
      ring: 'oklch(0.5 0.15 265)',
      chart1: 'oklch(0.5 0.15 265)', // Blue
      chart2: 'oklch(0.7 0.15 90)', // Orange
      chart3: 'oklch(0.6 0.1 180)', // Cyan
      chart4: 'oklch(0.6 0.15 330)', // Pink
      chart5: 'oklch(0.65 0.1 60)', // Yellow
    },
    dark: {
      background: 'oklch(0.15 0.01 85.87)',
      foreground: 'oklch(0.95 0.005 85.87)',
      card: 'oklch(0.18 0.01 85.87)',
      cardForeground: 'oklch(0.95 0.005 85.87)',
      popover: 'oklch(0.18 0.01 85.87)',
      popoverForeground: 'oklch(0.95 0.005 85.87)',
      primary: 'oklch(0.65 0.15 265)',
      primaryForeground: 'oklch(0.15 0.01 85.87)',
      secondary: 'oklch(0.75 0.15 90)',
      secondaryForeground: 'oklch(0.15 0.01 85.87)',
      muted: 'oklch(0.22 0.008 85.87)',
      mutedForeground: 'oklch(0.65 0.01 85.87)',
      accent: 'oklch(0.65 0.1 180)',
      accentForeground: 'oklch(0.15 0.01 85.87)',
      destructive: 'oklch(0.65 0.2 30)',
      destructiveForeground: 'oklch(0.95 0 0)',
      border: 'oklch(0.3 0.01 85.87)',
      input: 'oklch(0.2 0.008 85.87)',
      ring: 'oklch(0.65 0.15 265)',
      chart1: 'oklch(0.65 0.15 265)',
      chart2: 'oklch(0.75 0.15 90)',
      chart3: 'oklch(0.65 0.1 180)',
      chart4: 'oklch(0.65 0.15 330)',
      chart5: 'oklch(0.7 0.1 60)',
    },
  },
};

class ThemeSystem {
  private static instance: ThemeSystem;
  private config: ThemeConfig;
  private listeners: Set<(config: ThemeConfig) => void> = new Set();

  private constructor() {
    this.config = this.loadConfig();
    this.applyTheme();
    this.setupSystemThemeListener();
  }

  static getInstance(): ThemeSystem {
    if (!ThemeSystem.instance) {
      ThemeSystem.instance = new ThemeSystem();
    }
    return ThemeSystem.instance;
  }

  private loadConfig(): ThemeConfig {
    if (typeof window === 'undefined') return defaultTheme;
    
    const stored = localStorage.getItem('theme-config');
    if (stored) {
      try {
        return { ...defaultTheme, ...JSON.parse(stored) };
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme-config', JSON.stringify(this.config));
  }

  private setupSystemThemeListener(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.config.mode === 'system') {
        this.applyTheme();
      }
    });
  }

  private getEffectiveMode(): 'light' | 'dark' {
    if (this.config.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.config.mode;
  }

  applyTheme(): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const mode = this.getEffectiveMode();
    const colors = colorSchemes[this.config.scheme][mode];

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Apply other theme variables
    root.style.setProperty('--radius', `${this.config.radius}rem`);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.fontSize = fontSizeMap[this.config.fontSize];

    // Apply classes
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('reduced-motion', this.config.reducedMotion);
    root.classList.toggle('high-contrast', this.config.highContrast);

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? 'oklch(0.15 0.01 85.87)' : 'oklch(1 0 0)');
    }
  }

  updateConfig(updates: Partial<ThemeConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  getConfig(): ThemeConfig {
    return { ...this.config };
  }

  subscribe(listener: (config: ThemeConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getConfig()));
  }

  // Utility methods
  setMode(mode: ThemeMode): void {
    this.updateConfig({ mode });
  }

  setScheme(scheme: ColorScheme): void {
    this.updateConfig({ scheme });
  }

  setFontSize(fontSize: ThemeConfig['fontSize']): void {
    this.updateConfig({ fontSize });
  }

  toggleReducedMotion(): void {
    this.updateConfig({ reducedMotion: !this.config.reducedMotion });
  }

  toggleHighContrast(): void {
    this.updateConfig({ highContrast: !this.config.highContrast });
  }
}

export const themeSystem = ThemeSystem.getInstance();