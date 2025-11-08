'use client';

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

// Advanced TypeScript patterns
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, 'UserId'>;
type SessionId = Brand<string, 'SessionId'>;

// State shape with discriminated unions
type AppState = {
  user: UserState;
  ui: UIState;
  performance: PerformanceState;
  features: FeatureFlags;
};

type UserState = 
  | { status: 'loading' }
  | { status: 'authenticated'; id: UserId; data: UserData }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: Error };

type UIState = {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
};

type PerformanceState = {
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  saveData: boolean;
  deviceMemory: number;
  hardwareConcurrency: number;
};

type FeatureFlags = {
  newDesign: boolean;
  advancedAnalytics: boolean;
  experimentalFeatures: boolean;
};

type UserData = {
  name: string;
  email: string;
  preferences: Record<string, unknown>;
};

// Action types with type safety
type AppAction =
  | { type: 'SET_USER'; payload: UserState }
  | { type: 'SET_THEME'; payload: UIState['theme'] }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'SET_HIGH_CONTRAST'; payload: boolean }
  | { type: 'SET_FONT_SIZE'; payload: UIState['fontSize'] }
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<PerformanceState> }
  | { type: 'TOGGLE_FEATURE'; feature: keyof FeatureFlags };

// Initial state factory
const createInitialState = (): AppState => ({
  user: { status: 'loading' },
  ui: {
    theme: 'system',
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
  },
  performance: {
    connectionType: 'unknown',
    saveData: false,
    deviceMemory: 8,
    hardwareConcurrency: 4,
  },
  features: {
    newDesign: false,
    advancedAnalytics: false,
    experimentalFeatures: false,
  },
});

// Reducer with exhaustive type checking
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload },
      };
    
    case 'SET_REDUCED_MOTION':
      return {
        ...state,
        ui: { ...state.ui, reducedMotion: action.payload },
      };
    
    case 'SET_HIGH_CONTRAST':
      return {
        ...state,
        ui: { ...state.ui, highContrast: action.payload },
      };
    
    case 'SET_FONT_SIZE':
      return {
        ...state,
        ui: { ...state.ui, fontSize: action.payload },
      };
    
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: { ...state.performance, ...action.payload },
      };
    
    case 'TOGGLE_FEATURE':
      return {
        ...state,
        features: {
          ...state.features,
          [action.feature]: !state.features[action.feature],
        },
      };
    
    default: {
      return state;
    }
  }
}

// Context types
type AppContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: AppActions;
};

type AppActions = {
  setUser: (user: UserState) => void;
  setTheme: (theme: UIState['theme']) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: UIState['fontSize']) => void;
  updatePerformance: (data: Partial<PerformanceState>) => void;
  toggleFeature: (feature: keyof FeatureFlags) => void;
};

// Create contexts with proper types
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Custom hook with error boundary
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Granular hooks for performance
export function useUser() {
  const { state } = useAppContext();
  return state.user;
}

export function useTheme() {
  const { state, actions } = useAppContext();
  return {
    theme: state.ui.theme,
    setTheme: actions.setTheme,
  };
}

export function usePerformance() {
  const { state } = useAppContext();
  return state.performance;
}

export function useFeatureFlag<K extends keyof FeatureFlags>(flag: K): boolean {
  const { state } = useAppContext();
  return state.features[flag];
}

// Provider props
type AppProviderProps = {
  children: ReactNode;
  initialState?: Partial<AppState>;
};

// Main provider component
export function AppProvider({ children, initialState }: AppProviderProps) {
  const [state, dispatch] = useReducer(
    appReducer,
    createInitialState(),
    (initial) => ({ ...initial, ...initialState })
  );

  // Memoized actions to prevent unnecessary re-renders
  const actions = useMemo<AppActions>(
    () => ({
      setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
      setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
      setReducedMotion: (enabled) => dispatch({ type: 'SET_REDUCED_MOTION', payload: enabled }),
      setHighContrast: (enabled) => dispatch({ type: 'SET_HIGH_CONTRAST', payload: enabled }),
      setFontSize: (size) => dispatch({ type: 'SET_FONT_SIZE', payload: size }),
      updatePerformance: (data) => dispatch({ type: 'UPDATE_PERFORMANCE', payload: data }),
      toggleFeature: (feature) => dispatch({ type: 'TOGGLE_FEATURE', feature }),
    }),
    []
  );

  // Performance monitoring effect
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor connection type
    interface NetworkInformationLike {
      effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
      saveData?: boolean;
      addEventListener?: (type: 'change', listener: () => void) => void;
      removeEventListener?: (type: 'change', listener: () => void) => void;
    }

    type NavigatorWithConnection = Navigator & { connection?: NetworkInformationLike };

    const connection = (navigator as NavigatorWithConnection).connection;
    if (connection) {
      const normalizeEffectiveType = (
        value: NetworkInformationLike['effectiveType']
      ): PerformanceState['connectionType'] => {
        if (value === 'slow-2g' || value === '2g' || value === '3g' || value === '4g') {
          return value;
        }
        return 'unknown';
      };

      const updateConnection = () => {
        actions.updatePerformance({
          connectionType: normalizeEffectiveType(connection.effectiveType),
          saveData: connection.saveData || false,
        });
      };
      updateConnection();
      if (typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', updateConnection);
        return () => connection.removeEventListener?.('change', updateConnection);
      }
      return () => {};
    }
  }, [actions]);

  // Reduced motion detection
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      actions.setReducedMotion(e.matches);
    };
    
    actions.setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [actions]);

  // High contrast detection
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleChange = (e: MediaQueryListEvent) => {
      actions.setHighContrast(e.matches);
    };
    
    actions.setHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [actions]);

  const value = useMemo(
    () => ({ state, dispatch, actions }),
    [state, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Type guards
export function isAuthenticated(user: UserState): user is Extract<UserState, { status: 'authenticated' }> {
  return user.status === 'authenticated';
}

export function isLoading(user: UserState): user is Extract<UserState, { status: 'loading' }> {
  return user.status === 'loading';
}

// Utility functions
export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createSessionId(id: string): SessionId {
  return id as SessionId;
}