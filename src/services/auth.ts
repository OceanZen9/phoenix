/**
 * @file apiClient.ts
 * @description
 */

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/types/auth";

import apiClient, { type ApiError } from "./apiClient";

/**
 * @service POST /auth/register
 * @description 用户注册。
 */
export const register = async (
  payload: RegisterPayload
): Promise<LoginPayload> => {
  try {
    const response = await apiClient.post<LoginPayload>(
      "/auth/register",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /auth/login
 * @description 用户登录。
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /auth/refresh
 * @description 刷新访问令牌。
 */
export const refreshToken = async (
  refresh_token: string
): Promise<{ access_token: string }> => {
  try {
    const response = await apiClient.post<{ access_token: string }>(
      "/auth/refresh",
      { refresh_token }
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /auth/logout
 * @description 用户登出。
 */
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>("/auth/logout");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};
