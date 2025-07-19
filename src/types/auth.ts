export interface LoginCredentials {
  client_id: string;
  client_secret: string;
  grant_type: 'client_credentials';
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