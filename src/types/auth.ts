/**
 * @file auth.ts
 * @description 定义所有与认证授权相关的TypeScript接口。
 */
import type { UserProfile } from "./user";

// --- 登录 (Login) ---
export interface PasswordLoginPayload {
  loginType: "password";
  email: string;
  password: string;
}

export interface EmailCodeLoginPayload {
  loginType: "emailCode";
  email: string;
  code: string;
}

export type LoginPayload = PasswordLoginPayload | EmailCodeLoginPayload;

export interface AuthSuccessResponse {
  user: UserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// --- 注册 (Register) ---
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  code: string;
}

// --- 刷新Token (RefreshToken) ---
export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// --- 登出 (Logout) ---
export interface LogoutPayload {
  refreshToken: string;
}
