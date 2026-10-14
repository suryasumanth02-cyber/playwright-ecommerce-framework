import { test, expect } from '../../src/fixtures/testFixtures';
import { PRODUCTS } from '../../src/data/testData';

test.describe('Product Details Page (PDP) Navigation & Actions', () => {
  test('should display accurate product metadata on the details page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const detailsPage = await productsPage.openProductDetails(PRODUCTS.backpack.name);

    const details = await detailsPage.getProductDetails();
    expect(details.name).toBe(PRODUCTS.backpack.name);
    expect(details.price).toBe(PRODUCTS.backpack.price);
    expect(details.description).toContain('carry.allTheThings()');
    expect(details.imageUrl).toContain('sauce-backpack');
  });

  test('should add and remove products directly from the Product Details Page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const detailsPage = await productsPage.openProductDetails(PRODUCTS.bikeLight.name);

    // Add item on details page
    await detailsPage.addToCart();
    expect(await detailsPage.getCartItemCount()).toBe(1);
    await expect(detailsPage.removeButton).toBeVisible();

    // Remove item on details page
    await detailsPage.removeFromCart();
    expect(await detailsPage.getCartItemCount()).toBe(0);
    await expect(detailsPage.addToCartButton).toBeVisible();
  });

  test('should retain cart additions when navigating back to catalog from details page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const detailsPage = await productsPage.openProductDetails(PRODUCTS.fleeceJacket.name);

    await detailsPage.addToCart();
    expect(await detailsPage.getCartItemCount()).toBe(1);

    // Navigate back to catalog
    const returnedCatalog = await detailsPage.backToProducts();
    await returnedCatalog.verifyLoaded();
    expect(await returnedCatalog.getCartItemCount()).toBe(1);

    // Clean up
    await returnedCatalog.removeProductFromCart(PRODUCTS.fleeceJacket.name);
    expect(await returnedCatalog.getCartItemCount()).toBe(0);
  });
});
