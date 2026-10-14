import { test, expect } from '../../src/fixtures/testFixtures';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { PRODUCTS } from '../../src/data/testData';
import { Logger } from '../../src/utils/logger';

test.describe('Multi-Tab Browser Context Synchronization', () => {
  test('should synchronize shopping cart state across concurrent browser tabs', async ({
    context,
    authenticatedUserPage,
  }) => {
    // Tab 1: primary user page
    const tab1 = authenticatedUserPage.page;
    const productsTab1 = authenticatedUserPage;

    // Tab 2: spawn a new tab in the same authenticated browser context
    Logger.info('Spawning concurrent second tab in same browser context');
    const tab2 = await context.newPage();
    const productsTab2 = new ProductsPage(tab2);
    await productsTab2.goto();

    // Tab 1 adds Backpack to cart
    Logger.info('Tab 1 adding Sauce Labs Backpack');
    await productsTab1.addProductToCart(PRODUCTS.backpack.name);
    expect(await productsTab1.getCartItemCount()).toBe(1);

    // Tab 2 navigates to cart and verifies the item is present
    Logger.info('Tab 2 navigating to cart to verify real-time storage synchronization');
    const cartTab2 = new CartPage(tab2);
    await cartTab2.goto();

    const itemsInTab2 = await cartTab2.getItemNames();
    expect(itemsInTab2).toContain(PRODUCTS.backpack.name);
    expect(await cartTab2.getCartItemCount()).toBe(1);

    // Tab 2 removes item from cart
    Logger.info('Tab 2 removing item from cart');
    await cartTab2.removeItem(PRODUCTS.backpack.name);
    expect(await cartTab2.getCartItemCount()).toBe(0);

    // Tab 1 refreshes catalog and verifies item is removed
    await tab1.reload();
    expect(await productsTab1.getCartItemCount()).toBe(0);

    // Close second tab
    await tab2.close();
  });

  test('should terminate session in Tab 1 when user logs out from Tab 2', async ({
    context,
    authenticatedUserPage,
  }) => {
    const tab1 = authenticatedUserPage.page;
    const productsTab1 = authenticatedUserPage;

    // Spawn Tab 2
    const tab2 = await context.newPage();
    const productsTab2 = new ProductsPage(tab2);
    await productsTab2.goto();

    // Logout from Tab 2
    Logger.info('Tab 2 performing user logout');
    await productsTab2.logout();

    // Tab 1 tries to navigate to protected cart
    Logger.info('Tab 1 navigating to cart after Tab 2 logged out');
    await tab1.goto('https://www.saucedemo.com/cart.html');

    const loginPageTab1 = new LoginPage(tab1);
    await expect(loginPageTab1.errorMessage).toBeVisible();
    expect(await loginPageTab1.getErrorMessage()).toContain('when you are logged in');

    await tab2.close();
  });
});
