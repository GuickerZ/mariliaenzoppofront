import { LoginResponse, UserResponse } from "@/types/bo";
import api from "./api";

const LOGIN_URL = `/entrar`;
const REGISTER_URL = `/cadastrar`;

export const auth = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post(LOGIN_URL, {
        email: email,
        password: password,
    });
    
    return response.data;
};

export const getUser = async (): Promise<UserResponse | null> => {
    const response = await api.get('/entrar');
    return response.data;
}

export const register = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post(REGISTER_URL, {
        email: email,
        password: password,
    });

    return response.data;
};
