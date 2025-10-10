/**
 * @file index.ts
 * @description API服务层的统一出口文件 (Barrel File)。
 * 它整合了所有独立的API服务模块，并以一个统一的对象向外提供。
 */

import * as auth from "./auth";
import * as user from "./user";
// 未来可以继续添加，例如: import * as products from './products';

// 将所有导入的服务模块整合到一个名为 'api' 的对象中
export const api = {
  ...auth,
  ...user,
  // ...products,
};
