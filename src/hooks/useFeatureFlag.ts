import React, { useState, useEffect } from 'react';
import { featureFlags, type FeatureFlagValue, type UserContext } from '@/lib/feature-flags';

/**
 * React hook for feature flags
 * @param key - Feature flag key
 * @param context - Optional user context for targeting
 * @returns The evaluated feature flag value
 */
export function useFeatureFlag(key: string, context?: UserContext): FeatureFlagValue {
  const [value, setValue] = useState(() => featureFlags.getFlag(key, context));

  useEffect(() => {
    // Track exposure
    featureFlags.trackExposure(key, context);

    // Subscribe to changes
    const unsubscribe = featureFlags.subscribe(key, setValue);
    return unsubscribe;
  }, [key, context]);

  return value;
}

/**
 * Hook to check if a feature is enabled
 * @param key - Feature flag key
 * @param context - Optional user context
 * @returns Boolean indicating if feature is enabled
 */
export function useIsFeatureEnabled(key: string, context?: UserContext): boolean {
  const value = useFeatureFlag(key, context);
  return Boolean(value);
}

/**
 * HOC for feature flagged components
 * @param Component - Component to conditionally render
 * @param flagKey - Feature flag key
 * @param fallback - Optional fallback component
 * @returns Feature flagged component
 */
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flagKey: string,
  fallback?: React.ComponentType<P>
): React.ComponentType<P> {
  return function FeatureFlaggedComponent(props: P) {
    const isEnabled = useIsFeatureEnabled(flagKey);
    
    if (isEnabled) {
      return React.createElement(Component, props);
    }
    
    if (fallback) {
      const FallbackComponent = fallback;
      return React.createElement(FallbackComponent, props);
    }
    
    return null;
  };
}