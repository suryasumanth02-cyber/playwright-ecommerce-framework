import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product } from '../models/Product';
import { PriceUtils } from '../utils/priceUtils';
import { Logger } from '../utils/logger';
import { ProductsPage } from './ProductsPage';
export class ProductDetailsPage extends BasePage {
  readonly detailsContainer: Locator;
  readonly backToProductsButton: Locator;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly itemImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.detailsContainer = page.locator('.inventory_details_container');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemName = this.detailsContainer.locator('.inventory_details_name, [data-test="inventory-item-name"]');
    this.itemDescription = this.detailsContainer.locator('.inventory_details_desc, [data-test="inventory-item-desc"]');
    this.itemPrice = this.detailsContainer.locator('.inventory_details_price, [data-test="inventory-item-price"]');
    this.itemImage = this.detailsContainer.locator('.inventory_details_img');
    this.addToCartButton = this.detailsContainer.locator('button[data-test="add-to-cart"], button[id^="add-to-cart"]');
    this.removeButton = this.detailsContainer.locator('button[data-test="remove"], button[id^="remove"]');
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.backToProductsButton).toBeVisible();
    await expect(this.detailsContainer).toBeVisible();
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
    await this.page.waitForURL(/.*inventory\.html/);
    const productsPage = new ProductsPage(this.page);
    await productsPage.verifyLoaded();
    return productsPage;
  }
}
