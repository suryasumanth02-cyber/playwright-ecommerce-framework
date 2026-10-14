import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartItem } from '../models/Product';
import { PriceUtils } from '../utils/priceUtils';
import { Logger } from '../utils/logger';
import { CheckoutPage } from './CheckoutPage';
import { ProductsPage } from './ProductsPage';

export class CartPage extends BasePage {
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator('[data-test="cart-list"], .cart_list');
    this.cartItems = page.locator('[data-test="inventory-item"], .cart_item');
    this.itemNames = page.locator('[data-test="inventory-item-name"], .inventory_item_name');
    this.itemPrices = page.locator('[data-test="inventory-item-price"], .inventory_item_price');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/cart.html');
    await this.verifyLoaded();
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
    await expect(this.checkoutButton).toBeVisible();
  }

  /**
   * Retrieves all items currently in the cart
   */
  async getCartItems(): Promise<CartItem[]> {
    const count = await this.cartItems.count();
    const items: CartItem[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"], .inventory_item_name').innerText()).trim();
      const description = (await item.locator('[data-test="inventory-item-desc"], .inventory_item_desc').innerText()).trim();
      const priceText = (await item.locator('[data-test="inventory-item-price"], .inventory_item_price').innerText()).trim();
      const quantityText = (await item.locator('[data-test="item-quantity"], .cart_quantity').innerText()).trim();

      items.push({
        product: {
          name,
          description,
          price: PriceUtils.extractPrice(priceText),
        },
        quantity: parseInt(quantityText, 10) || 1,
      });
    }

    return items;
  }

  async getItemNames(): Promise<string[]> {
    const elements = await this.itemNames.all();
    const names: string[] = [];
    for (const el of elements) {
      names.push((await el.innerText()).trim());
    }
    return names;
  }

  /**
   * Removes an item from the cart by its name
   */
  async removeItem(productName: string): Promise<this> {
    Logger.info(`Removing item from cart: ${productName}`);
    const item = this.cartItems.filter({ hasText: productName });
    const removeButton = item.locator('button', { hasText: /Remove/i });
    await removeButton.click();
    return this;
  }

  /**
   * Fluent navigation back to products list
   */
  async continueShopping(): Promise<ProductsPage> {
    Logger.info('Clicking Continue Shopping');
    await this.continueShoppingButton.click();
    return new ProductsPage(this.page);
  }

  /**
   * Fluent navigation to checkout step one
   */
  async proceedToCheckout(): Promise<CheckoutPage> {
    Logger.info('Proceeding to Checkout');
    await this.checkoutButton.click();
    return new CheckoutPage(this.page);
  }
}
