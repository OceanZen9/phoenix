/**
 * @file apiClient.ts
 * @description 创建并配置一个全局共享的 Axios 实例。
 * 这个文件是所有 API 服务的基础。
 */

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuth } from "@/stores/authStore";

// --- 标准化错误接口 ---
// 将这个接口放在这里，因为它是响应拦截器产出的“标准化产品”
export interface ApiError {
  message: string;
  status?: number;
}

// --- 创建 Axios 实例 ---
// 使用 axios.create() 创建一个可以被全局复用的实例

const baseURL = import.meta.env.VITE_API_BASE_URL || "";
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});



// --- 配置请求拦截器 ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果是刷新 token 的请求，则不添加 Authorization 头
    if (config.url?.endsWith('/auth/refreshToken')) {
      return config;
    }
    const accessToken = useAuth.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // 这里的错误是请求发送前的配置错误
    return Promise.reject(error);
  }
);

// --- 配置响应拦截器 ---
// 它的任务是将所有后端返回的错误，标准化为 ApiError 格式
// --- 变量用于处理并发刷新 Token ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// --- 配置响应拦截器 ---
// 它的任务是将所有后端返回的错误，标准化为 ApiError 格式
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // 成功时直接返回完整的 response
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 扩展 InternalAxiosRequestConfig 以包含 _retry 属性
    interface RetryRequestConfig extends InternalAxiosRequestConfig {
      _retry?: boolean;
    }

    // 如果是 401 错误，且未重试过
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/refreshToken") &&
      !(originalRequest as RetryRequestConfig)._retry
    ) {
      if (isRefreshing) {
        // 如果正在刷新，则将请求加入队列
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as RetryRequestConfig)._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = useAuth.getState();
        
        if (!refreshToken) {
           throw new Error("No refresh token available");
        }

        // 使用原生 axios 发送刷新请求，避免循环引用和拦截器死循环
        // 注意：这里需要根据实际的 baseURL 拼接完整 URL
        const baseURL = apiClient.defaults.baseURL || "";
        const refreshResponse = await axios.post(
          `${baseURL}/api/v1/auth/refreshToken`,
          { refreshToken } 
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // 更新 Zustand store
        useAuth.setState({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // 处理队列中的请求
        processQueue(null, newAccessToken);

        // 更新请求头并重试原请求
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // 刷新失败，处理队列，清空状态并跳转登录
        processQueue(refreshError, null);
        useAuth.getState().logout();
        // 这里可以选择抛出错误或者重定向，视路由守卫实现而定
        // 为了让通过 UI 感知，还是 reject 出去
        return Promise.reject(refreshError); 
      } finally {
        isRefreshing = false;
      }
    }

    const standardError: ApiError = {
      message: "发生未知错误，请稍后重试。",
    };

    if (error.response) {
      // 定义一个更具体的错误响应数据类型
      interface ErrorResponseData {
        message?: string;
        error_description?: string;
      }
      const responseData = error.response.data as ErrorResponseData;
      standardError.message =
        responseData.message ||
        responseData.error_description ||
        `服务器错误 (代码: ${error.response.status})`;
      standardError.status = error.response.status;
    } else if (error.request) {
      standardError.message = "网络连接失败，请检查您的网络设置。";
      standardError.status = -1;
    }

    return Promise.reject(standardError);
  }
);

// --- 导出 ---
// 默认导出配置好的实例，以便其他服务文件使用
export default apiClient;
