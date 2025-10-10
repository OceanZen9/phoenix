/**
 * @file src/types/user.ts
 * @description 定义所有与用户相关的TypeScript接口。
 */

/**
 * @description 用户的个人资料信息
 */
export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * @description 更新用户个人资料时提交的数据体 (Payload)
 */
export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

/**
 * @description 修改用户密码时提交的数据体 (Payload)
 */
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
