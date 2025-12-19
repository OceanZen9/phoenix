import type { CartItem, FavoriteItem } from '@/types/cart';
import type { Product } from '@/types/product';

const CART_KEY = 'phoenix_cart';
const FAVORITES_KEY = 'phoenix_favorites';

export const getCart = (): CartItem[] => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToCart = (product: Product, quantity: number = 1): CartItem[] => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);

  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return removeFromCart(productId);
    }
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCart().filter(item => item.product.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const getFavorites = (): FavoriteItem[] => {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToFavorites = (product: Product): FavoriteItem[] => {
  const favorites = getFavorites();
  const exists = favorites.find(item => item.product.id === product.id);

  if (!exists) {
    favorites.push({ product, addedAt: new Date().toISOString() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  return favorites;
};

export const removeFromFavorites = (productId: string): FavoriteItem[] => {
  const favorites = getFavorites().filter(item => item.product.id !== productId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
};

export const isFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(item => item.product.id === productId);
};
