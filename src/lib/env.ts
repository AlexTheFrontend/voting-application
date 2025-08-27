/**
 * Environment configuration with type safety and validation
 */

// Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Voting Application',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  
  // Feature flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
  ENABLE_REAL_TIME_UPDATES: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES === 'true',
} as const;

// Server-side environment variables
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY || '',
  
  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
} as const;

// Environment validation
export function validateEnvironment() {
  const errors: string[] = [];
  
  // Production environment checks
  if (clientEnv.NODE_ENV === 'production') {
    
    if (!serverEnv.NEW_RELIC_LICENSE_KEY && clientEnv.ENABLE_PERFORMANCE_MONITORING) {
      errors.push('NEW_RELIC_LICENSE_KEY is required when performance monitoring is enabled in production');
    }
  }
  
  // Log warnings for missing optional variables
  const warnings: string[] = [];
  
  if (!serverEnv.DATABASE_URL) {
    warnings.push('DATABASE_URL is not set, using in-memory storage');
  }
  
  if (!serverEnv.REDIS_URL && clientEnv.ENABLE_REAL_TIME_UPDATES) {
    warnings.push('REDIS_URL is not set, real-time updates may not work properly');
  }
  
  // Log results
  if (warnings.length > 0) {
    console.warn('Environment warnings:', warnings.join(', '));
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }
  
  console.log(`Environment validated successfully for ${clientEnv.NODE_ENV}`);
}

// Feature flag utilities
export const featureFlags = {
  isAnalyticsEnabled: () => clientEnv.ENABLE_ANALYTICS,
  isErrorReportingEnabled: () => clientEnv.ENABLE_ERROR_REPORTING,
  isPerformanceMonitoringEnabled: () => clientEnv.ENABLE_PERFORMANCE_MONITORING,
  isRealTimeUpdatesEnabled: () => clientEnv.ENABLE_REAL_TIME_UPDATES,
} as const;

// Environment type guards
export const isDevelopment = () => clientEnv.NODE_ENV === 'development';
export const isProduction = () => clientEnv.NODE_ENV === 'production';
export const isTest = () => clientEnv.NODE_ENV === 'test';

// Runtime configuration
export const config = {
  app: {
    name: clientEnv.APP_NAME,
    version: clientEnv.APP_VERSION,
    environment: clientEnv.NODE_ENV,
  },
  api: {
    baseUrl: clientEnv.API_BASE_URL,
  },
  monitoring: {
    analytics: {
      enabled: clientEnv.ENABLE_ANALYTICS,
    },
  },
  features: featureFlags,
} as const;