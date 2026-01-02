import type { ProductDetail, Product, Category, ProductImage } from "@/types/product";
import apiClient, { type ApiError } from "./apiClient";


/**
 * @service GET /api/v1/products
 * @description 获取商品列表。
 */
export const getProductList = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/api/v1/products");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /api/v1/products/{id}
 * @description 根据产品ID获取商品详情。
 */
export const getProductById = async (product_id: string): Promise<ProductDetail> => {
  try {
    const response = await apiClient.get<ProductDetail>(`/api/v1/products/${product_id}`);
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /api/v1/productImages/product/{productId}
 * @description 获取商品图片列表。
 */
export const getProductImages = async (productId: string | number): Promise<ProductImage[]> => {
  try {
    const response = await apiClient.get<ProductImage[]>(`/api/v1/productImages/product/${productId}`);
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /api/v1/productImages/product/{productId}
 * @description 获取商品主图片。
 */
export const getProductMainImage = async (productId: string | number): Promise<string | null> => {
  try {
    const images = await getProductImages(productId);
    const mainImage = images.find(img => img.isMain);
    return mainImage?.imageUrl || images[0]?.imageUrl || null;
  } catch {
    return null;
  }
};

/**
 * @service GET /api/v1/productCategory
 * @description 获取商品分类。
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>("/api/v1/productCategory");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /api/v1/products/search
 * @description 商品搜索。
 */
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/api/v1/products/search", { params: { keyword } });
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};