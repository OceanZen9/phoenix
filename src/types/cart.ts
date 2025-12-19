import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FavoriteItem {
  product: Product;
  addedAt: string;
}
