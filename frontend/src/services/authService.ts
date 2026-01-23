const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface SignupData {
  email: string;
  password: string;
  confirm_password?: string;
  first_name?: string;
  last_name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Signup validation error:', error);
        // Extract the first error message from the response
        const errorMessage = error.detail 
          || error.email?.[0] 
          || error.password?.[0] 
          || error.confirm_password?.[0]
          || error.first_name?.[0]
          || error.last_name?.[0]
          || Object.values(error)[0]
          || 'Signup failed';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      this.setTokens(result.access, result.refresh);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        let error;
        try {
          error = JSON.parse(text);
        } catch {
          console.error('Non-JSON error response:', text.substring(0, 100)); // Log first 100 chars
          throw new Error(`Server Error (${response.status}): ${response.statusText}`);
        }
        throw new Error(error.detail || 'Login failed');
      }

      const result = await response.json();
      this.setTokens(result.access, result.refresh);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  private setTokens(access: string, refresh: string): void {
    this.token = access;
    this.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }
}

const authService = new AuthService();
export default authService;
