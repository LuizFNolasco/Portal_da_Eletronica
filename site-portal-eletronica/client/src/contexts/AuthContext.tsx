import React, { createContext, useContext, useState, useCallback } from 'react';

import { useStore } from './StoreContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'Cliente' | 'Administrador' | 'Gerente';
  cpf?: string;
  endereco?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User> & { password?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { users, addUser } = useStore();

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const foundUser = users.find(u => u.email === email && u.senha === password);
    
    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        cpf: foundUser.cpf,
        endereco: foundUser.endereco,
      });
    } else {
      throw new Error('Email ou senha inválidos');
    }
  }, [users]);

  const register = useCallback(async (data: Partial<User> & { password?: string }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (data.name && data.email && data.password) {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        senha: data.password,
        role: data.role || 'Cliente',
        cpf: data.cpf,
        endereco: data.endereco,
      };
      
      addUser(newUser);
      
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as any,
        cpf: newUser.cpf,
        endereco: newUser.endereco,
      });
    } else {
      throw new Error('Dados inválidos');
    }
  }, [addUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
