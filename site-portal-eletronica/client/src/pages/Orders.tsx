import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Clock, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

interface OrdersProps {
  onNavigate?: (page: string) => void;
}

export default function Orders({ onNavigate }: OrdersProps) {
  const { orders } = useStore();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa fazer login para ver seus pedidos');
      setLocation('/auth');
    } else if (user?.role === 'Gerente' || user?.role === 'Administrador') {
      toast.error('Apenas clientes possuem acesso aos pedidos pessoais.');
      setLocation('/');
    }
  }, [user, setLocation]);

  const userOrders = orders.filter(o => o.userId === user?.id);

  if (!user || user.role === 'Gerente' || user.role === 'Administrador') return null;

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Nenhum pedido encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            Você ainda não possui pedidos realizados.
          </p>
          <Button onClick={() => onNavigate?.('home')} size="lg">
            Ir para a loja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container">
        <h1 className="text-4xl font-bold text-foreground mb-8">Meus pedidos</h1>

        <div className="space-y-6">
          {userOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Pedido {order.id}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock size={14} /> Data do pedido: {new Date(order.date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Aguardando Pagamento' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Pagamento confirmado' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal dos produtos</span>
                  <span className="font-medium">
                    {(order.total - 10.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">
                    {(10.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t">
                  <span className="font-medium text-muted-foreground">Total do Pedido</span>
                  <span className="text-xl font-bold text-primary">
                    {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
