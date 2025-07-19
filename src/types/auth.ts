export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface AuthUser {
  token: string;
  expiresAt: number;
  isAuthenticated: boolean;
}