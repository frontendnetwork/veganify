# AGENTS.md

## Development Commands

```bash
# Package manager: pnpm is required (enforced via preinstall script)
pnpm install          # Install dependencies
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server on port 1030
pnpm stage            # Start staging server on port 1031

# Quality assurance
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint issues
pnpm type-check       # Run TypeScript type checking

# Testing
pnpm test             # Run Jest unit tests
pnpm test:watch       # Run Jest in watch mode
pnpm test:coverage    # Run tests with coverage report
pnpm test:e2e         # Run Playwright end-to-end tests
```

## Project Architecture

### Technology Stack

- **Framework**: Next.js 16 with App Router pattern
- **Language**: TypeScript (mandatory, `any` type not acceptable)
- **Styling**: SCSS with modular structure
- **Internationalization**: next-intl for multi-language support
- **Performance**: Million.js compiler optimization
- **Testing**: Jest for unit tests, Playwright for E2E
- **Package Manager**: pnpm (enforced)

### Key Directory Structure

```
src/
├── app/[locale]/          # App Router pages with i18n
├── components/            # React components
│   ├── shared/           # Shared components across app
│   └── ComponentName/    # Feature-specific components
│       ├── hooks/        # Component-specific hooks
│       ├── utils/        # Component utilities with tests
│       ├── models/       # Component-specific types
│       └── index.tsx     # Main component file
├── models/               # Global type definitions
├── i18n/                # next-intl routing configuration
├── locales/             # Translation files (cz, de, en, es, fr, pl, pt-br)
├── styles/              # SCSS styles organized by purpose
└── tests/               # Test setup and E2E tests
```

### Application Features

- **Product Search**: Barcode scanning and manual entry for vegan product verification
- **Ingredients Checker**: Analyzes ingredient lists for non-vegan items
- **Scanner**: Camera-based barcode scanning using Quagga.js
- **Internationalization**: Support for 7 languages with locale-based routing

### Component Architecture

- Components follow a structured directory pattern with dedicated folders for utilities, models, and hooks
- State management uses React hooks pattern
- Product data flows through ProductResult and Sources models
- Error handling includes specific states for different API response scenarios

### Data Sources

- OpenFoodFacts API and OpenBeautyFacts API for product data
- Veganify Ingredients API for ingredient analysis
- Open EAN Database for barcode lookups

## Development Guidelines

### Code Quality Requirements

- All utility functions must have 100% test coverage using Jest
- TypeScript is mandatory with proper type definitions in models/ folders
- Follow conventional commits specification for commit messages
- Use ESLint configuration (includes Next.js and custom rules)

### Testing Strategy

- Unit tests for all utilities (required)
- Component tests not currently required
- E2E tests using Playwright cover basic user flows
- Tests run automatically in CI/CD pipeline

### Styling Conventions

- Use SCSS exclusively, organized in styles/ directory
- Modular approach with separate files for components, globals, and pages
- CSS variables for theming and repeated values
- Component-scoped styles when possible

### Internationalization

- Add translations to ALL language files in locales/ when adding new strings
- Use next-intl translation keys consistently
- Follow existing key structure conventions
