import type { Product, ProductDetail } from "@/types/product";
import type { UserProfile } from "@/types/admin";
import apiClient, { type ApiError } from "./apiClient";

/**
 * @service GET /admin/products
 * @description 获取商品列表（管理员）。
 */
export const adminGetProducts = async (): Promise<Product[]> => {
	try {
		const response = await apiClient.get<Product[]>("/admin/products");
		return response.data;
	} catch (err) {
		throw err as ApiError;
	}
};

/**
 * @service POST /admin/products
 * @description 创建商品（管理员）。
 */
export const adminCreateProduct = async (product: Partial<ProductDetail>): Promise<ProductDetail> => {
	try {
		const response = await apiClient.post<ProductDetail>("/admin/products", product);
		return response.data;
	} catch (err) {
		throw err as ApiError;
	}
};

/**
 * @service PUT /admin/products/{id}
 * @description 更新商品（管理员）。
 */
export const adminUpdateProduct = async (id: string, product: Partial<ProductDetail>): Promise<ProductDetail> => {
	try {
		const response = await apiClient.put<ProductDetail>(`/admin/products/${id}`, product);
		return response.data;
	} catch (err) {
		throw err as ApiError;
	}
};

/**
 * @service DELETE /admin/products/{id}
 * @description 删除商品（管理员）。
 */
export const adminDeleteProduct = async (id: string): Promise<{ message: string }> => {
	try {
		const response = await apiClient.delete<{ message: string }>(`/admin/products/${id}`);
		return response.data;
	} catch (err) {
		throw err as ApiError;
	}
};

/**
 * @service GET /admin/users
 * @description 获取用户列表（管理员）。
 */
export const adminGetUsers = async (): Promise<UserProfile[]> => {
	try {
		const response = await apiClient.get<UserProfile[]>("/admin/users");
		return response.data;
	} catch (err) {
		throw err as ApiError;
	}
};

/**
 * @service GET /admin/dashboard
 * @description 获取仪表盘数据（管理员）。
 */
export const adminGetDashboard = async (): Promise<any> => {
	try {
		const response = await apiClient.get<any>("/admin/dashboard");
		return response.data;
	} catch (err) {
		throw err as ApiError;
	}
};
