import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Minus, Plus, Trash2, ShoppingCart, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface CartProps {
  onNavigate?: (page: string) => void;
}

export default function Cart({ onNavigate }: CartProps) {
  const { items, selectedItems, removeFromCart, updateQuantity, totalPrice, clearCart, toggleSelection } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Você precisa fazer login para acessar o carrinho');
      setLocation('/auth');
    } else if (user?.role === 'Gerente' || user?.role === 'Administrador') {
      toast.error('O acesso ao carrinho é exclusivo para clientes.');
      setLocation('/');
    }
  }, [isLoggedIn, user, setLocation]);

  const SHIPPING_COST = 10.00;
  const subtotal = totalPrice;
  const total = subtotal + (selectedItems.length > 0 ? SHIPPING_COST : 0);

  if (!isLoggedIn) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-muted-foreground mb-8">
            Navegue pela loja para adicionar itens ao carrinho
          </p>
          <Button onClick={() => onNavigate?.('home')} size="lg">
            Continuar Comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container">
        <button
          onClick={() => onNavigate?.('home')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Voltar para a vitrine
        </button>

        <h1 className="text-4xl font-bold text-foreground mb-8">Carrinho de pedidos</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id} className="p-4 md:p-6">
                <div className="flex gap-4 md:gap-6 items-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-primary cursor-pointer"
                    checked={item.selected !== false}
                    onChange={(e) => toggleSelection(item.product.id, e.target.checked)}
                  />
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.description}
                      </p>
                      <p className="text-lg font-bold text-primary mb-4">
                        {item.product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">Subtotal</p>
                    <p className="font-bold text-xl text-foreground">
                      {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="font-bold text-xl text-foreground mb-6">
                Resumo do pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal dos produtos</span>
                  <span className="font-medium text-foreground">
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium text-foreground">
                    {SHIPPING_COST.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      toast.error('Selecione pelo menos um item para finalizar o pedido');
                      return;
                    }
                    if (!isLoggedIn) {
                      sessionStorage.setItem('redirectAfterAuth', 'checkout');
                      toast.info('Crie uma conta ou faça login para finalizar o pedido');
                      onNavigate?.('auth');
                    } else {
                      onNavigate?.('checkout');
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  Ir para o pagamento
                </Button>

                <Button
                  onClick={() => onNavigate?.('home')}
                  variant="outline"
                  className="w-full hover:!bg-secondary"
                >
                  Continuar comprando
                </Button>

                <Button
                  onClick={clearCart}
                  variant="ghost"
                  className="bg-red-400 hover:bg-red-500 w-full text-white hover:text-white"
                >
                  Limpar carrinho
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
