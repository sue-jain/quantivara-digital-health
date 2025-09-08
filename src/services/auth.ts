import { API_BASE_URL } from '@/config/api';

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    userType: 'patient' | 'doctor';
  };
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface LoginData {
  username: string;
  password: string;
  userType: 'patient' | 'doctor';
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  private userType: 'patient' | 'doctor' | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    this.user = this.getStoredUser();
    const storedType = localStorage.getItem('user_type');
    this.userType = storedType === 'patient' || storedType === 'doctor' ? storedType : null;
  }

  async registerFromInvite(inviteCode: string, username: string, password: string): Promise<{ token: string; userId: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register-from-invite`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inviteCode, username, password })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Failed to complete registration');
    const token = result.data.token as string;
    this.setToken(token);
    this.setUserType('patient');
    return { token, userId: result.data.userId };
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store token and user data
      this.setToken(result.data.token);
      this.setUser(result.data.user);
      this.setUserType(result.data.userType);

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: this.token }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearAuth();
    }
  }

  // Verify current token
  async verifyToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.token }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.setUser(result.data.user);
        this.setUserType(result.data.userType);
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.clearAuth();
      return false;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch user profile');
      }

      return result.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  // User management
  setUser(user: User): void {
    this.user = user;
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  getUser(): User | null {
    return this.user;
  }

  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Clear authentication data
  clearAuth(): void {
    this.token = null;
    this.user = null;
    this.userType = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_type');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  // Get authorization header
  getAuthHeader(): { Authorization: string } | {} {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // User type management
  setUserType(type: 'patient' | 'doctor'): void {
    this.userType = type;
    localStorage.setItem('user_type', type);
  }

  getUserType(): 'patient' | 'doctor' | null {
    return this.userType;
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;
