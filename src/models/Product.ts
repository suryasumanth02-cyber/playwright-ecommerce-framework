export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export type ProductSortOption =
  | 'az' // Name (A to Z)
  | 'za' // Name (Z to A)
  | 'lohi' // Price (low to high)
  | 'hilo'; // Price (high to low)

export interface CartItem {
  product: Product;
  quantity: number;
}
