import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables if .env exists
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EnvironmentConfig {
  baseUrl: string;
  defaultTimeout: number;
  navigationTimeout: number;
  authFile: string;
  isHeadless: boolean;
  retries: number;
  workers: number | undefined;
}

const ENV = process.env.TEST_ENV || 'production';

const environments: Record<string, Partial<EnvironmentConfig>> = {
  production: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  },
  staging: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  },
  local: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  },
};

export const config: EnvironmentConfig = {
  baseUrl: environments[ENV]?.baseUrl || 'https://www.saucedemo.com',
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  navigationTimeout: Number(process.env.NAV_TIMEOUT) || 30000,
  authFile: path.resolve(__dirname, '../../.auth/user.json'),
  isHeadless: process.env.CI ? true : process.env.HEADLESS !== 'false',
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
};
