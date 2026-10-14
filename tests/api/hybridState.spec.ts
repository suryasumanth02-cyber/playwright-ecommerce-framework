import { test, expect } from '../../src/fixtures/testFixtures';
import { CartPage } from '../../src/pages/CartPage';
import { Logger } from '../../src/utils/logger';

test.describe('Hybrid API & Fast State Injection', () => {
  test('should inject cart state directly into browser storage bypassing catalog UI clicks', async ({
    page,
    context,
  }) => {
    Logger.info('Injecting authentication cookie directly into browser context');

    // 1. Inject auth cookie directly
    await context.addCookies([
       {
         name: 'session-username',
         value: 'standard_user',
         url: 'https://www.saucedemo.com',
       },
     ]);

    // 2. Open base page to establish origin localStorage context
    await page.goto('/');

    // 3. Inject product IDs into cart localStorage directly (Sauce Labs Backpack = ID 4, Bike Light = ID 0)
    Logger.info('Injecting product IDs [4, 0] directly into localStorage');
    await page.evaluate(() => {
      localStorage.setItem('cart-contents', JSON.stringify([4, 0]));
    });

    // 4. Directly jump to the Cart page without any inventory page interaction!
    const cartPage = new CartPage(page);
    await cartPage.goto();

    // 5. Verify UI immediately renders the pre-injected items
    const items = await cartPage.getItemNames();
    expect(items).toHaveLength(2);
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bike Light');

    const badgeCount = await cartPage.getCartItemCount();
    expect(badgeCount).toBe(2);

    Logger.success('Successfully validated fast hybrid state injection');
  });

  test('should validate server headers and response health using Playwright request API', async ({
    request,
  }) => {
    Logger.info('Testing direct HTTP response using APIRequestContext');

    const response = await request.get('https://www.saucedemo.com');
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const headers = response.headers();
    expect(headers['content-type']).toContain('text/html');

    const bodyText = await response.text();
    expect(bodyText).toContain('Swag Labs');
  });

  test('should verify API 404 handling on non-existent endpoints', async ({ request }) => {
    const response = await request.get('https://www.saucedemo.com/api/non-existent-endpoint');
    expect(response.status()).toBe(404);
  });
});
