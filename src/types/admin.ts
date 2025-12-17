/**
 * @file src/types/admin.ts
 * @description 定义所有与管理员相关的TypeScript接口。
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

/**
 * @description 管理员仪表盘数据接口 (待完善)
 */
export interface AdminDashboardData {
  // TODO: Add actual properties for dashboard data once known
  [key: string]: any; 
}
