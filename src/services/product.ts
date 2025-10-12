import type { ProductDetail, Product, Category } from "@/types/product";
import apiClient, { type ApiError } from "./apiClient";


/**
 * @service GET /products
 * @description 获取商品列表。
 */
export const getProductList = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /products/{id}
 * @description 根据产品ID获取商品详情。
 */
export const getProductById = async (product_id: string): Promise<ProductDetail> => {
  try {
    const response = await apiClient.get<ProductDetail>(`/products/${product_id}`);
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /categories
 * @description 获取商品分类。
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /products/search
 * @description 商品搜索。
 */
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products/search", { params: { keyword } });
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};