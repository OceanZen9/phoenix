import apiClient, { type ApiError } from "./apiClient";
import type { Address, CreateAddressPayload, UpdateAddressPayload } from "@/types/address";

export interface GenericResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * @service GET /api/v1/addresses
 * @description 获取当前用户地址列表
 */
export const getAddressList = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get<GenericResponse<Address[]>>("/api/v1/addresses");
    if (response.data && 'data' in response.data && 'code' in response.data) {
        return response.data.data;
    }
    return response.data as unknown as Address[];
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service POST /api/v1/addresses
 * @description 创建一个用户地址
 */
export const createAddress = async (payload: CreateAddressPayload): Promise<Address> => {
  try {
    const response = await apiClient.post<GenericResponse<Address>>("/api/v1/addresses", payload);
     if (response.data && 'data' in response.data && 'code' in response.data) {
        return response.data.data;
    }
    return response.data as unknown as Address;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PUT /api/v1/addresses/{addressId}
 * @description 更新用户的某个地址
 */
export const updateAddress = async (addressId: number, payload: UpdateAddressPayload): Promise<Address> => {
  try {
    const response = await apiClient.put<GenericResponse<Address>>(`/api/v1/addresses/${addressId}`, payload);
     if (response.data && 'data' in response.data && 'code' in response.data) {
        return response.data.data;
    }
    return response.data as unknown as Address;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PATCH /api/v1/addresses/{id}/default
 * @description 将地址设置为默认地址
 */
export const setDefaultAddress = async (id: number): Promise<void> => {
  try {
    await apiClient.patch(`/api/v1/addresses/${id}/default`);
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service DELETE /api/v1/addresses/{id}
 * @description 删除对应地址
 */
export const deleteAddress = async (id: number): Promise<void> => {
   try {
    await apiClient.delete(`/api/v1/addresses/${id}`);
  } catch (err) {
    throw err as ApiError;
  }
};
