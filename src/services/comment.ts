import apiClient from './apiClient';
import type { Comment, AddCommentPayload, UpdateCommentPayload } from '@/types/comment';

export const getProductComments = async (productId: string | number): Promise<Comment[]> => {
  const response = await apiClient.get(`/api/v1/products/${productId}/comments`);
  return response.data;
};

export const addProductComment = async (
  productId: string | number,
  payload: AddCommentPayload
): Promise<void> => {
  await apiClient.post(`/api/v1/products/${productId}/comments`, payload);
};

export const updateProductComment = async (
  productId: string | number,
  commentId: number,
  payload: UpdateCommentPayload
): Promise<void> => {
  await apiClient.put(`/api/v1/products/${productId}/comments/${commentId}`, payload);
};

export const deleteProductComment = async (
  productId: string | number,
  commentId: number
): Promise<void> => {
  await apiClient.delete(`/api/v1/products/${productId}/comments/${commentId}`);
};
