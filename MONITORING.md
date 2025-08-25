# Monitoring & Observability Guide

## 📊 Overview
This application implements comprehensive monitoring across multiple dimensions:
- **Error Tracking** via Sentry
- **Performance Monitoring** with Core Web Vitals
- **Analytics** for user behavior
- **Security Monitoring** with CSP reporting

## 🐛 Error Tracking

### Sentry Configuration
Located in `src/lib/sentry.ts`

#### Key Features
- **Client-side error capture** with stack traces
- **Performance monitoring** with transaction tracking
- **Session replay** for debugging (10% sample rate)
- **Release tracking** for deployment correlation
- **Error filtering** to reduce noise

#### Error Categories Tracked
1. **JavaScript Errors** - Unhandled exceptions
2. **Network Errors** - API failures
3. **React Error Boundaries** - Component crashes
4. **Performance Issues** - Slow transactions

#### Configuration
```typescript
// Environment-specific settings
tracesSampleRate: production ? 0.1 : 1.0
replaysSessionSampleRate: 0.1
replaysOnErrorSampleRate: 1.0
```

### Error Boundary Implementation
```typescript
import { withErrorBoundary } from '@/lib/sentry';

export default withErrorBoundary(MyComponent, {
  fallback: ErrorFallbackComponent,
});
```

## ⚡ Performance Monitoring

### Core Web Vitals Tracking
Located in `src/lib/analytics.ts`

#### Metrics Monitored
- **First Contentful Paint (FCP)** - Target: < 1.5s
- **Largest Contentful Paint (LCP)** - Target: < 2.5s  
- **First Input Delay (FID)** - Target: < 100ms
- **Cumulative Layout Shift (CLS)** - Target: < 0.1

#### Custom Performance Tracking
```typescript
import { performanceMonitor } from '@/lib/analytics';

// Track custom operations
performanceMonitor.startTiming('form-submission');
// ... perform operation
performanceMonitor.endTiming('form-submission');

// Track API calls
performanceMonitor.trackApiCall('/api/votes', 'POST', 200, 150);
```

### Lighthouse CI
Configured in `lighthouserc.js` - Runs on every main branch deployment

#### Assertions
- Performance: > 90
- Accessibility: > 95  
- Best Practices: > 90
- SEO: > 90

## 🔒 Security Monitoring

### Content Security Policy (CSP)
Configured in `next.config.ts`

#### Headers Applied
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  // ... additional directives
```

#### CSP Violation Reporting
- Violations logged to browser console in development
- Production violations sent to monitoring endpoint

### Security Headers
- **HSTS**: Force HTTPS connections
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **Referrer-Policy**: Control referrer information
- **Permissions-Policy**: Restrict browser features

## 📈 Analytics & User Tracking

### Event Tracking
```typescript
// Form submissions
performanceMonitor.trackFormSubmission('voting-form', true, 1200);

// User interactions
performanceMonitor.trackEvent('button-click', { 
  component: 'voting-form',
  action: 'submit'
});
```

### Page View Tracking
Automatic page view tracking on route changes:
```typescript
trackPageView(window.location.pathname);
```

## 🚨 Alert Configuration

### Sentry Alerts
Set up in Sentry dashboard:

#### Error Rate Alerts
- **Threshold**: > 5 errors in 5 minutes
- **Recipients**: Development team
- **Actions**: Slack notification + Email

#### Performance Alerts  
- **Threshold**: LCP > 3 seconds (95th percentile)
- **Recipients**: Performance team
- **Actions**: Dashboard notification

### Custom Health Checks

#### API Health Endpoint
```typescript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "used": "45MB",
    "total": "128MB"
  }
}
```

#### Database Health
- Connection status monitoring
- Query performance tracking
- Connection pool monitoring

## 📊 Dashboard Access

### Production Dashboards
- **Sentry**: https://sentry.io/organizations/your-org/
- **Vercel Analytics**: https://vercel.com/your-team/your-project/analytics
- **Lighthouse CI**: Available in GitHub Actions artifacts

### Key Metrics Overview
| Service | Metric | Target | Alert Threshold |
|---------|--------|---------|-----------------|
| Sentry | Error Rate | < 0.1% | > 0.5% |
| Core Web Vitals | LCP | < 2.5s | > 3s |
| API | Response Time | < 200ms | > 500ms |
| Uptime | Availability | > 99.9% | < 99% |

## 🔧 Debugging & Troubleshooting

### Error Investigation Flow
1. **Check Sentry** for error details and stack traces
2. **Review Performance** metrics for related slowdowns  
3. **Check Security** headers for CSP violations
4. **Analyze User Flow** in session replays

### Performance Debugging
```bash
# Enable performance profiling
NEXT_DEBUG=1 npm run dev

# Bundle analysis
ANALYZE=true npm run build

# Lighthouse audit
npm run lighthouse
```

### Common Issues & Solutions

#### High Error Rate
1. Check recent deployments in Sentry releases
2. Review error patterns and affected users
3. Check if errors correlate with specific browsers/devices
4. Verify API endpoint availability

#### Poor Performance Scores
1. Analyze bundle size with webpack analyzer
2. Check for render-blocking resources
3. Verify lazy loading implementation
4. Review Core Web Vitals in field data

#### CSP Violations
1. Check browser console for violation details
2. Review recently added third-party scripts
3. Update CSP directives if legitimate
4. Monitor violation patterns for potential attacks

## 📋 Maintenance Tasks

### Daily
- [ ] Review error rate trends
- [ ] Check performance metric alerts
- [ ] Monitor API response times

### Weekly
- [ ] Analyze user behavior patterns
- [ ] Review security header compliance
- [ ] Check dependency vulnerabilities

### Monthly
- [ ] Performance optimization review
- [ ] Error trend analysis and fixes
- [ ] Security audit and updates
- [ ] Monitoring configuration review

## 🚨 Incident Response

### Error Rate Spike
1. Check Sentry for error details
2. Identify affected functionality
3. Rollback if critical issues found
4. Fix root cause and deploy patch
5. Post-incident review and documentation

### Performance Degradation
1. Check Core Web Vitals dashboard
2. Analyze recent code changes
3. Review server resource usage
4. Optimize critical path if needed
5. Monitor recovery metrics

### Security Alert
1. Assess threat severity
2. Review CSP violation details
3. Block malicious sources if needed
4. Update security configurations
5. Document incident and response