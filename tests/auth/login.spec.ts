import { test, expect } from '../../src/fixtures/testFixtures';
import { USERS, AUTH_ERRORS } from '../../src/data/testData';
import { LoginPage } from '../../src/pages/LoginPage';

// Ensure all auth tests run in an unauthenticated state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication & Session Management', () => {
  test('should successfully log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();
    expect(page.url()).toContain('/inventory.html');
  });

  test('should show error when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginExpectingFailure('', USERS.standard.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toBe(AUTH_ERRORS.usernameRequired);
  });

  test('should show error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginExpectingFailure(USERS.standard.username, '');
    const error = await loginPage.getErrorMessage();
    expect(error).toBe(AUTH_ERRORS.passwordRequired);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginExpectingFailure('invalid_user', 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toBe(AUTH_ERRORS.invalidCredentials);
  });

  test('should show locked out error for locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginExpectingFailure(USERS.lockedOut.username, USERS.lockedOut.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toBe(AUTH_ERRORS.lockedOut);
  });

  test('should handle performance glitch user gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const startTime = Date.now();
    const productsPage = await loginPage.loginAs(USERS.performanceGlitch);
    await productsPage.verifyLoaded();
    const duration = Date.now() - startTime;

    expect(page.url()).toContain('/inventory.html');
    expect(duration).toBeLessThan(15000); // verify performance glitch resolves within 15s
  });

  test('should log out successfully and redirect to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();

    await productsPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    expect(page.url()).toMatch(/saucedemo\.com\/?$/);
  });
});
