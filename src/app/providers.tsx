'use client';

import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/store';
import { initializeAnalytics } from '@/lib/analytics';
import { validateEnvironment, isProduction } from '@/lib/env';

interface ProvidersProps {
  children: React.ReactNode;
}

function ProvidersInner({ children }: ProvidersProps) {
  useEffect(() => {
    // Initialize monitoring and analytics on client-side mount
    if (typeof window !== 'undefined') {
      try {
        // Validate environment configuration
        validateEnvironment();
        
        
        // Initialize performance monitoring and analytics
        initializeAnalytics();
        
        console.log('✅ Application monitoring initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize application monitoring:', error);
        
        // In production, we might want to send this to a fallback error service
        if (isProduction()) {
          // Could send to a simple error logging endpoint
          fetch('/api/health/error', {
            method: 'POST',
            body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
            headers: { 'Content-Type': 'application/json' },
          }).catch(() => {
            // Silent fail for error reporting
          });
        }
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

export const Providers = ProvidersInner;