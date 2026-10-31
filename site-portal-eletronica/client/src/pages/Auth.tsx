import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, User, CreditCard, MapPin, Hash } from 'lucide-react';
import { formatCPF, validateCPF } from '@/lib/utils';

interface AuthProps {
  onNavigate?: (page: string) => void;
}

export default function Auth({ onNavigate }: AuthProps) {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    cpf: '',
    endereco: '',
    email: '',
    password: '',
    confirmPassword: '',
    cartao: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    
    setRegisterData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error('Preencha todos os campos!');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        const redirectTo = sessionStorage.getItem('redirectAfterAuth');
        if (redirectTo) {
          sessionStorage.removeItem('redirectAfterAuth');
          onNavigate?.(redirectTo);
        } else {
          onNavigate?.('home');
        }
      }, 1000);
    } catch (error) {
      toast.error('Falha no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.name || !registerData.cpf || !registerData.endereco || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    // Validação matemática do CPF
    if (!validateCPF(registerData.cpf)) {
      toast.error('CPF com formato inválido ou inexistente.');
      return;
    }

    // Validação mockada de Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      toast.error('Email com formato inválido.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: registerData.name,
        cpf: registerData.cpf,
        endereco: registerData.endereco,
        email: registerData.email,
        password: registerData.password,
        role: 'Cliente',
      });
      toast.success('Conta criada com sucesso!');
      setTimeout(() => {
        const redirectTo = sessionStorage.getItem('redirectAfterAuth');
        if (redirectTo) {
          sessionStorage.removeItem('redirectAfterAuth');
          onNavigate?.(redirectTo);
        } else {
          onNavigate?.('home');
        }
      }, 1000);
    } catch (error) {
      toast.error('Falha ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          {/* Tabs Header */}
          <TabsList className="grid w-full grid-cols-2 rounded-b-none">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Bem-vindo de volta</h2>
              </div>

              <div>
                <Label htmlFor="login-email">Email</Label>
                <div className="relative mt-2">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative mt-2">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6"
                size="lg"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Nova Conta</h2>
              </div>

              <div>
                <Label htmlFor="register-name">Nome Completo *</Label>
                <div className="relative mt-2">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-name"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="João Silva"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-cpf">CPF *</Label>
                <div className="relative mt-2">
                  <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-cpf"
                    name="cpf"
                    value={registerData.cpf}
                    onChange={handleRegisterChange}
                    placeholder="000.000.000-00"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-endereco">Endereço *</Label>
                <div className="relative mt-2">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-endereco"
                    name="endereco"
                    value={registerData.endereco}
                    onChange={handleRegisterChange}
                    placeholder="Rua Exemplo, 123"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-email">Email *</Label>
                <div className="relative mt-2">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-password">Senha *</Label>
                <div className="relative mt-2">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-confirm">Confirmar Senha *</Label>
                <div className="relative mt-2">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-confirm"
                    name="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-cartao">Cartão de Crédito/Débito (Opcional)</Label>
                <div className="relative mt-2">
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-cartao"
                    name="cartao"
                    value={registerData.cartao}
                    onChange={handleRegisterChange}
                    placeholder="0000 0000 0000 0000"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6"
                size="lg"
              >
                {isLoading ? 'Criando Conta...' : 'Criar Conta'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
