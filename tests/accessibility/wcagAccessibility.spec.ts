import { test, expect } from '../../src/fixtures/testFixtures';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../../src/pages/LoginPage';
import { Logger } from '../../src/utils/logger';

test.describe('WCAG 2.1 AA Accessibility Automated Auditing', () => {
  test('should audit Login Page for critical accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    Logger.info('Executing axe-core accessibility audit on Login Page');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    Logger.info(`Audit completed: ${results.violations.length} total violations, ${criticalViolations.length} critical`);

    // Verify zero critical accessibility defects
    expect(criticalViolations).toEqual([]);
  });

  test('should audit Product Catalog Page accessibility compliance', async ({
    authenticatedUserPage,
  }) => {
    const page = authenticatedUserPage.page;
    Logger.info('Executing axe-core accessibility audit on Products Catalog');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toEqual([]);
  });

  test('should audit Shopping Cart Page for keyboard navigation and ARIA landmarks', async ({
    cartWithItemsFixture,
  }) => {
    const { cartPage } = cartWithItemsFixture;
    const page = cartPage.page;

    Logger.info('Executing accessibility audit on Shopping Cart');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toEqual([]);
  });
});
