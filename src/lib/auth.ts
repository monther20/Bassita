import { User } from '@/stores';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export class AuthTokenManager {
  static setTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, tokens.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static removeTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken || this.isTokenExpired(refreshToken)) {
      return null;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setTokens({
        token: data.token,
        refreshToken: data.refreshToken || refreshToken,
      });

      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.removeTokens();
      return null;
    }
  }
}

export class AuthAPI {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  static async loginWithEmail(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  static async loginWithProvider(provider: 'google' | 'discord' | 'github'): Promise<string> {
    return `${this.baseUrl}/auth/${provider}`;
  }

  static async logout(): Promise<void> {
    const token = AuthTokenManager.getToken();
    if (!token) return;

    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      AuthTokenManager.removeTokens();
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = AuthTokenManager.getToken();
    if (!token) return null;

    if (AuthTokenManager.isTokenExpired(token)) {
      const newToken = await AuthTokenManager.refreshAccessToken();
      if (!newToken) return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${AuthTokenManager.getToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          AuthTokenManager.removeTokens();
        }
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
}

export function createAuthenticatedFetch() {
  return async (url: string, options: RequestInit = {}) => {
    let token = AuthTokenManager.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    if (AuthTokenManager.isTokenExpired(token)) {
      token = await AuthTokenManager.refreshAccessToken();
      if (!token) {
        throw new Error('Unable to refresh authentication token');
      }
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };
}