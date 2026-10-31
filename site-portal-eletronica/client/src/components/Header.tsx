import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onNavigate?: (page: string) => void;
  onCartClick?: () => void;
}

export function Header({ onSearch, onNavigate, onCartClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate?.('home')}
          className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors"
        >
          <img src="logo.png" alt="Logo" className="w-8 h-8" />
          <span className="hidden sm:inline">Portal da Eletrônica</span>
        </button>

        {/* Search Bar */}
        {/* <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </form> */}

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {(user?.role === 'Gerente' || user?.role === 'Administrador') && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onNavigate?.('admin')}
              className="hidden sm:flex"
            >
              Painel Admin
            </Button>
          )}

          {/* Mobile Search */}
          <button
            onClick={() => onSearch?.('')}
            className="md:hidden text-foreground hover:text-primary transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Cart */}
          {user?.role !== 'Gerente' && user?.role !== 'Administrador' && (
            <button
              onClick={onCartClick}
              className="relative text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role !== 'Gerente' && user?.role !== 'Administrador' && (
                    <DropdownMenuItem onClick={() => onNavigate?.('orders')}>
                      Meus Pedidos
                    </DropdownMenuItem>
                  )}
                  {(user.role === 'Administrador' || user.role === 'Gerente') && (
                    <DropdownMenuItem onClick={() => onNavigate?.('admin')}>
                      Painel Administrativo
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => onNavigate?.('auth')}>
                    Entrar / Cadastrar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
