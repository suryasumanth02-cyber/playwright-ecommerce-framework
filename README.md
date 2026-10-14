# Playwright TypeScript E-Commerce Automation Framework

An end-to-end test automation framework built using Microsoft Playwright and TypeScript for testing the SauceDemo e-commerce web application.

The framework is designed to move beyond basic linear UI scripts by incorporating core patterns used in production test environments: Page Object Model (POM), custom fixtures, session storage reuse (`storageState`), network interception, accessibility scanning, visual snapshots, and CI/CD execution.

---

## Overview & Architecture

### Tech Stack
- **Language**: TypeScript (strict mode enabled)
- **Framework**: Microsoft Playwright Test (`@playwright/test`)
- **Accessibility**: `@axe-core/playwright` (WCAG 2.1 AA rules)
- **CI/CD**: GitHub Actions
- **Target Application**: [SauceDemo](https://www.saucedemo.com/)

### Project Layout

```text
├── .auth/                  # Generated storage states (cookies & session tokens)
├── .github/workflows/      # GitHub Actions CI workflow definition
├── src/
│   ├── config/             # Environment configs (base URLs, timeouts)
│   ├── data/               # Test data, credentials, and mock API payloads
│   ├── fixtures/           # Custom Playwright fixtures (test.extend)
│   ├── models/             # TypeScript interfaces (Product, User, Order)
│   ├── pages/              # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── ProductDetailsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── OrderConfirmationPage.ts
│   └── utils/              # Math helpers, price parsing, custom logger
├── tests/
│   ├── setup/              # Global auth setup project
│   ├── auth/               # Login & security audit tests
│   ├── e2e/                # Checkout, cart, sorting, PDP, and bulk purchase flows
│   ├── accessibility/      # axe-core WCAG 2.1 AA compliance scans
│   ├── network-mocking/    # page.route API intercepts & offline simulation
│   ├── api/                # Storage injection & direct request API checks
│   ├── performance/        # Navigation timings & console error monitoring
│   ├── personas/           # Testing problem_user and error_user behaviors
│   └── visual/             # Component-level visual snapshot tests
├── playwright.config.ts    # Browser matrix, workers, reporters, and device settings
├── package.json
└── tsconfig.json
```

---

## Key Framework Features

### 1. Page Object Model with Strict Typing
Every page has a corresponding class inheriting from `BasePage`. Locators and interactions are encapsulated within these classes, and methods return either the next page instance or typed data models (e.g., `Product`, `OrderSummary`).

```typescript
const productsPage = await loginPage.loginAs(USERS.standard);
const cartPage = await productsPage.goToCart();
const checkoutPage = await cartPage.proceedToCheckout();
```

### 2. Custom Fixtures (`test.extend`)
Instead of copy-pasting login and navigation steps into `beforeEach` hooks in every test file, tests declare what state they need via fixtures:
- `authenticatedUserPage`: Opens the app with a valid session already active.
- `cartWithItemsFixture`: Injects an authenticated session pre-populated with items in the cart.
- `loggedOutPage`: Ensures a clean, unauthenticated context with cleared cookies and local storage.

```typescript
test('should remove items directly from cart', async ({ cartWithItemsFixture }) => {
  const { cartPage } = cartWithItemsFixture;
  await cartPage.removeItem('Sauce Labs Backpack');
  expect(await cartPage.getCartItemCount()).toBe(1);
});
```

### 3. Session Reuse via `storageState`
Repeatedly logging in through the UI for every test adds significant overhead. The framework uses a setup project (`tests/setup/auth.setup.ts`) that logs in once before the suite runs, saves the browser session cookies and local storage to `.auth/user.json`, and feeds that file to worker threads. Tests that specifically validate login edge cases override this with an empty storage state.

### 4. Network Interception & API Mocking (`page.route`)
Tests use Playwright's `page.route()` to modify network traffic in-flight:
- Modifying client-side asset responses to simulate out-of-stock items.
- Injected custom HTML promotional banners directly into responses before page rendering.
- Mocking 500 internal server errors on external telemetry endpoints to check frontend resilience.
- Aborting image requests (`**/*.jpg`) to verify low-bandwidth scenarios.
- Simulating network disconnection with `context.setOffline(true)`.

### 5. Automated Accessibility Auditing (`axe-core`)
Integrated `@axe-core/playwright` to run automated accessibility checks across the login page, product catalog, and checkout flows against WCAG 2.1 AA standards, catching missing labels, contrast bugs, and bad ARIA attributes.

### 6. Multi-Tab State Synchronization
Uses `context.newPage()` to open multiple tabs within the same browser context to test that cart updates made in Tab 1 reflect in Tab 2, and that logging out in one tab invalidates the session across other open tabs.

### 7. Security & Input Sanitization
Includes tests that verify:
- Protected routes (`/inventory.html`, `/cart.html`, `/checkout-step-one.html`) cannot be reached without an active session.
- Session termination when cookies are cleared mid-flow.
- Form resistance to SQL injection payloads and XSS strings in checkout fields.

### 8. Visual Regression Testing
Uses Playwright's `toHaveScreenshot()` to take component-level snapshots (e.g., login card, product card, header, cart list) and compare them against baselines to catch unintended CSS or layout regressions.

---

## Test Suites

The repository contains 51 automated tests covering:

| Suite | File | Description |
| :--- | :--- | :--- |
| **Auth** | `tests/auth/login.spec.ts` | Valid, invalid, empty inputs, locked-out user, performance glitch, logout |
| **Security** | `tests/auth/security.spec.ts` | Direct URL protection, cookie revocation, SQL injection, XSS checks |
| **Checkout** | `tests/e2e/checkoutJourney.spec.ts` | Complete purchase flow, tax/total calculation, required field validations |
| **Cart** | `tests/e2e/cartManagement.spec.ts` | Add/remove items, badge counts, navigation persistence, reset app state |
| **Sorting** | `tests/e2e/productSorting.spec.ts` | A-Z, Z-A, price low-to-high, price high-to-low sorting logic |
| **Details (PDP)** | `tests/e2e/productDetails.spec.ts` | Product detail page metadata, add/remove toggles, back navigation |
| **Bulk Order** | `tests/e2e/bulkPurchase.spec.ts` | Ordering all 6 catalog items at once, verifying aggregate price math |
| **Multi-Tab** | `tests/e2e/multiTabSync.spec.ts` | State persistence across concurrent browser tabs, cross-tab logout |
| **Accessibility** | `tests/accessibility/wcagAccessibility.spec.ts` | axe-core WCAG 2.1 AA compliance scans |
| **Network Mocking** | `tests/network-mocking/apiIntercept.spec.ts` | Route rewriting, banner injection, 500 error handling, offline mode |
| **Fast State API** | `tests/api/hybridState.spec.ts` | Fast state injection via localStorage, direct HTTP API checks |
| **Performance** | `tests/performance/webVitals.spec.ts` | Navigation Timing API metrics (TTFB, DOM ready), zero console error check |
| **User Personas** | `tests/personas/userPersonas.spec.ts` | Detecting real bugs in `problem_user` (broken images, broken form) and `error_user` |
| **Visual QA** | `tests/visual/visualRegression.spec.ts` | Pixel-level baseline comparisons for UI components |

---

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm 9 or newer

### Installation

```bash
# Clone the repository
git clone https://github.com/suryasumanth02-cyber/playwright-ecommerce-framework.git
cd playwright-ecommerce-framework

# Install dependencies
npm install

# Download Playwright browsers
npx playwright install --with-deps
```

---

## Running Tests

```bash
# Run all tests on Chromium
npm run test:chromium

# Run full cross-browser test suite (Chromium, Firefox, WebKit)
npm test

# Run tests in interactive UI Mode (time-travel debugging)
npm run test:ui

# Run tests in headed browser mode
npm run test:headed

# Run individual test suites
npm run test:auth          # Authentication tests
npm run test:security      # Security and route protection tests
npm run test:e2e           # End-to-end shopping & checkout flows
npm run test:a11y          # axe-core accessibility audits
npm run test:perf          # Performance SLAs & console error checks
npm run test:personas      # problem_user and error_user tests
npm run test:mock          # Network route interception tests
npm run test:visual        # Visual snapshot comparisons
npm run test:api           # Fast storage injection tests
npm run test:mobile        # Mobile viewport emulation (Pixel 7)

# Type check TypeScript files without running tests
npm run typecheck
```

### Viewing Test Reports & Traces

After a test run, open the HTML report:

```bash
npm run report
```

To view a trace captured on a failed test:

```bash
npx playwright show-trace test-results/<path-to-trace>/trace.zip
```

---

## CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
1. Triggers on pushes and pull requests to `main`.
2. Runs the tests across a browser matrix (Chromium, Firefox, WebKit) in parallel on Ubuntu runners.
3. Automatically archives Playwright HTML reports and failure traces as workflow artifacts.
