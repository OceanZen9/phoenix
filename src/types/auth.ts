/**
 * @file auth.ts
 * @description 定义所有与认证授权相关的TypeScript接口。
 */

import type { UserProfile } from "./user"; // 我们可以复用 UserProfile 类型来描述登录成功时附带的用户信息

/**
 * @description 用户登录时需要提交的数据体 (Payload)
 */
export interface LoginPayload {
  username: string;
  password: string;
}

/**
 * @description 用户登录成功后，API返回的响应体
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile; // 假设登录成功后会一并返回用户信息
}

/**
 * @description 用户注册时需要提交的数据体 (Payload)
 */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  // password_confirmation?: string; // 视后端要求而定
}
