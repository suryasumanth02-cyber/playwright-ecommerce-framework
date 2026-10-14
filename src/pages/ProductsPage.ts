import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product, ProductSortOption } from '../models/Product';
import { PriceUtils } from '../utils/priceUtils';
import { Logger } from '../utils/logger';
import { CartPage } from './CartPage';

export class ProductsPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemDescriptions: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"], .inventory_container');
    this.inventoryItems = page.locator('[data-test="inventory-item"], .inventory_item');
    this.itemNames = page.locator('[data-test="inventory-item-name"], .inventory_item_name');
    this.itemPrices = page.locator('[data-test="inventory-item-price"], .inventory_item_price');
    this.itemDescriptions = page.locator('[data-test="inventory-item-desc"], .inventory_item_desc');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/inventory.html');
    await this.verifyLoaded();
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * Retrieves all product details currently rendered on the page
   */
  async getAllProducts(): Promise<Product[]> {
    const count = await this.inventoryItems.count();
    const products: Product[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"], .inventory_item_name').innerText()).trim();
      const description = (await item.locator('[data-test="inventory-item-desc"], .inventory_item_desc').innerText()).trim();
      const priceText = (await item.locator('[data-test="inventory-item-price"], .inventory_item_price').innerText()).trim();
      const price = PriceUtils.extractPrice(priceText);

      products.push({ name, description, price });
    }

    return products;
  }

  async getProductNames(): Promise<string[]> {
    const elements = await this.itemNames.all();
    const names: string[] = [];
    for (const el of elements) {
      names.push((await el.innerText()).trim());
    }
    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const elements = await this.itemPrices.all();
    const prices: number[] = [];
    for (const el of elements) {
      const text = await el.innerText();
      prices.push(PriceUtils.extractPrice(text));
    }
    return prices;
  }

  /**
   * Adds an item to the cart by its product name
   */
  async addProductToCart(productName: string): Promise<this> {
    Logger.info(`Adding product to cart: ${productName}`);
    const item = this.inventoryItems.filter({ hasText: productName });
    const addButton = item.locator('button', { hasText: /Add to cart/i });
    await addButton.click();
    return this;
  }

  /**
   * Removes an item from the cart directly from the products catalog
   */
  async removeProductFromCart(productName: string): Promise<this> {
    Logger.info(`Removing product from catalog: ${productName}`);
    const item = this.inventoryItems.filter({ hasText: productName });
    const removeButton = item.locator('button', { hasText: /Remove/i });
    await removeButton.click();
    return this;
  }

  /**
   * Selects sorting order and waits for catalog re-render
   */
  async selectSortOption(option: ProductSortOption): Promise<this> {
    Logger.info(`Selecting sort option: ${option}`);
    await this.sortDropdown.selectOption(option);
    return this;
  }

  /**
   * Clicks on product title to navigate to ProductDetailsPage
   */
  async openProductDetails(productName: string): Promise<import('./ProductDetailsPage').ProductDetailsPage> {
    Logger.info(`Opening product details for: ${productName}`);
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('[data-test="inventory-item-name"], .inventory_item_name').click();
    await this.page.waitForURL(/.*inventory-item\.html/);
    const { ProductDetailsPage } = await import('./ProductDetailsPage');
    const detailsPage = new ProductDetailsPage(this.page);
    await detailsPage.verifyLoaded();
    return detailsPage;
  }

  /**
   * Fluent navigation to CartPage
   */
  async goToCart(): Promise<CartPage> {
    await this.openCart();
    const cartPage = new CartPage(this.page);
    await cartPage.verifyLoaded();
    return cartPage;
  }
}
