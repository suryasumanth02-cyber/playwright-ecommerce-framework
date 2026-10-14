import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product } from '../models/Product';
import { PriceUtils } from '../utils/priceUtils';
import { Logger } from '../utils/logger';
import { ProductsPage } from './ProductsPage';

export class ProductDetailsPage extends BasePage {
  readonly backToProductsButton: Locator;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly itemImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemName = page.locator('[data-test="inventory-item-name"], .inventory_details_name');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"], .inventory_details_desc');
    this.itemPrice = page.locator('[data-test="inventory-item-price"], .inventory_details_price');
    this.itemImage = page.locator('.inventory_details_img');
    this.addToCartButton = page.locator('button[id^="add-to-cart"], [data-test^="add-to-cart"]');
    this.removeButton = page.locator('button[id^="remove"], [data-test^="remove"]');
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.backToProductsButton).toBeVisible();
    await expect(this.itemName).toBeVisible();
    await expect(this.itemPrice).toBeVisible();
  }

  async getProductDetails(): Promise<Product> {
    await this.verifyLoaded();
    const name = (await this.itemName.innerText()).trim();
    const description = (await this.itemDescription.innerText()).trim();
    const priceText = (await this.itemPrice.innerText()).trim();
    const imageUrl = await this.itemImage.getAttribute('src');

    return {
      name,
      description,
      price: PriceUtils.extractPrice(priceText),
      imageUrl: imageUrl || undefined,
    };
  }

  async addToCart(): Promise<this> {
    Logger.info('Adding item to cart from details page');
    await this.addToCartButton.click();
    return this;
  }

  async removeFromCart(): Promise<this> {
    Logger.info('Removing item from cart on details page');
    await this.removeButton.click();
    return this;
  }

  async backToProducts(): Promise<ProductsPage> {
    Logger.info('Navigating back to products catalog');
    await this.backToProductsButton.click();
    return new ProductsPage(this.page);
  }
}
