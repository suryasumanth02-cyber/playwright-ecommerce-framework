import { test, expect } from '../../src/fixtures/testFixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';
import { USERS } from '../../src/data/testData';
import { Logger } from '../../src/utils/logger';

// Run security tests in unauthenticated baseline context
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Security & Session Vulnerability Auditing', () => {
  test('should deny unauthenticated direct URL navigation to protected catalog', async ({ page }) => {
    Logger.info('Attempting unauthorized direct navigation to /inventory.html');
    await page.goto('/inventory.html');

    const loginPage = new LoginPage(page);
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain("You can only access '/inventory.html' when you are logged in");
    expect(page.url()).toMatch(/saucedemo\.com\/?$/);
  });

  test('should deny unauthenticated direct URL navigation to checkout pages', async ({ page }) => {
    const protectedPaths = [
      '/cart.html',
      '/checkout-step-one.html',
      '/checkout-step-two.html',
      '/checkout-complete.html',
    ];

    for (const route of protectedPaths) {
      Logger.info(`Testing access control boundary for: ${route}`);
      await page.goto(route);
      const loginPage = new LoginPage(page);
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('when you are logged in');
    }
  });

  test('should terminate active session when auth cookies are revoked mid-session', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();

    // Revoke session cookies mid-session
    Logger.info('Simulating cookie revocation / session hijacking prevention');
    await context.clearCookies();

    // Navigate to Cart
    await page.goto('/cart.html');
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('when you are logged in');
  });

  test('should safely handle SQL Injection attack vectors in login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const sqlPayloads = [
      "' OR '1'='1",
      "admin' --",
      "' OR 1=1 --",
      "'; DROP TABLE users; --",
    ];

    for (const payload of sqlPayloads) {
      Logger.info(`Testing SQL injection payload: ${payload}`);
      await loginPage.enterUsername(payload);
      await loginPage.enterPassword("' OR '1'='1");
      await loginPage.clickLogin();

      await expect(loginPage.errorMessage).toBeVisible();
      const err = await loginPage.getErrorMessage();
      expect(err).toContain('Username and password do not match any user in this service');
    }
  });

  test('should neutralize Cross-Site Scripting (XSS) payloads in checkout forms', async ({
    page,
    context,
  }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      Logger.error(`XSS Vulnerability detected! Dialog message: ${dialog.message()}`);
      await dialog.dismiss();
    });

    // Authenticate and open checkout
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    const cartPage = await productsPage.goToCart();
    const checkoutPage = await cartPage.proceedToCheckout();

    // Enter malicious script injection payload
    const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
    await checkoutPage.fillCustomerInformation({
      firstName: xssPayload,
      lastName: xssPayload,
      postalCode: '90210',
    });
    await checkoutPage.clickContinue();

    // Assert that no alert dialog was triggered (XSS was neutralized)
    expect(dialogTriggered).toBe(false);
  });

  test('should reject usernames with leading or trailing whitespaces', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginExpectingFailure(' standard_user ', USERS.standard.password);
    expect(await loginPage.getErrorMessage()).toContain(
      'Username and password do not match any user in this service'
    );
  });
});
