import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  age?: number;
  gender?: string;
  specialization?: string;
  qualifications?: string;
  medicalHistory?: string;
  profilePicture?: string;
  availability?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('medicalPlatformUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Make API call to backend
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        role: email === 'doctor@test.com' ? 'doctor' : 'patient' // Determine role based on email for now
      });

      if (response.data && response.data.user) {
        const user: User = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          specialization: response.data.user.specialization,
          qualifications: response.data.user.qualifications,
        };

        // Store JWT token
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        setUser(user);
        localStorage.setItem('medicalPlatformUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Make API call to backend
      const response = await axios.post('/api/auth/register', userData);

      if (response.data && response.data.user) {
        const user: User = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        };

        setUser(user);
        localStorage.setItem('medicalPlatformUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicalPlatformUser');
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('medicalPlatformUser', JSON.stringify(updatedUser));
    }
  };

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};