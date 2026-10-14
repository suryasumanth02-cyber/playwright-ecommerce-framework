import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerInfo, OrderSummary } from '../models/Order';
import { PriceUtils } from '../utils/priceUtils';
import { Logger } from '../utils/logger';
import { OrderConfirmationPage } from './OrderConfirmationPage';

export class CheckoutPage extends BasePage {
  // Step 1 locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelStepOneButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 locators
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelStepTwoButton: Locator;

  constructor(page: Page) {
    super(page);
    // Step 1
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelStepOneButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"], .summary_value_label').first();
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"], .summary_value_label').nth(1);
    this.subtotalLabel = page.locator('[data-test="subtotal-label"], .summary_subtotal_label');
    this.taxLabel = page.locator('[data-test="tax-label"], .summary_tax_label');
    this.totalLabel = page.locator('[data-test="total-label"], .summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelStepTwoButton = page.locator('[data-test="cancel"]');
  }

  async verifyStepOneLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.continueButton).toBeVisible();
  }

  async fillCustomerInformation(info: CustomerInfo): Promise<this> {
    Logger.info(`Filling checkout info for: ${info.firstName} ${info.lastName}`);
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
    return this;
  }

  async clickContinue(): Promise<this> {
    Logger.info('Clicking Continue to overview');
    await this.continueButton.click();
    return this;
  }

  async verifyStepTwoLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.innerText()).trim();
  }

  async getOrderSummary(): Promise<OrderSummary> {
    await this.verifyStepTwoLoaded();

    const paymentInfo = await this.paymentInfoValue.innerText();
    const shippingInfo = await this.shippingInfoValue.innerText();
    const subtotalText = await this.subtotalLabel.innerText();
    const taxText = await this.taxLabel.innerText();
    const totalText = await this.totalLabel.innerText();

    return {
      paymentInfo: paymentInfo.trim(),
      shippingInfo: shippingInfo.trim(),
      itemTotal: PriceUtils.extractPrice(subtotalText),
      tax: PriceUtils.extractPrice(taxText),
      total: PriceUtils.extractPrice(totalText),
    };
  }

  /**
   * Completes the checkout and navigates to the confirmation page
   */
  async clickFinish(): Promise<OrderConfirmationPage> {
    Logger.info('Clicking Finish order');
    await this.finishButton.click();
    await this.page.waitForURL(/.*checkout-complete\.html/);
    const confirmationPage = new OrderConfirmationPage(this.page);
    await confirmationPage.verifyLoaded();
    return confirmationPage;
  }
}
