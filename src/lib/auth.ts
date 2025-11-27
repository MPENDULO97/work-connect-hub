import { authAPI } from './api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

const TOKEN_KEY = 'authToken';

export const authService = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  async signup(email: string, password: string, fullName: string, roles: string[]) {
    const response = await authAPI.signup({ email, password, fullName, roles });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  async login(email: string, password: string) {
    const response = await authAPI.login({ email, password });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  async logout() {
    await authAPI.logout();
    this.removeToken();
  },

  async getSession(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await authAPI.getSession(token);
      return response.user;
    } catch (error) {
      this.removeToken();
      return null;
    }
  },
};
