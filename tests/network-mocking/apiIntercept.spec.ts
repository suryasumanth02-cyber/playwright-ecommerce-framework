import { test, expect } from '../../src/fixtures/testFixtures';
import { MOCK_SERVER_ERROR_PAYLOAD, MOCK_PROMO_BANNER_HTML } from '../../src/data/mockPayloads';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { USERS } from '../../src/data/testData';
import { Logger } from '../../src/utils/logger';

test.describe('Network Interception & API Mocking (page.route)', () => {
  test('should intercept catalog script and dynamically inject out-of-stock badge', async ({
    page,
  }) => {
    Logger.info('Setting up network interception to transform client-side catalog bundle');

    // Intercept client bundle and rewrite catalog data in flight
    await page.route('**/assets/*.js', async (route) => {
      const response = await route.fetch();
      let js = await response.text();

      // Transform product title into sold-out status in client bundle
      js = js.replace(
        'Sauce Labs Backpack',
        'Sauce Labs Backpack [OUT OF STOCK - BACKORDER ONLY]'
      );

      await route.fulfill({
        response,
        body: js,
        headers: {
          ...response.headers(),
          'x-mocked-by': 'playwright-route-interceptor',
        },
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();

    const productNames = await productsPage.getProductNames();
    expect(productNames[0]).toContain('[OUT OF STOCK - BACKORDER ONLY]');
  });

  test('should inject custom flash-sale promotional banner into HTML response', async ({
    page,
  }) => {
    // Intercept root HTML document and inject promo banner before body closes
    await page.route(/https:\/\/www\.saucedemo\.com\/?($|\?.*|inventory\.html.*)/, async (route) => {
      const response = await route.fetch();
      let body = await response.text();

      if (body.includes('</body>')) {
        body = body.replace('</body>', `${MOCK_PROMO_BANNER_HTML}</body>`);
      }

      await route.fulfill({ response, body });
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const banner = page.locator('#flash-sale-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('50% OFF ALL ACCESSORIES');
  });

  test('should simulate server 500 error when fetching external resources', async ({ page }) => {
    let intercepted500Count = 0;

    // Route telemetry/analytics or asset requests to simulate 500 error
    await page.route('**/events.backtrace.io/**', async (route) => {
      intercepted500Count++;
      await route.fulfill({
        status: MOCK_SERVER_ERROR_PAYLOAD.status,
        contentType: MOCK_SERVER_ERROR_PAYLOAD.contentType,
        body: MOCK_SERVER_ERROR_PAYLOAD.body,
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();

    Logger.info('Verified application survived mock 500 responses without crashing');
  });

  test('should block heavy media assets to simulate low-bandwidth mode', async ({ page }) => {
    let blockedImagesCount = 0;

    // Abort image downloads to accelerate testing or simulate image CDNs being down
    await page.route('**/*.jpg', (route) => {
      blockedImagesCount++;
      route.abort('blockedbyclient');
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.standard);
    await productsPage.verifyLoaded();

    expect(blockedImagesCount).toBeGreaterThan(0);
    Logger.info(`Successfully aborted ${blockedImagesCount} image network requests`);
  });

  test('should emulate offline network condition and verify graceful disconnection handling', async ({
    page,
    context,
  }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    // Toggle browser context offline
    await context.setOffline(true);

    // Any new network navigation while offline should fail gracefully
    await expect(page.goto('https://www.saucedemo.com/inventory.html')).rejects.toThrow();

    // Restore online state
    await context.setOffline(false);
    await page.goto('https://www.saucedemo.com/inventory.html');
    await productsPage.verifyLoaded();
  });
});
