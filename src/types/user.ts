/**
 * @file src/types/user.ts
 * @description 定义所有与用户相关的TypeScript接口。
 */

/**
 * @description 用户的个人资料信息
 */
export interface UserProfile {
  id?: number;
  userId?: string;
  role?: string;
  username?: string;
  avatar?: string | null;
  email: string;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @description 更新用户个人资料时提交的数据体 (Payload)
 */
export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  avatar?: string;
}

/**
 * @description 修改用户密码时提交的数据体 (Payload)
 */
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword:string;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  data: T;
}
