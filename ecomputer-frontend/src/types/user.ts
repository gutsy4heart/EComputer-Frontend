export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  role?: UserRole;
  address?: string;
  image?: string;
  imageUrl?: string; // Добавляем поддержку imageUrl от бэкенда
  isEmailConfirmed?: boolean; // Добавляем поддержку подтверждения email
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: number;
  returnUrl?: string;
}

export interface UpdateUserRequest {
  id: number;
  email: string;
  name?: string;
  address?: string;
  image?: string;
  password?: string;
}

export interface UploadUserImageRequest {
  userId: number;
  file: File;
}

export interface UploadUserImageResponse {
  imageUrl: string;
  success: boolean;
}

// Новые типы для методов пользователей
export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: UserRole;
  returnUrl?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface DeleteUserRequest {
  id: number;
}

export interface LogoutUserRequest {
  token: string;
}

export interface UpdateRefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface ImageUploadRequest {
  imageFile: File;
}

export interface RequestPasswordChangeRequest {
  email: string;
}

export interface ConfirmPasswordChangeRequest {
  token: string;
  newPassword: string;
}

export interface RegisterResponse {
  qrCodeBase64: string;
}

export interface QrCodeResponse {
  qrToken: string;
  expiresAt: string;
  qrCodeImage: string;
}
