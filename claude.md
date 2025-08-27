# Claude Code Configuration

## Project Overview
This is a Next.js TypeScript application for programming language voting with Redux state management, built according to realestate.co.nz front-end engineering standards.

## Technology Stack
- **Framework**: Next.js 14+ with TypeScript
- **State Management**: Redux with Redux Toolkit
- **Styling**: Tailwind CSS with utility-first approach
- **Testing**: Jest + React Testing Library + Playwright (E2E)
- **Code Quality**: ESLint + Prettier with strict enforcement
- **CI/CD**: GitHub Actions
- **Monitoring**: New Relic/Sentry integration ready

## Development Commands
```bash
# Development
npm run dev

# Build and type checking
npm run build
npm run type-check

# Testing
npm run test           # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage report

# Code quality
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix linting issues
npm run format        # Prettier formatting

# Production readiness
```

## Architecture Guidelines

### Component Structure (Atomic Design)
- **Atoms**: Button, Input, Label, Text
- **Molecules**: FormField, LanguageDropdown
- **Organisms**: VotingForm, LanguageStatistics, ResponsesTable
- **Templates**: VotingPageTemplate
- **Pages**: VotePage

### State Management Rules
- Use Redux Toolkit for all global state
- Keep form state local until submission
- Backend is single source of truth
- Implement optimistic updates with rollback capability

### API Integration
- Assume RESTful endpoints:
  - `POST /api/submissions` - Submit/update vote
  - `GET /api/results` - Get statistics and all submissions
- All business logic (duplicate prevention, timestamps) handled by backend
- Client-side validation for UX only, never security

### Performance Requirements
- Core Web Vitals in the green
- Lazy load non-critical components
- Implement code splitting
- Mobile-first responsive design

### Testing Strategy
- Minimum 80% test coverage enforced in CI
- Unit tests for components, reducers, selectors
- Integration tests for API calls and data flow
- E2E tests for critical user journeys

### Security Considerations
- Follow OWASP Top-10 guidelines
- Server-side input sanitization required
- Client-side XSS prevention via React's built-in escaping
- Implement CSP headers
- Backend handles all authorization logic

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Semantic HTML5 elements
- ARIA landmarks and attributes
- Full keyboard navigation support
- Color contrast ratio compliance
- Screen reader compatibility

## File Structure
```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/
├── store/
│   ├── slices/
│   └── index.ts
├── services/
│   └── api.ts
├── utils/
├── types/
└── styles/
```

## Code Standards
- TypeScript strict mode enabled
- No `any` types allowed
- Functional components with hooks
- Props interfaces for all components
- Error boundaries for production resilience
- Consistent naming conventions (camelCase for JS, PascalCase for components)

## Environment Variables
```
NEXT_PUBLIC_API_BASE_URL=
NEW_RELIC_LICENSE_KEY=
```

## Deployment Checklist
- [ ] All tests passing
- [ ] ESLint and Prettier checks passed
- [ ] TypeScript compilation successful
- [ ] Security headers configured
- [ ] Error monitoring active
- [ ] Performance monitoring active

## Key Business Rules
1. Email-based duplicate prevention (upsert behavior)
2. Immediate display of results after submission
3. Results table grouped by language, ordered by time
4. Backend generates authoritative timestamps
5. Client shows real-time feedback during operations

## Performance Targets
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

## Monitoring & Observability
- Performance monitoring with New Relic
- Custom metrics for form submission success/failure rates
- API response time tracking
- Real user monitoring (RUM) for Core Web Vitals

## Future Considerations
- Real-time updates via WebSockets
- Advanced filtering/sorting for results table
- Data visualization charts
- Internationalization (i18n) support
- Admin panel for moderation
- Enhanced email verification (OTP)