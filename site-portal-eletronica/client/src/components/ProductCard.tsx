import React from 'react';
import { Product } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Faça login para adicionar produtos ao carrinho');
      setLocation('/auth');
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
      onClick={() => onProductClick?.(product)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-66">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {product.originalPrice && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category Badge */}
        <div className="text-xs font-medium text-accent uppercase tracking-wide">
          {product.category.replace(/([A-Z])/g, ' $1').trim()}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2 text-foreground">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-xs font-medium">
          {product.stock > 10 ? (
            <span className="text-green-600">Em estoque</span>
          ) : product.stock > 0 ? (
            <span className="text-yellow-600">Só {product.stock} restantes</span>
          ) : (
            <span className="text-destructive">Sem Estoque</span>
          )}
        </div>

        {/* Add to Cart Button */}
        {user?.role !== 'Gerente' && user?.role !== 'Administrador' && (
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full gap-2 mt-auto"
            size="sm"
          >
            <ShoppingCart size={16} />
            Adicionar ao carrinho
          </Button>
        )}
      </div>
    </Card>
  );
}
