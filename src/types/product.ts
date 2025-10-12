/**
 * @file product.ts
 * @description 定义所有与商品相关的TypeScript接口。
 */


/**
 * @description 商品列表中的单个商品结构
 */
export interface Product {
  id: string;
  product_name: string;
  product_price: number;
  product_desc: string;
  category_id?: string;
  image_url?: string;
}

/**
 * @description 商品分类结构
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
}

/**
 * @description 商品查询成功后，API返回的响应体
 */
export interface ProductDetail {
  id: string;
  product_name: string;
  product_price: number;
  product_desc: string;
  category_id?: string;
  image_url?: string;
}