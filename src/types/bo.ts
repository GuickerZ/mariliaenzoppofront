export interface LoginResponse {
  accessToken: string;
  userId: number;
  email: string;
}

export interface Post {
  id: number;
  content: string;
  createdAt: Date | string;
  creator: UserResponse;
  qualidade?: number;
  naoGostou?: number;
  hasLiked?: boolean;
  hasDisliked?: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  name: string;
  posts: Post[];
}
