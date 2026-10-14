import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { USERS } from '../../src/data/testData';
import { config } from '../../src/config/environment';
import { Logger } from '../../src/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

setup('authenticate standard_user and save storageState', async ({ page }) => {
  Logger.info('[Auth Setup] Creating authenticated session for standard_user...');

  const authDir = path.dirname(config.authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const productsPage = await loginPage.loginAs(USERS.standard);
  await productsPage.verifyLoaded();

  await page.context().storageState({ path: config.authFile });
  Logger.success(`[Auth Setup] Session saved to ${config.authFile}`);
});
