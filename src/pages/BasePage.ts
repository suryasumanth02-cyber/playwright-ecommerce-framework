import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('[data-test="shopping-cart-link"], .shopping_cart_link');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"], .shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.pageTitle = page.locator('[data-test="title"], .title');
  }

  /**
   * Navigate to a path relative to baseUrl
   */
  async navigateTo(path: string = '/'): Promise<void> {
    Logger.info(`Navigating to ${path}`);
    await this.page.goto(path);
  }

  /**
   * Get current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Get cart badge item count (0 if not present)
   */
  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.innerText();
    return parseInt(text, 10) || 0;
  }

  /**
   * Asserts the cart badge count with automatic retry
   */
  async expectCartCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }

  /**
   * Open shopping cart
   */
  async openCart(): Promise<void> {
    Logger.info('Clicking shopping cart icon');
    await this.cartIcon.click();
    await this.page.waitForURL(/.*cart\.html/);
  }

  /**
   * Open sidebar hamburger menu
   */
  async openMenu(): Promise<void> {
    Logger.info('Opening side menu');
    const isVisible = await this.logoutLink.isVisible();
    if (!isVisible) {
      await this.menuButton.click({ force: true });
      try {
        await expect(this.logoutLink).toBeVisible({ timeout: 2000 });
      } catch {
        await this.menuButton.dispatchEvent('click');
        await expect(this.logoutLink).toBeVisible();
      }
    }
  }

  /**
   * Reset application state via side menu
   */
  async resetAppState(): Promise<void> {
    await this.openMenu();
    Logger.info('Clicking Reset App State');
    await this.resetAppStateLink.dispatchEvent('click');
  }

  /**
   * Perform logout via side menu
   */
  async logout(): Promise<void> {
    await this.openMenu();
    Logger.info('Clicking Logout');
    await this.logoutLink.dispatchEvent('click');
    await this.page.waitForURL(/.*saucedemo\.com\/?$/);
  }

  /**
   * Capture a full page screenshot
   */
  async captureScreenshot(name: string): Promise<Buffer> {
    Logger.info(`Capturing screenshot: ${name}`);
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Wait for network idle state
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
