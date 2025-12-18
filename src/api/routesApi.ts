import { Post } from "@/types/bo";
import api from "./api";

export const getPosts = async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
}