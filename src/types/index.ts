export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}