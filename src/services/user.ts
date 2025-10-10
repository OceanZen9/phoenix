import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/types/user";

import apiClient, { type ApiError } from "./apiClient";

/**
 * @service GET /users/profile
 * @description 获取当前登录用户的个人资料。
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    // apiClient.get 返回的是完整的 AxiosResponse<UserProfile>
    const response = await apiClient.get<UserProfile>("/users/profile");
    // 在这里提取 .data，类型完全匹配，没有错误。
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PUT /users/profile
 * @description 更新当前登录用户的个人资料。
 */
export const updateUserProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  try {
    const response = await apiClient.put<UserProfile>(
      "/users/profile",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /users/change-password
 * @description 修改当前登录用户的密码。
 */
export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      "/users/change-password",
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};
