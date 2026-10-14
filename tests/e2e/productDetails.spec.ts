import { test, expect } from '../../src/fixtures/testFixtures';
import { PRODUCTS } from '../../src/data/testData';

test.describe('Product Details Page (PDP) Navigation & Actions', () => {
  test('should display accurate product metadata on the details page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const detailsPage = await productsPage.openProductDetails(PRODUCTS.backpack.name);

    await expect(detailsPage.itemName).toHaveText(PRODUCTS.backpack.name);
    await expect(detailsPage.itemPrice).toHaveText(`$${PRODUCTS.backpack.price}`);
    await expect(detailsPage.itemDescription).toContainText('carry.allTheThings()');
    await expect(detailsPage.itemImage).toHaveAttribute('src', /.*sauce-backpack.*/);

    const details = await detailsPage.getProductDetails();
    expect(details.name).toBe(PRODUCTS.backpack.name);
    expect(details.price).toBe(PRODUCTS.backpack.price);
  });

  test('should add and remove products directly from the Product Details Page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const detailsPage = await productsPage.openProductDetails(PRODUCTS.bikeLight.name);

    // Add item on details page
    await detailsPage.addToCart();
    await detailsPage.expectCartCount(1);
    await expect(detailsPage.removeButton).toBeVisible();

    // Remove item on details page
    await detailsPage.removeFromCart();
    await detailsPage.expectCartCount(0);
    await expect(detailsPage.addToCartButton).toBeVisible();
  });

  test('should retain cart additions when navigating back to catalog from details page', async ({
    authenticatedUserPage,
  }) => {
    const productsPage = authenticatedUserPage;
    const detailsPage = await productsPage.openProductDetails(PRODUCTS.fleeceJacket.name);

    await detailsPage.addToCart();
    await detailsPage.expectCartCount(1);

    // Navigate back to catalog
    const returnedCatalog = await detailsPage.backToProducts();
    await returnedCatalog.expectCartCount(1);

    // Clean up
    await returnedCatalog.removeProductFromCart(PRODUCTS.fleeceJacket.name);
    await returnedCatalog.expectCartCount(0);
  });
});
