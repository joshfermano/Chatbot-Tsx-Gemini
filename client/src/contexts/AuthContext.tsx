import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { fetchWithAuth } from '../config/apiConfig';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifySession = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth('/api/auth/verify');

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setUser({ username: data.username, email: data.email });
      setError(null);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    verifySession();
  }, []);

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Set user data from the response
      setUser({ username: data.user.username, email: data.user.email });
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set user data from the response
      setUser({ username: data.user.username, email: data.user.email });
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Call logout endpoint to clear the cookie
      const response = await fetchWithAuth('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear guest chat data from localStorage
      localStorage.removeItem('guestChat');

      // Dispatch logout event for other components to respond
      window.dispatchEvent(new CustomEvent('userLoggedOut'));

      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh auth state
  const refreshAuth = async (): Promise<void> => {
    await verifySession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        isLoading,
        error,
        refreshAuth,
      }}>
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
