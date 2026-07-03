import api from "@/services/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export async function login(data: LoginRequest): Promise<LoginResponse["data"]> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data.data;
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse["data"]> {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data.data;
}