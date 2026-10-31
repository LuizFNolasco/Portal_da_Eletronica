import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

interface CheckoutProps {
  onNavigate?: (page: string) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const { selectedItems: items, totalPrice, clearSelectedItems } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [formData, setFormData] = useState({
    street: '',
    neighborhood: '',
    state: '',
    city: '',
    zip: '',
    paymentMethod: '',
    installments: '1',
    mockNum: '',
    mockName: '',
    mockExp: '',
    mockCvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateProduct, addOrder, users } = useStore();

  const SHIPPING_COST = 10.00;
  const subtotal = totalPrice;
  const total = subtotal + (items.length > 0 ? SHIPPING_COST : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'mockNum') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'mockExp') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`;
      }
    } else if (name === 'mockCvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.street || !formData.neighborhood || !formData.state || !formData.city || !formData.zip) {
      toast.error('Preencha todos os campos de endereço de entrega');
      return false;
    }
    if (!formData.paymentMethod) {
      toast.error('Por favor, selecione um método de pagamento');
      return false;
    }
    if (formData.paymentMethod.includes('Cartão')) {
      if (!formData.mockNum || !formData.mockName || !formData.mockExp || !formData.mockCvv) {
        toast.error('Preencha todos os dados do cartão');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Você precisa fazer login ou criar uma conta para finalizar a compra.');
      onNavigate?.('auth');
      return;
    }

    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Decrease stock
      items.forEach(item => {
        updateProduct(item.product.id, {
          stock: Math.max(0, item.product.stock - item.quantity)
        });
      });

      // Create Order
      const extendedUser = users.find(u => u.id === user?.id);
      const newOrder = {
        id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user?.id || 'unknown',
        customerName: extendedUser?.name || user?.name || 'Cliente',
        customerCpf: extendedUser?.cpf || user?.cpf || '000.000.000-00',
        address: {
          street: formData.street,
          neighborhood: formData.neighborhood,
          state: formData.state,
          city: formData.city,
          zip: formData.zip,
        },
        paymentMethod: formData.paymentMethod === 'Cartão de Crédito' 
          ? `Cartão de Crédito (${formData.installments}x)`
          : formData.paymentMethod,
        items: [...items],
        total: total,
        date: new Date().toISOString(),
        status: 'Pagamento confirmado',
        statusUpdatedAt: new Date().toISOString()
      };
      addOrder(newOrder);

      toast.success('Pedido Realizado com sucesso!');
      clearSelectedItems();
      setTimeout(() => {
        onNavigate?.('orders');
      }, 1500);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-8">Adicione itens ao seu carrinho antes de finalizar a compra</p>
          <Button onClick={() => onNavigate?.('home')}>Continuar Comprando</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container">
        <button
          onClick={() => onNavigate?.('cart')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Voltar ao Carrinho
        </button>

        <h1 className="text-4xl font-bold text-foreground mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Endereço de Entrega</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Ex: Rua das Flores, 123"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      placeholder="Ex: Centro"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Ex: SP"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ex: São Paulo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="zip">CEP</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Details */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Método de Pagamento</h2>

              <div className="space-y-4">
                <div>
                  <Label>Selecione a forma de pagamento *</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange(e as any)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Cartão de Crédito">Cartão de crédito</option>
                    <option value="Cartão de Débito">Cartão de débito</option>
                    <option value="Pix">Pix</option>
                  </select>
                </div>

                {formData.paymentMethod === 'Cartão de Crédito' && (
                  <div>
                    <Label>Parcelamento</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                      name="installments"
                      value={formData.installments}
                      onChange={(e) => handleInputChange(e as any)}
                    >
                      {Array.from({ length: Math.max(1, Math.min(3, Math.floor(total / 60))) }).map((_, i) => {
                        const installmentNumber = i + 1;
                        const installmentValue = total / installmentNumber;
                        return (
                          <option key={installmentNumber} value={installmentNumber}>
                            {installmentNumber}x de {installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {(formData.paymentMethod === 'Cartão de Crédito' || formData.paymentMethod === 'Cartão de Débito') && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="mockNum">Número do Cartão</Label>
                      <Input
                        id="mockNum"
                        name="mockNum"
                        type="text"
                        value={formData.mockNum}
                        onChange={handleInputChange}
                        placeholder="0000 0000 0000 0000"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="mockName">Nome no Cartão</Label>
                      <Input
                        id="mockName"
                        name="mockName"
                        type="text"
                        value={formData.mockName}
                        onChange={handleInputChange}
                        placeholder="Nome impresso no cartão"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mockExp">Validade</Label>
                        <Input
                          id="mockExp"
                          name="mockExp"
                          type="text"
                          value={formData.mockExp}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mockCvv">CVV</Label>
                        <Input
                          id="mockCvv"
                          name="mockCvv"
                          type="text"
                          value={formData.mockCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </form>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
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
                  <span className="text-2xl font-bold text-primary">
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
