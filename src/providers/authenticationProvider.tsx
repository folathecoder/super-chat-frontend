'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { User } from '@/types/api/user';
import { getUser } from '@/services/user.service';

export interface AuthContextType {
  user?: User;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();

  const fetchUser = useCallback(async () => {
    try {
      const data = await getUser();
      setUser(data);
    } catch (err) {
      console.error(`Failed to fetch user profile: ${String(err)}`);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
