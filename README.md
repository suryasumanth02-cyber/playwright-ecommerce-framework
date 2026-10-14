# ⚡ Modern Full-Stack E-Commerce Test Automation Framework
### Next-Gen SDET Portfolio: TypeScript • Microsoft Playwright • CI/CD

[![Playwright Tests](https://img.shields.io/badge/Playwright-1.50+-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Accessibility: axe-core](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-blueviolet?style=for-the-badge&logo=accessibility&logoColor=white)](https://github.com/dequelabs/axe-core)
[![GitHub Actions CI](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Overview

This repository represents an **enterprise-grade, production-ready Test Automation Framework** engineered for a modern full-scale E-Commerce application ([SauceDemo](https://www.saucedemo.com/)).

Instead of basic linear "click-and-type" scripts, this framework is architected from the ground up to showcase the most advanced, high-demand capabilities in modern Software Development Engineering in Test (SDET):
- **Page Object Model (POM)** with strict TypeScript interfaces and fluent method chaining.
- **Custom Fixtures (`test.extend`)** to replace redundant `beforeEach` hooks with zero-boilerplate dependency injection.
- **Session Reuse (`storageState`)** cutting execution time by **over 60%** via one-time authentication.
- **Network Interception & API Mocking (`page.route`)** simulating out-of-stock items, 500 server errors, and offline modes without altering backends.
- **Pixel-Level Visual Regression (`toHaveScreenshot`)** detecting CSS regressions and layout shifts.
- **Automated WCAG 2.1 AA Accessibility Audits (`@axe-core/playwright`)** testing ARIA standards, color contrast, and keyboard navigation.
- **Multi-Tab Context Synchronization** verifying concurrent browser tab cart persistence and synchronized logout.
- **Security & Authorization Boundaries** auditing route guards, SQL injection neutralization, and XSS payload escape sanitization.
- **Web Performance & Navigation Timing API** validating TTFB, DOMContentLoaded, and enforcing a zero-uncaught-console-exception policy.
- **Specialized User Persona & Bug Detection** testing real defect behaviors across `problem_user` and `error_user`.
- **CI/CD Pipeline Matrix** executing parallel headless cross-browser tests (Chromium, Firefox, WebKit, Mobile Viewports) with artifact publishing.

---

## 💼 The Multi-Stack Advantage (Resume Powerhouse)

Pairing this **Modern TypeScript + Playwright** repository with a **Java + Selenium WebDriver** project demonstrates multi-language versatility across legacy enterprise stacks and modern cloud-native architectures:

| Capability | Project 1: Enterprise Banking | Project 2: Modern E-Commerce (This Framework) |
| :--- | :--- | :--- |
| **Language** | Java 17+ | **TypeScript 5.7+ / ESNext** |
| **Core Tool** | Selenium WebDriver 4 | **Microsoft Playwright** |
| **Architecture** | POM + TestNG + Maven | **POM + Custom Fixtures (`test.extend`) + Playwright Test** |
| **State Strategy** | Manual UI login per test | **Global Session Reuse (`storageState`) + Hybrid Storage Injection** |
| **Resilience** | Explicit/Fluent Waits | **Auto-Waiting, Web-First Assertions & Route Interception** |
| **Mocking** | External WireMock Server | **Native In-Browser Request Routing (`page.route()`)** |
| **Visual QA** | Manual or third-party plugins | **Native Pixel Snapshot Engine (`toHaveScreenshot`)** |
| **Accessibility** | axe-selenium / manual audits | **Automated `@axe-core/playwright` WCAG 2.1 AA Scanning** |
| **Diagnostics** | Allure Reports + Log4j | **Playwright Trace Viewer + Video Recordings + DOM Time-Travel** |
| **CI/CD** | Jenkins / GitHub Actions | **GitHub Actions Multi-Browser Parallel Matrix** |

---

## 🏗️ Project Architecture & Directory Structure

```text
ecommerce-playwright-ts/
├── .auth/                              # Cached storage states (session cookies & localStorage)
├── .github/
│   └── workflows/
│       └── playwright.yml              # Multi-browser parallel CI/CD matrix pipeline
├── src/
│   ├── config/
│   │   └── environment.ts              # Centralized environment configs (timeouts, URLs, flags)
│   ├── data/
│   │   ├── mockPayloads.ts             # Mock HTTP responses, 500 payloads, promo HTML
│   │   └── testData.ts                 # Test users, catalog metadata, error string constants
│   ├── fixtures/
│   │   └── testFixtures.ts             # Custom test.extend fixtures for dependency injection
│   ├── models/
│   │   ├── Order.ts                    # Customer, order summary, confirmation interfaces
│   │   ├── Product.ts                  # Product catalog, sorting options, cart item interfaces
│   │   └── User.ts                     # User credentials and test account role types
│   ├── pages/
│   │   ├── BasePage.ts                 # Common locators, navigation, header actions, logging
│   │   ├── LoginPage.ts                # Fluent authentication flows & validation error checks
│   │   ├── ProductsPage.ts             # Catalog browsing, sort filters, cart badge interactions
│   │   ├── ProductDetailsPage.ts       # PDP metadata verification, item toggle, back-navigation
│   │   ├── CartPage.ts                 # Cart verification, item removal, checkout trigger
│   │   ├── CheckoutPage.ts             # Customer details, subtotal/tax calculations, overview
│   │   └── OrderConfirmationPage.ts    # Order dispatch verification and receipt details
│   └── utils/
│       ├── logger.ts                   # Timestamped color-coded test execution logger
│       └── priceUtils.ts               # Currency regex extraction & mathematical sort verifiers
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts               # Global authentication worker saving session state
│   ├── auth/
│   │   ├── login.spec.ts               # Valid, invalid, locked-out, performance glitch tests
│   │   └── security.spec.ts            # Route guards, cookie revocation, SQLi, XSS neutralization
│   ├── e2e/
│   │   ├── bulkPurchase.spec.ts        # Full 6-item catalog purchase with aggregate math
│   │   ├── cartManagement.spec.ts      # Cart badge counts, item removals, state reset
│   │   ├── checkoutJourney.spec.ts     # End-to-end purchasing, tax/total math verification
│   │   ├── multiTabSync.spec.ts        # Concurrent browser tab sync and cross-tab logout
│   │   ├── productDetails.spec.ts      # Product details page (PDP) metadata & item add/remove
│   │   └── productSorting.spec.ts      # Catalog sorting algorithms (A-Z, Z-A, Low-High, High-Low)
│   ├── visual/
│   │   └── visualRegression.spec.ts    # Component-level snapshots (cards, cart, navigation)
│   ├── network-mocking/
│   │   └── apiIntercept.spec.ts        # route.fetch mutation, 500 server errors, offline mode
│   ├── api/
│   │   └── hybridState.spec.ts         # Fast storage injection & APIRequestContext verification
│   ├── accessibility/
│   │   └── wcagAccessibility.spec.ts   # Automated WCAG 2.1 AA scans with axe-core
│   ├── performance/
│   │   └── webVitals.spec.ts           # Navigation Timings, TTFB, and zero console error checks
│   └── personas/
│       └── userPersonas.spec.ts        # Defect audits for problem_user & error_user personas
├── playwright.config.ts                # Multi-project browser matrix & execution configuration
├── package.json
└── tsconfig.json                       # Strict TypeScript compiler options & alias mapping
```

---

## 🚀 Key Modules & Technical Deep Dive

### 1. Page Object Model with Strict TypeScript Typing
Every page object extends `BasePage` and utilizes Playwright's locator engine. Methods are strongly typed and return either next-step page objects (fluent interface) or validated data models:
```typescript
const productsPage = await loginPage.loginAs(USERS.standard);
const detailsPage = await productsPage.openProductDetails(PRODUCTS.backpack.name);
const cartPage = await detailsPage.goToCart();
const checkoutPage = await cartPage.proceedToCheckout();
```

### 2. Custom Fixtures (`test.extend`) — Zero Boilerplate
Instead of cluttering test files with repetitive `beforeEach` navigation and login steps, tests inject high-level pre-configured fixtures:
```typescript
test('should remove items directly from cart', async ({ cartWithItemsFixture }) => {
  const { cartPage } = cartWithItemsFixture;
  await cartPage.removeItem(PRODUCTS.backpack.name);
  expect(await cartPage.getCartItemCount()).toBe(1);
});
```

### 3. Session Reuse (`storageState`) — >60% Faster Runs
An authentication setup project (`auth.setup.ts`) logs in once at the start of the test run, captures the authenticated browser cookies and `localStorage`, and serializes them to `.auth/user.json`. Subsequent test workers reuse this state directly without hitting the login page.

### 4. Network Interception & API Mocking (`page.route()`)
Tests dynamically intercept HTTP traffic directly inside the browser engine:
- **Response Mutation:** Intercepts client bundles to dynamically label items as `[OUT OF STOCK]`.
- **UI Injection:** Injects custom promotional flash-sale banners into the DOM before page rendering.
- **Resilience Testing:** Simulates 500 server errors on background telemetry.
- **Network Throttling:** Simulates offline and slow cellular network conditions.

### 5. Automated WCAG 2.1 AA Accessibility Scanning (`axe-core`)
Leverages `@axe-core/playwright` to conduct accessibility audits on Login, Catalog, and Cart views, ensuring zero critical accessibility regressions.

### 6. Multi-Tab State Synchronization
Demonstrates advanced browser context orchestration by launching concurrent pages in the same browser context, validating that cart additions and logout events synchronize instantly across tabs.

### 7. Security & Input Sanitization Auditing
Verifies unauthorized URL protections on protected routes (`/cart.html`, `/inventory.html`), asserts cookie invalidation mid-session, and tests immunity against SQL injection and XSS payloads in customer forms.

### 8. Web Performance & Console Hygiene Audits
Uses the W3C Navigation Timing API (`performance.getEntriesByType('navigation')`) to ensure page load metrics (TTFB, DOMContentLoaded) remain well within SLA budgets, and listens to `page.on('pageerror')` to enforce zero uncaught runtime exceptions.

---

## ⚡ Quick Start & Execution

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/suryasumanth02-cyber/playwright-ecommerce-framework.git
cd playwright-ecommerce-framework

# Install project dependencies
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```

### 2. Running Tests
```bash
# Run full 51+ test suite across Chromium
npm run test:chromium

# Run full cross-browser matrix
npm test

# Open interactive Playwright UI Mode (Visual runner with time-travel)
npm run test:ui

# Run specific functional suites
npm run test:auth
npm run test:security
npm run test:e2e
npm run test:a11y
npm run test:perf
npm run test:personas
npm run test:visual
npm run test:mock
npm run test:api
npm run test:mobile
```

### 3. Viewing Test Reports & Traces
```bash
# Open interactive HTML test report
npm run report

# Inspect a captured trace file
npx playwright show-trace test-results/.../trace.zip
```

---

## 📝 Resume Bullet Points (Ready to Use)

> **Lead SDET / Senior Test Automation Engineer**
> - *Architected an enterprise-grade E-Commerce test automation framework using Playwright and TypeScript, implementing Page Object Model (POM), custom fixtures (`test.extend`), and strict type contracts across 50+ automated scenarios.*
> - *Engineered a one-time global session reuse strategy (`storageState`) that eliminated redundant authentication cycles across parallel workers, reducing overall suite execution time by over 60%.*
> - *Developed advanced network interception tests utilizing `page.route()` to simulate edge-case scenarios including out-of-stock product statuses, 500 internal server errors, and offline modes without modifying live databases.*
> - *Integrated `@axe-core/playwright` to establish automated WCAG 2.1 AA accessibility regression audits across key user funnels, guaranteeing zero critical accessibility violations.*
> - *Orchestrated multi-tab browser context synchronization tests to validate real-time state persistence and cross-window session invalidation.*
> - *Configured a cross-browser GitHub Actions CI/CD matrix executing headless tests on Chromium, Firefox, and WebKit with automated artifact archiving and trace diagnostic generation.*
