import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockProducts as initialProducts } from '../lib/mockData';
import { Product } from '../lib/mockData';
import { User } from './AuthContext';

export interface ExtendedUser extends User {
  cpf?: string;
  endereco?: string;
  senha?: string; // in a real app, hashed
  cartao?: string;
  dataAdmissao?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerCpf: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  items: any[];
  total: number;
  date: string;
  status: string;
  statusUpdatedAt?: string;
}

export interface StoreState {
  products: Product[];
  users: ExtendedUser[];
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addUser: (user: ExtendedUser) => void;
  updateUser: (id: string, user: Partial<ExtendedUser>) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Modify existing products to match the new interface constraints
    return initialProducts.map(p => ({
      ...p,
      tipoProduto: p.tipoProduto || 'Componente Eletrônico', // default for old ones
      category: p.category || 'Componentes',
      dataVigencia: p.dataVigencia || new Date().toISOString().split('T')[0],
      status: p.status || 'Ativo',
    })) as unknown as Product[];
  });

  const [users, setUsers] = useState<ExtendedUser[]>([
    {
      id: 'cliente1',
      name: 'João Cliente',
      email: 'cliente@teste.com',
      role: 'Cliente',
      cpf: '161.142.800-91',
      senha: '123',
    },
    {
      id: 'admin1',
      name: 'Maria Administradora',
      email: 'admin@teste.com',
      role: 'Administrador',
      cpf: '830.014.880-93',
      senha: '123',
      dataAdmissao: '2023-01-01',
    },
    {
      id: 'gerente1',
      name: 'Carlos Gerente',
      email: 'gerente@teste.com',
      role: 'Gerente',
      cpf: '242.906.640-83',
      senha: '123',
      dataAdmissao: '2022-05-15',
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([]);

  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const addUser = (user: ExtendedUser) => setUsers(prev => [...prev, user]);
  const updateUser = (id: string, data: Partial<ExtendedUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  return (
    <StoreContext.Provider value={{ products, users, orders, addProduct, updateProduct, addUser, updateUser, addOrder, updateOrder }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
