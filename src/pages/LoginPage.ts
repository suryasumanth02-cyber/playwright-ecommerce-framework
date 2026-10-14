import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../models/User';
import { Logger } from '../utils/logger';
import { ProductsPage } from './ProductsPage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;
  readonly loginWrapper: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('[data-test="error-button"]');
    this.loginWrapper = page.locator('.login_wrapper');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await expect(this.loginButton).toBeVisible();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    Logger.info('Clicking login button');
    await this.loginButton.click();
  }

  /**
   * Fluent login method returning ProductsPage upon successful authentication
   */
  async login(username: string, password: string): Promise<ProductsPage> {
    Logger.info(`Logging in with username: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    return new ProductsPage(this.page);
  }

  async loginAs(credentials: UserCredentials): Promise<ProductsPage> {
    return this.login(credentials.username, credentials.password);
  }

  /**
   * Attempts login with expected failure (returns this LoginPage)
   */
  async loginExpectingFailure(username: string, password: string): Promise<this> {
    Logger.info(`Attempting login expecting failure for: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    await expect(this.errorMessage).toBeVisible();
    return this;
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.innerText()).trim();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async closeErrorMessage(): Promise<void> {
    await this.errorButton.click();
  }
}
