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
    const accessToken = localStorage.getItem("access_token");
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
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // 成功时直接返回完整的 response
  (error: AxiosError): Promise<ApiError> => {
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
