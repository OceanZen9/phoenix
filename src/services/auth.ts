/**
 * @file src/services/auth.ts
 * @description 认证授权相关的API服务函数
 */

import type {
  LoginPayload,
  AuthSuccessResponse,
  RegisterPayload,
  RefreshTokenPayload,
  RefreshTokenResponse,
  LogoutPayload,
} from "@/types/auth";
import type { UserProfile } from "@/types/user";

import apiClient, { type ApiError } from "./apiClient";

/**
 * @service POST /api/v1/auth/register
 * @description 用户注册。
 */
export const register = async (
  payload: RegisterPayload
): Promise<UserProfile> => {
  try {
    const response = await apiClient.post<UserProfile>(
      "/api/v1/auth/register",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /api/v1/auth/login
 * @description 用户登录。
 */
export const login = async (
  payload: LoginPayload
): Promise<AuthSuccessResponse> => {
  try {
    const response = await apiClient.post<AuthSuccessResponse>(
      "/api/v1/auth/login",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /api/v1/auth/refreshToken
 * @description 刷新访问令牌。
 */
export const refreshToken = async (
  payload: RefreshTokenPayload
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/api/v1/auth/refreshToken",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /api/v1/auth/logout
 * @description 用户登出。
 */
export const logout = async (payload: LogoutPayload): Promise<void> => {
  try {
    await apiClient.post("/api/v1/auth/logout", payload);
  } catch (err) {
    throw err as ApiError;
  }
};
