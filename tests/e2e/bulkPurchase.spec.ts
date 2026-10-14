import { test, expect } from '../../src/fixtures/testFixtures';
import { PRODUCTS, DEFAULT_CUSTOMER } from '../../src/data/testData';
import { PriceUtils } from '../../src/utils/priceUtils';
import { Logger } from '../../src/utils/logger';

test.describe('Full Catalog Bulk Purchase Journey', () => {
  test('should add all catalog products, calculate bulk totals, and complete order', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const allProducts = Object.values(PRODUCTS);

    Logger.info(`Adding all ${allProducts.length} catalog items into cart`);
    for (const prod of allProducts) {
      await productsPage.addProductToCart(prod.name);
    }

    // Verify badge displays 6
    const count = await productsPage.getCartItemCount();
    expect(count).toBe(allProducts.length);

    // Navigate to cart
    const cartPage = await productsPage.goToCart();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toHaveLength(allProducts.length);

    // Proceed to checkout
    const checkoutPage = await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInformation(DEFAULT_CUSTOMER);
    await checkoutPage.clickContinue();

    // Verify order overview math
    const summary = await checkoutPage.getOrderSummary();
    const expectedSubtotal = PriceUtils.sumPrices(allProducts.map((p) => p.price));

    Logger.info(`Comparing subtotal: Expected $${expectedSubtotal} vs Received $${summary.itemTotal}`);
    expect(summary.itemTotal).toBe(expectedSubtotal);
    expect(summary.total).toBe(PriceUtils.round(summary.itemTotal + summary.tax));

    // Finish checkout
    const confirmationPage = await checkoutPage.clickFinish();
    const confirmation = await confirmationPage.getConfirmationDetails();
    expect(confirmation.header).toBe('Thank you for your order!');

    // Return to inventory
    const returnedPage = await confirmationPage.clickBackHome();
    expect(await returnedPage.getCartItemCount()).toBe(0);
  });
});
