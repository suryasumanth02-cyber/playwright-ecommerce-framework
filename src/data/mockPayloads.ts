export interface MockCatalogItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  image_url: string;
  inStock: boolean;
  stockCount: number;
}

export const MOCK_OUT_OF_STOCK_CATALOG: MockCatalogItem[] = [
  {
    id: 1,
    name: 'Sauce Labs Backpack [OUT OF STOCK]',
    desc: 'This item is currently sold out. Check back later!',
    price: 29.99,
    image_url: '/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
    inStock: false,
    stockCount: 0,
  },
  {
    id: 2,
    name: 'Sauce Labs Bike Light [LIMITED QUANTITY]',
    desc: 'Only 1 left in stock - order soon.',
    price: 9.99,
    image_url: '/static/media/bike-light-1200x1500.394e1e2d.jpg',
    inStock: true,
    stockCount: 1,
  },
];

export const MOCK_DISCOUNTED_CATALOG = [
  {
    name: 'Sauce Labs Backpack - FLASH SALE',
    price: 14.99,
    originalPrice: 29.99,
    discountBadge: '50% OFF',
  },
];

export const MOCK_SERVER_ERROR_PAYLOAD = {
  status: 500,
  contentType: 'application/json',
  body: JSON.stringify({
    error: 'Internal Server Error',
    message: 'Unable to connect to inventory cluster. Please try again later.',
    timestamp: new Date().toISOString(),
  }),
};

export const MOCK_PROMO_BANNER_HTML = `
  <div id="flash-sale-banner" style="background: #e2231a; color: white; text-align: center; padding: 12px; font-weight: bold; font-size: 16px;">
    🚀 FLASH SALE: 50% OFF ALL ACCESSORIES TODAY ONLY!
  </div>
`;
