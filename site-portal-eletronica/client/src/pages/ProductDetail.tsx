import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { Star, ShoppingCart, ChevronLeft, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ProductDetailProps {
  onNavigate?: (page: string) => void;
}

export default function ProductDetail({ onNavigate }: ProductDetailProps) {
  const [location, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { products } = useStore();

  // Extract product ID from URL path
  const productId = (location as string).split('/').pop();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Produto não encontrado
          </h1>
          <Button onClick={() => onNavigate?.('home')}>
            Voltar para produtos
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Faça login para adicionar produtos ao carrinho');
      setLocation('/auth');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} adicionado ao carrinho!`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('home')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Voltar para produtos
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="rounded-lg overflow-hidden mb-4 flex items-center justify-center p-8 h-64 md:h-96">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm font-medium text-accent uppercase tracking-wide">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground">
              {product.description}
            </p>

            {/* Stock Status */}
            <div>
              {product.stock > 10 ? (
                <p className="text-sm font-medium text-green-600">Em Estoque</p>
              ) : product.stock > 0 ? (
                <p className="text-sm font-medium text-yellow-600">Apenas {product.stock} em Estoque</p>
              ) : (
                <p className="text-sm font-medium text-destructive">Sem estoque</p> 
              )}
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            {user?.role !== 'Gerente' && user?.role !== 'Administrador' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">Quantidade:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 font-medium text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  size="lg"
                  className="w-full gap-2"
                >
                  <ShoppingCart size={20} />
                  Adicionar ao carrinho
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Especificações
            </h2>
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="font-medium text-foreground">{key}</span>
                    <span className="text-muted-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
