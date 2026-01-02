export interface CommentUser {
  id: number;
  nickname: string;
  avatar: string;
}

export interface Comment {
  id: number;
  productId: number;
  user: CommentUser;
  rating: number;
  content: string;
  createdTime: string;
  updatedTime: string;
}

export interface AddCommentPayload {
  content: string;
  rating: number;
}

export interface UpdateCommentPayload {
  content: string;
  rating: number;
}
