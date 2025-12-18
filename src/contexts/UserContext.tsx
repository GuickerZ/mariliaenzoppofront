import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser } from '@/api/authApi';
import { getMyCommunities } from '@/api/me';

interface User {
  id: string;
  email: string;
  joinedAt: Date;
  communities: string[];
  dailyTimeLimit: number;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    
    const loadUser = async () => {
      try {
        setIsLoadingUser(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setUser(null);
          return;
        }
        const me = await getUser();
        if (!mounted) return;
        if (!me) {
          setUser(null);
          return;
        }
        
        // Busca as comunidades do usuário em paralelo
        const myCommunities = await getMyCommunities();
        if (!mounted) return;
        
        // Extrai apenas os nomes das comunidades
        const communityNames = myCommunities.map(c => c.name);
        
        setUser({
          id: String(me.id),
          email: me.email,
          joinedAt: new Date(),
          communities: communityNames,
          dailyTimeLimit: 30,
        });
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoadingUser(false);
      }
    };
    loadUser();
    
    return () => { mounted = false; };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isAuthenticated,
      isLoadingUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}