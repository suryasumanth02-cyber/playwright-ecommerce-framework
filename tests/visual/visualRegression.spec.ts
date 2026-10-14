import { test, expect } from '../../src/fixtures/testFixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';

test.describe('Visual Regression & Snapshot Testing', () => {
  // Use unauthenticated clean session for login visual tests
  test('should match snapshot for Login Component', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify the login wrapper layout matches visual baseline
    await expect(loginPage.loginWrapper).toHaveScreenshot('login-card.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('should match snapshot for Product Catalog Card', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    // Snapshot the primary product item card
    const firstProductCard = productsPage.inventoryItems.first();
    await expect(firstProductCard).toBeVisible();

    await expect(firstProductCard).toHaveScreenshot('product-card-first.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('should match snapshot for Navigation Header and Cart Icon', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    const header = page.locator('.header_container, [data-test="header-container"]');
    await expect(header).toBeVisible();

    await expect(header).toHaveScreenshot('navigation-header.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('should match snapshot for Shopping Cart List View', async ({ cartWithItemsFixture }) => {
    const { cartPage } = cartWithItemsFixture;

    await expect(cartPage.cartList).toBeVisible();
    await expect(cartPage.cartList).toHaveScreenshot('cart-items-list.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });
});
