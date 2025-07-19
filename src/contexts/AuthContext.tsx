import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('smv_admin_token');
    const storedExpiry = localStorage.getItem('smv_admin_expiry');
    
    if (storedToken && storedExpiry) {
      const expiresAt = parseInt(storedExpiry);
      if (Date.now() < expiresAt) {
        setUser({
          token: storedToken,
          expiresAt,
          isAuthenticated: true
        });
      } else {
        // Token expired, clear storage
        localStorage.removeItem('smv_admin_token');
        localStorage.removeItem('smv_admin_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Mock response for development
      const mockResponse: AuthResponse = {
        access_token: 'mock_admin_token_' + Date.now(),
        token_type: 'Bearer',
        expires_in: 3600
      };

      const expiresAt = Date.now() + (mockResponse.expires_in * 1000);
      const authUser: AuthUser = {
        token: mockResponse.access_token,
        expiresAt,
        isAuthenticated: true
      };

      // Store in localStorage
      localStorage.setItem('smv_admin_token', mockResponse.access_token);
      localStorage.setItem('smv_admin_expiry', expiresAt.toString());

      setUser(authUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('smv_admin_token');
    localStorage.removeItem('smv_admin_expiry');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};