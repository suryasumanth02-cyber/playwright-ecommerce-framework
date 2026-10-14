import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { OrderConfirmation } from '../models/Order';
import { Logger } from '../utils/logger';
import { ProductsPage } from './ProductsPage';

export class OrderConfirmationPage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"], .complete-header');
    this.completeText = page.locator('[data-test="complete-text"], .complete-text');
    this.ponyExpressImage = page.locator('img.pony_express');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toBeVisible();
  }

  async getConfirmationDetails(): Promise<OrderConfirmation> {
    await this.verifyLoaded();
    const header = (await this.completeHeader.innerText()).trim();
    const message = (await this.completeText.innerText()).trim();
    return { header, message };
  }

  async clickBackHome(): Promise<ProductsPage> {
    Logger.info('Clicking Back Home');
    await this.backHomeButton.click();
    return new ProductsPage(this.page);
  }
}
