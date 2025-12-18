import api from './api';

export interface PostDTO {
  id: string;
  content: string;
  createdAt: string | Date;
  author?: { name?: string } | string;
  community?: { id?: string; name?: string } | string;
  edited?: boolean;
  editHistory?: number;
  qualidade?: number;
  naoGostou?: number;
  hasLiked?: boolean;
  hasDisliked?: boolean;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  community: string;
  readTime?: number;
  edited?: boolean;
  editHistory?: number;
  qualidade: number;
  naoGostou: number;
  hasLiked: boolean;
  hasDisliked: boolean;
}

function toPost(p: PostDTO): Post {
  const author = typeof p.author === 'string' ? p.author : (p.author?.name ?? 'Autor');
  const community = typeof p.community === 'string' ? p.community : (p.community?.name ?? 'Comunidade');
  const createdAt = p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt);
  return {
    id: p.id,
    author,
    content: p.content,
    createdAt,
    community,
    edited: p.edited,
    editHistory: p.editHistory,
    qualidade: typeof p.qualidade === 'number' ? p.qualidade : 0,
    naoGostou: typeof p.naoGostou === 'number' ? p.naoGostou : 0,
    hasLiked: Boolean(p.hasLiked),
    hasDisliked: Boolean(p.hasDisliked),
  };
}

export async function listRandomPosts(): Promise<Post[]> {
  const res = await api.get('/posts');
  const data: PostDTO[] = res.data ?? [];
  return data.map(toPost);
}

export async function listMyPosts(): Promise<Post[]> {
  const res = await api.get('/posts/me');
  const data: PostDTO[] = res.data ?? [];
  return data.map(toPost);
}

export interface DiscussionDTO {
  id: string;
  content: string;
  createdAt: string | Date;
  author?: { name?: string } | string;
}

export interface Discussion {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

function toDiscussion(d: DiscussionDTO): Discussion {
  const author = typeof d.author === 'string' ? d.author : (d.author?.name ?? 'Autor');
  const createdAt = d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt);
  return {
    id: d.id,
    author,
    content: d.content,
    createdAt,
  };
}

export async function listDiscussions(postId: string): Promise<Discussion[]> {
  const res = await api.get(`/posts/${postId}/discussions`);
  const data: DiscussionDTO[] = res.data ?? [];
  return data.map(toDiscussion);
}

export async function createDiscussion(postId: string, payload: { content: string }): Promise<Discussion> {
  const res = await api.post(`/posts/${postId}/discussions`, payload);
  return toDiscussion(res.data);
}

export async function createPost(payload: { content: string; community: string }): Promise<Post> {
  const res = await api.post('/posts', payload);
  return toPost(res.data);
}

export async function likePost(postId: string): Promise<Post> {
  const res = await api.post(`/posts/${postId}/like`);
  return toPost(res.data);
}

export async function unlikePost(postId: string): Promise<Post> {
  const res = await api.post(`/posts/${postId}/unlike`);
  return toPost(res.data);
}

export async function dislikePost(postId: string): Promise<Post> {
  const res = await api.post(`/posts/${postId}/dislike`);
  return toPost(res.data);
}

export async function undislikePost(postId: string): Promise<Post> {
  const res = await api.post(`/posts/${postId}/undislike`);
  return toPost(res.data);
}
