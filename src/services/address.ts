import {
  type Address,
  type CreateAddressPayload,
  type UpdateAddressPayload,
} from "@/types/address";
import apiClient, { type ApiError } from "./apiClient";

/**
 * @service POST /api/v1/addresses
 * @description Create a user address.
 */
export const createAddress = async (
  payload: CreateAddressPayload
): Promise<Address> => {
  try {
    const response = await apiClient.post<Address>("/api/v1/addresses", payload);
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service GET /api/v1/addresses
 * @description Get the current user's address list.
 */
export const getAddressList = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get<Address[]>("/api/v1/addresses");
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PUT /api/v1/addresses/{addressId}
 * @description Update a user address.
 */
export const updateAddress = async (
  addressId: number,
  payload: UpdateAddressPayload
): Promise<Address> => {
  try {
    const response = await apiClient.put<Address>(
      `/api/v1/addresses/${addressId}`,
      payload
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service PATCH /api/v1/addresses/{id}/default
 * @description Set an address as default.
 */
export const setDefaultAddress = async (id: number): Promise<Address> => {
  try {
    const response = await apiClient.patch<Address>(
      `/api/v1/addresses/${id}/default`
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};

/**
 * @service DELETE /api/v1/addresses/{id}
 * @description Delete a user address.
 */
export const deleteAddress = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `/api/v1/addresses/${id}`
    );
    return response.data;
  } catch (err) {
    throw err as ApiError;
  }
};
