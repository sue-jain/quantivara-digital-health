import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  userType: 'patient' | 'doctor' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, userType: 'patient' | 'doctor') => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuthenticated = await authService.verifyToken();
        if (isAuthenticated) {
          setUser(authService.getUser());
          const type = authService.getUserType();
          if (type) setUserType(type);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string, userType: 'patient' | 'doctor'): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ username, password, userType });
      setUser(response.data.user);
      setUserType(response.data.userType);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.register(data);
      // After registration, log in as patient
      const response = await authService.login({ username: data.username, password: data.password, userType: 'patient' });
      setUser(response.data.user);
      setUserType('patient');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      setUser(null);
      setUserType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (user?.id) {
        const profile = await authService.getUserProfile(user.id);
        setUser(profile.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
