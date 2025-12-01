import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/types/user";

import apiClient, { type ApiError } from "./apiClient";

/**
 * @service GET /api/v1/users/profile
 * @description 获取当前登录用户的个人资料。
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>("/api/v1/users/profile");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PATCH /api/v1/users/profile
 * @description 更新当前登录用户的个人资料。
 */
export const updateUserProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  try {
    const response = await apiClient.patch<UserProfile>(
      "/api/v1/users/profile",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PATCH /api/v1/users/change-password
 * @description 修改当前登录用户的密码。
 */
export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<UserProfile> => {
  try {
    const response = await apiClient.patch<UserProfile>(
      "/api/v1/users/change-password",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};
