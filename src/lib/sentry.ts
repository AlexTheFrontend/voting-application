import React from 'react';

// Conditional Sentry import to avoid build errors when not available
let Sentry: any = null;
try {
  Sentry = require('@sentry/nextjs');
} catch (error) {
  console.warn('Sentry not available, error tracking disabled');
}

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!Sentry) {
    console.warn('Sentry not available, error tracking disabled');
    return;
  }

  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not provided, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
    
    // Error filtering
    beforeSend(event: any, hint: any) {
      // Don't send errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry captured error:', hint.originalException || hint.syntheticException);
        return null;
      }
      
      // Filter out known non-critical errors
      const error = hint.originalException;
      if (error && typeof error === 'object') {
        const message = error.toString();
        
        // Filter out network errors that are outside our control
        if (message.includes('Network Error') || message.includes('Failed to fetch')) {
          return null;
        }
        
        // Filter out browser extension errors
        if (message.includes('extension') || message.includes('moz-extension')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Performance monitoring configuration
    beforeSendTransaction(event: any) {
      // Sample transactions in production
      if (process.env.NODE_ENV === 'production' && Math.random() > 0.1) {
        return null;
      }
      return event;
    },
    
    // Additional configuration
    integrations: [
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}

// Custom error boundary component
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) {
  if (!Sentry) {
    // Return the component as-is if Sentry is not available
    return Component;
  }

  return Sentry.withErrorBoundary(Component, {
    fallback: fallback || SimpleErrorFallback,
    beforeCapture: (scope: any, error: any, errorInfo: any) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('componentStack', {
        componentStack: errorInfo.componentStack,
      });
    },
  });
}

// Simple error fallback component
function SimpleErrorFallback({ resetError }: { error: Error; resetError: () => void }) {
  return React.createElement('div', {
    className: 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'
  }, 
    React.createElement('div', { className: 'max-w-md w-full space-y-8' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h2', { className: 'mt-6 text-3xl font-extrabold text-gray-900' }, 'Something went wrong'),
        React.createElement('p', { className: 'mt-2 text-sm text-gray-600' }, 'An error occurred. Please try again.'),
        React.createElement('div', { className: 'mt-6 space-y-4' },
          React.createElement('button', {
            onClick: resetError,
            className: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }, 'Try again'),
          React.createElement('button', {
            onClick: () => window.location.href = '/',
            className: 'w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }, 'Go home')
        )
      )
    )
  );
}

// Utility functions for manual error tracking
export const captureException = (error: any) => { 
  if (Sentry) return Sentry.captureException(error); 
  console.error("captureException:", error); 
};

export const captureMessage = (message: string, level?: any) => { 
  if (Sentry) return Sentry.captureMessage(message, level); 
  console.log("captureMessage:", message); 
};

export const addBreadcrumb = (breadcrumb: any) => { 
  if (Sentry) return Sentry.addBreadcrumb(breadcrumb); 
  console.log("addBreadcrumb:", breadcrumb); 
};