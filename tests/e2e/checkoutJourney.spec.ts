import { test, expect } from '../../src/fixtures/testFixtures';
import { PRODUCTS, DEFAULT_CUSTOMER, CHECKOUT_ERRORS } from '../../src/data/testData';
import { PriceUtils } from '../../src/utils/priceUtils';

test.describe('E2E Checkout Journey', () => {
  test('should complete the end-to-end purchase flow with accurate tax and total calculation', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;

    // 1. Add items to cart
    await productsPage.addProductToCart(PRODUCTS.backpack.name);
    await productsPage.addProductToCart(PRODUCTS.bikeLight.name);

    // 2. Validate cart badge
    const badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(2);

    // 3. Open cart and verify items
    const cartPage = await productsPage.goToCart();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toHaveLength(2);

    const names = cartItems.map((item) => item.product.name);
    expect(names).toContain(PRODUCTS.backpack.name);
    expect(names).toContain(PRODUCTS.bikeLight.name);

    // 4. Proceed to checkout Step 1
    const checkoutPage = await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // 5. Fill customer details and continue
    await checkoutPage.fillCustomerInformation(DEFAULT_CUSTOMER);
    await checkoutPage.clickContinue();

    // 6. Verify checkout Step 2 overview & math validation
    const summary = await checkoutPage.getOrderSummary();
    const expectedSubtotal = PriceUtils.round(PRODUCTS.backpack.price + PRODUCTS.bikeLight.price);

    expect(summary.itemTotal).toBe(expectedSubtotal);
    expect(summary.total).toBe(PriceUtils.round(summary.itemTotal + summary.tax));
    expect(summary.paymentInfo).toContain('SauceCard');
    expect(summary.shippingInfo).toContain('Free Pony Express Delivery');

    // 7. Complete order & verify confirmation
    const confirmationPage = await checkoutPage.clickFinish();
    const confirmation = await confirmationPage.getConfirmationDetails();

    expect(confirmation.header).toBe('Thank you for your order!');
    expect(confirmation.message).toContain('Your order has been dispatched');

    // 8. Return home
    const backToProducts = await confirmationPage.clickBackHome();
    await backToProducts.verifyLoaded();
    const finalBadge = await backToProducts.getCartItemCount();
    expect(finalBadge).toBe(0);
  });

  test('should validate required customer fields during checkout', async ({
    cartWithItemsFixture,
  }) => {
    const { cartPage } = cartWithItemsFixture;
    const checkoutPage = await cartPage.proceedToCheckout();

    // Missing first name
    await checkoutPage.fillCustomerInformation({ firstName: '', lastName: 'Doe', postalCode: '12345' });
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessage()).toBe(CHECKOUT_ERRORS.firstNameRequired);

    // Missing last name
    await checkoutPage.fillCustomerInformation({ firstName: 'Jane', lastName: '', postalCode: '12345' });
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessage()).toBe(CHECKOUT_ERRORS.lastNameRequired);

    // Missing postal code
    await checkoutPage.fillCustomerInformation({ firstName: 'Jane', lastName: 'Doe', postalCode: '' });
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessage()).toBe(CHECKOUT_ERRORS.postalCodeRequired);
  });

  test('should allow user to cancel checkout and return to cart/inventory', async ({
    cartWithItemsFixture,
  }) => {
    const { cartPage } = cartWithItemsFixture;
    const checkoutPage = await cartPage.proceedToCheckout();

    // Cancel on step 1 returns to cart
    await checkoutPage.cancelStepOneButton.click();
    await cartPage.verifyLoaded();

    // Proceed again, enter info, then cancel on step 2 returns to inventory
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInformation(DEFAULT_CUSTOMER);
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepTwoLoaded();

    await checkoutPage.cancelStepTwoButton.click();
    expect(checkoutPage.getUrl()).toContain('/inventory.html');
  });
});
