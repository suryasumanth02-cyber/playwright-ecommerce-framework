import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { USERS, PRODUCTS } from '../data/testData';
import { Logger } from '../utils/logger';

export interface CustomFixtures {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
  productDetailsPage: ProductDetailsPage;
  loggedOutPage: LoginPage;
  authenticatedUserPage: ProductsPage;
  cartWithItemsFixture: { productsPage: ProductsPage; cartPage: CartPage };
}

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  orderConfirmationPage: async ({ page }, use) => {
    const orderConfirmationPage = new OrderConfirmationPage(page);
    await use(orderConfirmationPage);
  },

  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },

  /**
   * Provides an unauthenticated page with empty storage and cookies
   */
  loggedOutPage: async ({ page, context }, use) => {
    Logger.info('[Fixture] Initializing loggedOutPage with cleared context');
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  /**
   * Provides an authenticated session directly landed on the inventory page
   */
  authenticatedUserPage: async ({ page }, use) => {
    Logger.info('[Fixture] Initializing authenticatedUserPage');
    await page.goto('/inventory.html');

    // If redirected to login (e.g. no storageState or expired), perform UI login
    if (!page.url().includes('inventory.html')) {
      Logger.info('[Fixture] Authenticating via LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAs(USERS.standard);
    }

    // Ensure pristine cart state across tests
    const hadCartItems = await page.evaluate(() => {
      const hasCart = !!localStorage.getItem('cart-contents');
      if (hasCart) {
        localStorage.removeItem('cart-contents');
      }
      return hasCart;
    });
    if (hadCartItems) {
      await page.reload();
    }

    const productsPage = new ProductsPage(page);
    await productsPage.verifyLoaded();
    await use(productsPage);
  },

  /**
   * Provides an authenticated session pre-loaded with multiple items in the cart
   */
  cartWithItemsFixture: async ({ page }, use) => {
    Logger.info('[Fixture] Initializing cartWithItemsFixture');
    await page.goto('/inventory.html');

    if (!page.url().includes('inventory.html')) {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAs(USERS.standard);
    }

    // Reset any prior cart items before adding fresh fixture items
    await page.evaluate(() => {
      localStorage.removeItem('cart-contents');
    });
    await page.reload();

    const productsPage = new ProductsPage(page);
    await productsPage.verifyLoaded();

    // Add backpack and bike light to cart
    await productsPage.addProductToCart(PRODUCTS.backpack.name);
    await productsPage.addProductToCart(PRODUCTS.bikeLight.name);

    const cartPage = await productsPage.goToCart();
    await cartPage.verifyLoaded();

    await use({ productsPage, cartPage });
  },
});

export { expect };
