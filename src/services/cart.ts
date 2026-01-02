import type { CartItem, FavoriteItem } from '@/types/cart';
import type { Product } from '@/types/product';
import apiClient from './apiClient';

const CART_KEY = 'phoenix_cart';
const FAVORITES_KEY = 'phoenix_favorites';

export const getCart = (): CartItem[] => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToCart = (product: Product, quantity: number = 1): CartItem[] => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.productId === product.productId);

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
  const item = cart.find(item => item.product.productId === productId);

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
  const cart = getCart().filter(item => item.product.productId !== productId);
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
  const exists = favorites.find(item => item.product.productId === product.productId);

  if (!exists) {
    favorites.push({ product, addedAt: new Date().toISOString() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  return favorites;
};

export const removeFromFavorites = (productId: string): FavoriteItem[] => {
  const favorites = getFavorites().filter(item => item.product.productId !== productId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
};

export const isFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(item => item.product.productId === productId);
};

export const addToServerCart = async (productId: string): Promise<void> => {
  await apiClient.post('/api/v1/cart', { productId });
};

export const getServerCart = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/api/v1/cart');
  return response.data;
};

export const removeFromServerCart = async (productId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/cart/${productId}`);
};

export const clearServerCart = async (): Promise<void> => {
  const serverCart = await getServerCart();
  for (const product of serverCart) {
    await removeFromServerCart(product.productId);
  }
};

export const syncCartToServer = async (): Promise<void> => {
  try {
    await clearServerCart();
  } catch (error) {
    console.log('清空服务器购物车失败，可能购物车本来就是空的');
  }

  const cart = getCart();
  for (const item of cart) {
    for (let i = 0; i < item.quantity; i++) {
      await addToServerCart(item.product.productId);
    }
  }
};

export const orderProductInCart = async (): Promise<{ orderId: string }> => {
  await syncCartToServer();
  const response = await apiClient.post<{ orderId: string }>('/api/v1/cart/order');
  return response.data;
};
