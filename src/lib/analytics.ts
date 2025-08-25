/**
 * Analytics and performance monitoring utilities
 */

import { clientEnv, featureFlags } from './env';

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track Core Web Vitals
  trackCoreWebVitals() {
    if (!featureFlags.isPerformanceMonitoringEnabled()) return;

    // First Contentful Paint
    this.observePerformanceEntry('first-contentful-paint', (entry) => {
      this.sendMetric('FCP', entry.startTime);
    });

    // Largest Contentful Paint
    this.observeLCP();

    // First Input Delay
    this.observeFID();

    // Cumulative Layout Shift
    this.observeCLS();
  }

  private observePerformanceEntry(entryType: string, callback: (entry: PerformanceEntry) => void) {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  private observeLCP() {
    this.observePerformanceEntry('largest-contentful-paint', (entry: any) => {
      this.sendMetric('LCP', entry.startTime);
    });
  }

  private observeFID() {
    this.observePerformanceEntry('first-input', (entry: any) => {
      this.sendMetric('FID', entry.processingStart - entry.startTime);
    });
  }

  private observeCLS() {
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        this.sendMetric('CLS', clsValue);
      }
    });
  }

  // Custom performance tracking
  startTiming(name: string): void {
    this.metrics.set(name, performance.now());
  }

  endTiming(name: string): number | null {
    const start = this.metrics.get(name);
    if (start === undefined) return null;

    const duration = performance.now() - start;
    this.metrics.delete(name);
    this.sendMetric(name, duration);
    return duration;
  }

  // Track user interactions
  trackFormSubmission(formName: string, success: boolean, duration?: number) {
    this.sendEvent('form_submission', {
      form_name: formName,
      success: success.toString(),
      duration: duration?.toString() || '',
    });
  }

  trackApiCall(endpoint: string, method: string, status: number, duration: number) {
    this.sendEvent('api_call', {
      endpoint,
      method,
      status: status.toString(),
      duration: duration.toString(),
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.sendEvent('javascript_error', {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500) || '',
      ...context,
    });
  }

  private sendMetric(name: string, value: number) {
    if (!featureFlags.isPerformanceMonitoringEnabled()) return;

    // Send to multiple analytics providers
    this.sendToVercelAnalytics(name, value);
    this.sendToCustomAnalytics(name, value);
  }

  private sendEvent(eventName: string, parameters: Record<string, string>) {
    if (!featureFlags.isAnalyticsEnabled()) return;

    // Send to analytics providers
    this.sendEventToProviders(eventName, parameters);
  }

  private sendToVercelAnalytics(name: string, value: number) {
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', name, { value });
    }
  }

  private sendToCustomAnalytics(name: string, value: number) {
    // Send to your custom analytics endpoint
    if (clientEnv.NODE_ENV === 'production') {
      fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, value, timestamp: Date.now() }),
      }).catch(() => {
        // Silent fail for analytics
      });
    }
  }

  private sendEventToProviders(eventName: string, parameters: Record<string, string>) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }

    // Custom analytics
    if (clientEnv.NODE_ENV === 'production') {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, parameters, timestamp: Date.now() }),
      }).catch(() => {
        // Silent fail for analytics
      });
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Initialize performance monitoring
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  performanceMonitor.trackCoreWebVitals();

  // Track page views
  trackPageView(window.location.pathname);

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno?.toString(),
      colno: event.colno?.toString(),
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
    });
  });
}

// Track page views
export function trackPageView(path: string) {
  if (!featureFlags.isAnalyticsEnabled()) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    });
  }
}

// Utility types for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    va?: (event: string, name: string, data?: any) => void;
  }
}