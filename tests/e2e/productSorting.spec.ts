import { test, expect } from '../../src/fixtures/testFixtures';
import { PriceUtils } from '../../src/utils/priceUtils';

test.describe('Product Catalog Sorting & Filtering', () => {
  test('should sort products by Name (A to Z)', async ({ authenticatedUserPage }) => {
    const productsPage = authenticatedUserPage;
    await productsPage.selectSortOption('az');

    const names = await productsPage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(PriceUtils.isAlphabetical(names, false)).toBe(true);
  });

  test('should sort products by Name (Z to A)', async ({ authenticatedUserPage }) => {
    const productsPage = authenticatedUserPage;
    await productsPage.selectSortOption('za');

    const names = await productsPage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(PriceUtils.isAlphabetical(names, true)).toBe(true);
  });

  test('should sort products by Price (low to high)', async ({ authenticatedUserPage }) => {
    const productsPage = authenticatedUserPage;
    await productsPage.selectSortOption('lohi');

    const prices = await productsPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    expect(PriceUtils.isSortedAscending(prices)).toBe(true);
  });

  test('should sort products by Price (high to low)', async ({ authenticatedUserPage }) => {
    const productsPage = authenticatedUserPage;
    await productsPage.selectSortOption('hilo');

    const prices = await productsPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    expect(PriceUtils.isSortedDescending(prices)).toBe(true);
  });
});
