/**
 * @file product.ts
 * @description 定义所有与商品相关的TypeScript接口。
 */


/**
 * @description 商品列表中的单个商品结构
 */
export interface Product {
  productId: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @description 商品分类结构
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isEnabled?: boolean;
  parentId?: number | null;
  level?: number;
}

/**
 * @description 商品详情，与Product结构基本一致，可按需扩展
 */
export type ProductDetail = Product;

/**
 * @description 商品图片结构
 */
export interface ProductImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isMain: boolean;
  productId: number;
}
