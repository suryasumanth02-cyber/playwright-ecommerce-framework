import { test, expect } from '../../src/fixtures/testFixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { USERS } from '../../src/data/testData';
import { Logger } from '../../src/utils/logger';

test.describe('Web Performance & Client-Side Hygiene Audits', () => {
  test('should enforce zero uncaught JavaScript console exceptions during user journey', async ({
    page,
  }) => {
    const uncaughtErrors: Error[] = [];
    page.on('pageerror', (err) => {
      uncaughtErrors.push(err);
      Logger.error(`Uncaught Client Exception: ${err.message}`);
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();

    await productsPage.addProductToCart('Sauce Labs Backpack');
    const cartPage = await productsPage.goToCart();
    await cartPage.verifyLoaded();

    const checkoutPage = await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Verify zero uncaught JavaScript exceptions occurred throughout the entire user journey
    expect(uncaughtErrors).toHaveLength(0);
  });

  test('should adhere to performance SLA budgets for Navigation and DOM Ready times', async ({
    authenticatedUserPage,
  }) => {
    const page = authenticatedUserPage.page;

    // Collect Navigation Timing metrics via standard browser Performance API
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!nav) return null;
      return {
        dnsTime: nav.domainLookupEnd - nav.domainLookupStart,
        ttfb: nav.responseStart - nav.requestStart,
        domInteractive: nav.domInteractive - nav.startTime,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadComplete: nav.loadEventEnd - nav.startTime,
      };
    });

    if (timing) {
      Logger.info(`Performance Metrics: TTFB=${Math.round(timing.ttfb)}ms, DOMContentLoaded=${Math.round(timing.domContentLoaded)}ms, LoadComplete=${Math.round(timing.loadComplete)}ms`);
      // Validate SLA thresholds
      expect(timing.domContentLoaded).toBeLessThan(5000);
      expect(timing.loadComplete).toBeLessThan(6000);
    }
  });
});
