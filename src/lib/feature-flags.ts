/**
 * Advanced Feature Flags System
 * Supports A/B testing, gradual rollouts, and user targeting
 */

export type FeatureFlagValue = boolean | string | number | Record<string, unknown>;

export interface FeatureFlag {
  key: string;
  defaultValue: FeatureFlagValue;
  description: string;
  rolloutPercentage?: number;
  targetRules?: TargetRule[];
  variants?: Variant[];
  metadata?: Record<string, unknown>;
}

export interface TargetRule {
  attribute: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'in' | 'regex';
  value: unknown;
}

export interface Variant {
  key: string;
  value: FeatureFlagValue;
  weight: number; // 0-100
}

export interface UserContext {
  id: string;
  attributes: Record<string, unknown>;
}

// Define feature flags
const FEATURE_FLAG_DEFINITIONS: FeatureFlag[] = [
  {
    key: 'new_booking_flow',
    defaultValue: false,
    description: 'Enable new appointment booking flow',
    rolloutPercentage: 50,
  },
  {
    key: 'ai_chat_support',
    defaultValue: false,
    description: 'Enable AI-powered chat support',
    targetRules: [
      { attribute: 'plan', operator: 'equals', value: 'premium' },
    ],
  },
  {
    key: 'theme_variants',
    defaultValue: 'default',
    description: 'Test different theme variants',
    variants: [
      { key: 'default', value: 'default', weight: 70 },
      { key: 'modern', value: 'modern', weight: 20 },
      { key: 'classic', value: 'classic', weight: 10 },
    ],
  },
  {
    key: 'performance_monitoring',
    defaultValue: true,
    description: 'Enable detailed performance monitoring',
    rolloutPercentage: 100,
  },
  {
    key: 'offline_mode',
    defaultValue: false,
    description: 'Enable offline mode with service worker',
    rolloutPercentage: 80,
  },
];

class FeatureFlagsManager {
  private static instance: FeatureFlagsManager;
  private flags: Map<string, FeatureFlag>;
  private overrides: Map<string, FeatureFlagValue> = new Map();
  private evaluationCache: Map<string, FeatureFlagValue> = new Map();
  private listeners: Map<string, Set<(value: FeatureFlagValue) => void>> = new Map();

  private constructor() {
    this.flags = new Map(FEATURE_FLAG_DEFINITIONS.map(flag => [flag.key, flag]));
    this.loadOverrides();
    this.setupDevTools();
  }

  static getInstance(): FeatureFlagsManager {
    if (!FeatureFlagsManager.instance) {
      FeatureFlagsManager.instance = new FeatureFlagsManager();
    }
    return FeatureFlagsManager.instance;
  }

  private loadOverrides(): void {
    if (typeof window === 'undefined') return;

    // Load from localStorage
    const stored = localStorage.getItem('feature-flag-overrides');
    if (stored) {
      try {
        const overrides = JSON.parse(stored);
        Object.entries(overrides).forEach(([key, value]) => {
          this.overrides.set(key, value as FeatureFlagValue);
        });
      } catch (error) {
        console.error('Failed to load feature flag overrides:', error);
      }
    }

    // Load from URL params (for testing)
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      if (key.startsWith('ff_')) {
        const flagKey = key.substring(3);
        this.overrides.set(flagKey, this.parseValue(value));
      }
    });
  }

  private parseValue(value: string): FeatureFlagValue {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value))) return Number(value);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  private setupDevTools(): void {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;

    // Expose to window for debugging
    (window as unknown as { __featureFlags?: unknown }).__featureFlags = {
      list: () => this.listFlags(),
      get: (key: string) => this.getFlag(key),
      set: (key: string, value: FeatureFlagValue) => this.setOverride(key, value),
      clear: (key: string) => this.clearOverride(key),
      clearAll: () => this.clearAllOverrides(),
    };
  }

  evaluate(key: string, context?: UserContext): FeatureFlagValue {
    // Check overrides first
    if (this.overrides.has(key)) {
      return this.overrides.get(key)!;
    }

    // Check cache
    const cacheKey = `${key}:${context?.id || 'anonymous'}`;
    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey)!;
    }

    const flag = this.flags.get(key);
    if (!flag) {
      console.warn(`Feature flag "${key}" not found`);
      return false;
    }

    let value = flag.defaultValue;

    // Evaluate target rules
    if (flag.targetRules && context) {
      const matchesRules = flag.targetRules.every(rule => 
        this.evaluateRule(rule, context.attributes)
      );
      if (!matchesRules) {
        this.evaluationCache.set(cacheKey, value);
        return value;
      }
    }

    // Handle rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      const hash = this.hashString(context?.id || 'anonymous' + key);
      const percentage = Math.abs(hash) % 100;
      if (percentage >= flag.rolloutPercentage) {
        this.evaluationCache.set(cacheKey, flag.defaultValue);
        return flag.defaultValue;
      }
    }

    // Handle variants
    if (flag.variants && flag.variants.length > 0) {
      value = this.selectVariant(flag.variants, context?.id || 'anonymous' + key);
    }

    this.evaluationCache.set(cacheKey, value);
    return value;
  }

  private evaluateRule(rule: TargetRule, attributes: Record<string, unknown>): boolean {
    const attributeValue = attributes[rule.attribute];
    
    switch (rule.operator) {
      case 'equals':
        return attributeValue === rule.value;
      case 'contains':
        return String(attributeValue).includes(String(rule.value));
      case 'gt':
        return Number(attributeValue) > Number(rule.value);
      case 'lt':
        return Number(attributeValue) < Number(rule.value);
      case 'in':
        return Array.isArray(rule.value) && (rule.value as unknown[]).includes(attributeValue);
      case 'regex':
        return new RegExp(String(rule.value)).test(String(attributeValue));
      default:
        return false;
    }
  }

  private selectVariant(variants: Variant[], seed: string): FeatureFlagValue {
    const hash = Math.abs(this.hashString(seed)) % 100;
    let accumulator = 0;

    for (const variant of variants) {
      accumulator += variant.weight;
      if (hash < accumulator) {
        return variant.value;
      }
    }

    return variants[variants.length - 1].value;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  getFlag(key: string, context?: UserContext): FeatureFlagValue {
    return this.evaluate(key, context);
  }

  isEnabled(key: string, context?: UserContext): boolean {
    const value = this.evaluate(key, context);
    return Boolean(value);
  }

  subscribe(key: string, callback: (value: FeatureFlagValue) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notifyListeners(key: string, value: FeatureFlagValue): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(value));
    }
  }

  setOverride(key: string, value: FeatureFlagValue): void {
    this.overrides.set(key, value);
    this.saveOverrides();
    this.evaluationCache.clear();
    this.notifyListeners(key, value);
  }

  clearOverride(key: string): void {
    this.overrides.delete(key);
    this.saveOverrides();
    this.evaluationCache.clear();
    const flag = this.flags.get(key);
    if (flag) {
      this.notifyListeners(key, flag.defaultValue);
    }
  }

  clearAllOverrides(): void {
    this.overrides.clear();
    this.saveOverrides();
    this.evaluationCache.clear();
  }

  private saveOverrides(): void {
    if (typeof window === 'undefined') return;
    
    const overrides = Object.fromEntries(this.overrides);
    localStorage.setItem('feature-flag-overrides', JSON.stringify(overrides));
  }

  listFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  // Analytics integration
  trackExposure(key: string, context?: UserContext): void {
    const value = this.evaluate(key, context);
    
    // Send to analytics
    if (typeof window !== 'undefined') {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.('event', 'feature_flag_exposure', {
        flag_key: key,
        flag_value: String(value),
        user_id: context?.id,
      });
    }
  }
}

export const featureFlags = FeatureFlagsManager.getInstance();