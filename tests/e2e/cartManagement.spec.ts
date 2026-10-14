import { test, expect } from '../../src/fixtures/testFixtures';
import { PRODUCTS } from '../../src/data/testData';

test.describe('Shopping Cart Operations & State Persistence', () => {
  test('should toggle button between Add and Remove on inventory page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;

    // Add backpack
    await productsPage.addProductToCart(PRODUCTS.backpack.name);
    expect(await productsPage.getCartItemCount()).toBe(1);

    // Remove backpack
    await productsPage.removeProductFromCart(PRODUCTS.backpack.name);
    expect(await productsPage.getCartItemCount()).toBe(0);
  });

  test('should persist cart items when navigating between pages', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;

    await productsPage.addProductToCart(PRODUCTS.boltTShirt.name);
    await productsPage.addProductToCart(PRODUCTS.onesie.name);
    expect(await productsPage.getCartItemCount()).toBe(2);

    // Navigate to Cart
    const cartPage = await productsPage.goToCart();
    expect(await cartPage.getItemNames()).toEqual(
      expect.arrayContaining([PRODUCTS.boltTShirt.name, PRODUCTS.onesie.name])
    );

    // Return to inventory via Continue Shopping
    const returnedProductsPage = await cartPage.continueShopping();
    expect(await returnedProductsPage.getCartItemCount()).toBe(2);

    // Clean up
    await returnedProductsPage.removeProductFromCart(PRODUCTS.boltTShirt.name);
    await returnedProductsPage.removeProductFromCart(PRODUCTS.onesie.name);
  });

  test('should remove items directly from inside the cart page', async ({
    cartWithItemsFixture,
  }) => {
    const { cartPage } = cartWithItemsFixture;

    // Initially 2 items from fixture
    expect(await cartPage.getCartItemCount()).toBe(2);

    // Remove backpack from cart
    await cartPage.removeItem(PRODUCTS.backpack.name);
    expect(await cartPage.getCartItemCount()).toBe(1);

    const remainingItems = await cartPage.getItemNames();
    expect(remainingItems).not.toContain(PRODUCTS.backpack.name);
    expect(remainingItems).toContain(PRODUCTS.bikeLight.name);

    // Clean up
    await cartPage.removeItem(PRODUCTS.bikeLight.name);
    expect(await cartPage.getCartItemCount()).toBe(0);
  });

  test('should clear cart using Reset App State sidebar menu action', async ({
    cartWithItemsFixture,
  }) => {
    const { cartPage } = cartWithItemsFixture;

    expect(await cartPage.getCartItemCount()).toBe(2);

    // Open menu and reset app state
    await cartPage.openMenu();
    await cartPage.resetAppStateLink.click();

    // Verify badge disappears
    await expect(cartPage.cartBadge).not.toBeVisible();
  });
});
