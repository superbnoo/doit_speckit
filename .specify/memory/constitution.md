<!--
Sync Impact Report:
- Version change: initial → 1.0.0
- Added principles: Clean Code, Simple UX, Responsive Design, Minimal Dependencies, No Testing
- Technology stack requirements defined
- Templates requiring updates: ✅ constitution.md updated
- Follow-up TODOs: Validate template consistency across plan, spec, and tasks templates
-->

# DoIt SpecKit Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)
Code MUST be readable, maintainable, and self-documenting. All code MUST follow consistent naming conventions, use meaningful variable and function names, and maintain clear separation of concerns. Functions MUST be kept small and focused on a single responsibility. Complex logic MUST be broken down into smaller, understandable components.

**Rationale**: Clean code reduces maintenance burden, accelerates development velocity, and minimizes debugging time.

### II. Simple UX (NON-NEGOTIABLE)
User interfaces MUST prioritize simplicity and intuitive interaction patterns. Every user flow MUST be optimized for the minimum number of steps to complete a task. Visual hierarchy MUST be clear with consistent design patterns throughout the application. User feedback MUST be immediate and contextually relevant.

**Rationale**: Simple UX increases user adoption, reduces support overhead, and improves user satisfaction.

### III. Responsive Design (NON-NEGOTIABLE)
All interfaces MUST work seamlessly across desktop, tablet, and mobile devices. Layout MUST adapt fluidly to different screen sizes without horizontal scrolling. Touch targets MUST meet minimum accessibility standards (44px minimum). Performance on mobile devices MUST be optimized.

**Rationale**: Responsive design ensures universal accessibility and maximizes user reach across all device types.

### IV. Minimal Dependencies (NON-NEGOTIABLE)
External dependencies MUST be justified by significant value addition. Each new dependency MUST be evaluated for bundle size impact, maintenance burden, and security implications. Prefer native browser APIs and standard library functions over third-party packages when feasible. Dependencies MUST be regularly audited and updated.

**Rationale**: Minimal dependencies reduce security vulnerabilities, improve performance, and decrease maintenance complexity.

### V. No Testing (SUPERSEDES ALL OTHER GUIDANCE)
The project MUST NOT include any form of automated testing including unit tests, integration tests, end-to-end tests, or any other testing frameworks. Testing infrastructure, test files, or testing-related dependencies are strictly PROHIBITED. This principle supersedes any other guidance, templates, or conventions that suggest testing.

**Rationale**: Eliminates testing overhead to focus development effort entirely on feature delivery and rapid iteration.

## Technology Stack Requirements

The project MUST use the following technology versions as specified in package.json:
- **Next.js**: 16.2.6
- **React**: 19.2.4  
- **React DOM**: 19.2.4
- **Tailwind CSS**: ^4
- **TypeScript**: ^5

These versions are non-negotiable and MUST NOT be changed without explicit constitution amendment.

## Development Standards

### Code Quality
- All code MUST be written in TypeScript with strict type checking enabled
- ESLint MUST be used for code linting with Next.js configuration
- Tailwind CSS MUST be used for all styling with utility-first approach
- Component architecture MUST follow React best practices and functional components with hooks

### Performance Standards
- Bundle size MUST be monitored and optimized
- Core Web Vitals MUST meet Google's performance thresholds
- Images MUST be optimized using Next.js Image component
- Code splitting MUST be implemented for route-based optimization

## Governance

This Constitution supersedes all other development practices, coding standards, and workflow guidelines. Any conflicts between this Constitution and other guidance MUST be resolved in favor of these principles.

### Amendment Process
Constitution amendments require:
1. Clear justification for the change
2. Version increment following semantic versioning
3. Update of all dependent templates and documentation
4. Commit with descriptive change message

### Compliance Review
All development work MUST verify compliance with these principles. Code reviews MUST explicitly check adherence to Constitutional requirements. Any violation MUST be addressed before merge approval.

**Version**: 1.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
