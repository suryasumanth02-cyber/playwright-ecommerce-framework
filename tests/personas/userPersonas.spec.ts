import { test, expect } from '../../src/fixtures/testFixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { USERS, DEFAULT_CUSTOMER } from '../../src/data/testData';
import { Logger } from '../../src/utils/logger';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Specialized User Personas & Defect Detection', () => {
  test('should detect broken image assets for problem_user persona', async ({ page }) => {
    Logger.info('Authenticating as problem_user to audit image regressions');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.problem);
    await productsPage.verifyLoaded();

    // Inspect image sources across all product cards
    const images = await page.locator('.inventory_item_img img').all();
    const srcList: string[] = [];
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src) srcList.push(src);
    }

    // Problem user has a known defect: all images load the 404 placeholder image
    Logger.info(`Audit found ${srcList.length} image sources`);
    const brokenDogImages = srcList.filter((s) => s.includes('sl-404'));
    expect(brokenDogImages.length).toBeGreaterThan(0);
  });

  test('should detect form defect on checkout last name input for problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.problem);
    await productsPage.addProductToCart('Sauce Labs Backpack');

    const cartPage = await productsPage.goToCart();
    const checkoutPage = await cartPage.proceedToCheckout();

    // Problem user has a known input defect: last name input cannot be altered properly
    await checkoutPage.firstNameInput.fill('John');
    await checkoutPage.lastNameInput.fill('Smith');
    await checkoutPage.postalCodeInput.fill('12345');

    // Attempt continue
    await checkoutPage.clickContinue();

    // The system raises a validation error because last name was rejected by the problem_user script
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('should detect checkout finish dispatch failure for error_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const productsPage = await loginPage.loginAs(USERS.error);
    await productsPage.addProductToCart('Sauce Labs Fleece Jacket');

    const cartPage = await productsPage.goToCart();
    const checkoutPage = await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInformation(DEFAULT_CUSTOMER);
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepTwoLoaded();

    // Error user persona has a known defect: clicking finish silently fails to complete the order
    await checkoutPage.finishButton.click();

    // Verify user is prevented from reaching checkout-complete and remains stuck on step two
    expect(page.url()).toContain('/checkout-step-two.html');
    await expect(checkoutPage.finishButton).toBeVisible();
    Logger.info('Successfully verified error_user checkout completion defect');
  });
});
