import api from './api';

export interface Community {
  id: string;
  name: string;
  description?: string;
  membersCount?: number;
  postsCount?: number;
  discussionsCount?: number;
  tags?: string[];
  featured?: boolean;
}

export interface CreateCommunityInput {
  name: string;
  description?: string;
  tags?: string[];
}

export interface CreatePostInput {
  content: string;
}

export async function listCommunities() {
  const res = await api.get('/communities');
  return res.data as Community[];
}

export async function createCommunity(data: CreateCommunityInput) {
  const res = await api.post('/communities', data);
  return res.data as Community;
}

export async function joinCommunity(id: string) {
  const res = await api.post(`/communities/${id}/join`);
  return res.data;
}

export async function listCommunityPosts(id: string) {
  const res = await api.get(`/communities/${id}/posts`);
  return res.data;
}

export async function createCommunityPost(id: string, data: CreatePostInput) {
  const res = await api.post(`/communities/${id}/posts`, data);
  return res.data;
}

export interface CommunityBrief {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface CommunityDetailDiscussionCreator {
  id: string | number;
  email: string;
}

export interface CommunityDetailDiscussionPostRef {
  id: string | number;
}

export interface CommunityDetailDiscussion {
  id: string | number;
  content: string;
  createdAt: string;
  creator: CommunityDetailDiscussionCreator;
  post: CommunityDetailDiscussionPostRef;
}

export interface CommunityDetailResponse {
  community: CommunityBrief;
  isMember: boolean;
  membersCount: number;
  discussionsCount: number;
  discussions: CommunityDetailDiscussion[];
}

export async function getCommunity(id: string) {
  const res = await api.get(`/communities/${id}`);
  return res.data as CommunityDetailResponse;
}
