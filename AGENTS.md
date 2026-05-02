# AGENTS.md

## Development Commands

```bash
# Package manager: bun
bun install          # Install dependencies
bun run dev          # Start development server with Turbopack
bun run build        # Build for production
bun run start        # Start production server on port 1030
bun run stage        # Start staging server on port 1031

# Quality assurance
bun run lint         # Run Biome linter
bun run lint:fix     # Auto-fix Biome issues
bun run type-check   # Run TypeScript type checking

# Testing
bun test src/components  # Run Bun unit tests
bun test --watch src/components  # Run Bun tests in watch mode
bun test --coverage src/components  # Run tests with coverage report
bun run test:e2e     # Run Playwright end-to-end tests
```

## Project Architecture

### Technology Stack

- **Framework**: Next.js 16 with App Router pattern
- **Language**: TypeScript (mandatory, `any` type not acceptable)
- **Styling**: SCSS with modular structure
- **Internationalization**: next-intl for multi-language support
- **Performance**: Million.js compiler optimization
- **Testing**: Bun test runner for unit tests, Playwright for E2E
- **Package Manager**: bun

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

- All utility functions must have 100% test coverage using Bun test runner
- TypeScript is mandatory with proper type definitions in models/ folders
- Follow conventional commits specification for commit messages
- Use Biome for linting and formatting

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


# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
