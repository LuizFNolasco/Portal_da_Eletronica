import React, { useState } from 'react';
import { useStore, Order } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { formatCPF, validateCPF } from '@/lib/utils';

interface AdminProps {
  onNavigate?: (page: string) => void;
}

export default function Admin({ onNavigate }: AdminProps) {
  const { products, users, orders = [], addProduct, updateProduct, addUser, updateUser, updateOrder } = useStore();
  const { user } = useAuth();
  
  const isGerente = user?.role === 'Gerente';

  // ----- Funcionario Form -----
  const [editingFuncId, setEditingFuncId] = useState<string | null>(null);
  const [funcName, setFuncName] = useState('');
  const [funcCpf, setFuncCpf] = useState('');
  const [funcEmail, setFuncEmail] = useState('');
  const [funcSenha, setFuncSenha] = useState('');
  const [funcDataAdm, setFuncDataAdm] = useState('');
  const [buscaFunc, setBuscaFunc] = useState('');
  const [showFuncSenha, setShowFuncSenha] = useState(false);

  const handleAddFuncionario = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingFuncId) {
      if (!isGerente) {
        toast.error('Apenas o Gerente pode alterar dados de funcionários!');
        return;
      }
      if (!funcName || !funcDataAdm || !funcEmail) {
        toast.error('Nome, email e data de admissão são obrigatórios para edição!');
        return;
      }
      
      const updateData: any = {
        name: funcName,
        email: funcEmail,
        dataAdmissao: funcDataAdm,
      };
      
      if (funcSenha) {
        updateData.senha = funcSenha;
      }

      updateUser(editingFuncId, updateData);
      toast.success('Funcionário atualizado com sucesso!');
      setEditingFuncId(null);
      setFuncName(''); setFuncCpf(''); setFuncEmail(''); setFuncSenha(''); setFuncDataAdm('');
      return;
    }

    if (!funcName || !funcCpf || !funcEmail || !funcSenha || !funcDataAdm) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    if (!validateCPF(funcCpf)) {
      toast.error('CPF com formato inválido ou inexistente!');
      return;
    }

    if (users.some(u => u.cpf === funcCpf || u.email === funcEmail)) {
      toast.error('CPF ou Email já cadastrado!');
      return;
    }

    addUser({
      id: Math.random().toString(36).substr(2, 9),
      name: funcName,
      cpf: funcCpf,
      email: funcEmail,
      senha: funcSenha,
      dataAdmissao: funcDataAdm,
      role: 'Administrador'
    });

    toast.success('Funcionário cadastrado com sucesso!');
    setFuncName(''); setFuncCpf(''); setFuncEmail(''); setFuncSenha(''); setFuncDataAdm('');
  };

  const handleEditFunc = (f: any) => {
    if (!isGerente) {
      toast.error('Apenas Gerentes podem alterar dados de funcionários.');
      return;
    }
    setEditingFuncId(f.id);
    setFuncName(f.name);
    setFuncCpf(f.cpf || '');
    setFuncEmail(f.email || '');
    setFuncSenha(f.senha || '');
    setFuncDataAdm(f.dataAdmissao || '');
  };

  // ----- Produto Form -----
  const [prodId, setProdId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodTipo, setProdTipo] = useState<'Componente Eletrônico' | 'Material Didático'>('Componente Eletrônico');
  const [prodCat, setProdCat] = useState('Microcontroladores');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDataVig, setProdDataVig] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodStatus, setProdStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [prodImage, setProdImage] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const categoriasEletronicos = ['Microcontroladores', 'Sensores', 'Motores', 'SoC’s', 'Kits', 'Componentes'];
  const categoriasDidaticos = ['Material Didático']; 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodId || !prodName || !prodTipo || !prodCat || !prodDesc || !prodPrice || !prodDataVig || !prodStock || !prodStatus || !prodImage) {
      toast.error('Preencha todos os campos obrigatórios, incluindo a imagem!');
      return;
    }

    // Modal Confirmation mock
    if (!window.confirm('Confirma a gravação dos dados deste produto?')) {
      return;
    }

    const payload: any = {
      name: prodName,
      tipoProduto: prodTipo,
      category: prodCat,
      description: prodDesc,
      price: parseFloat(prodPrice),
      dataVigencia: prodDataVig,
      stock: parseInt(prodStock),
      status: prodStatus,
      image: prodImage,
      rating: 0,
      reviews: 0,
    };

    if (editingId) {
      if (prodId.toLowerCase() !== editingId.toLowerCase() && products.some(p => p.id.toLowerCase() === prodId.toLowerCase())) {
        toast.error('Código de produto já existe!');
        return;
      }
      payload.id = prodId;
      updateProduct(editingId, payload);
      toast.success('Produto atualizado!');
      setEditingId(null);
    } else {
      if (products.some(p => p.id.toLowerCase() === prodId.toLowerCase())) {
        toast.error('Código de produto já existe!');
        return;
      }
      payload.id = prodId;
      addProduct(payload);
      toast.success('Produto cadastrado!');
    }

    // Clear form
    setProdId(''); setProdName(''); setProdDesc(''); setProdPrice(''); setProdDataVig(''); setProdStock(''); setProdImage('');
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setProdId(p.id);
    setProdName(p.name);
    setProdTipo(p.tipoProduto || 'Componente Eletrônico');
    setProdCat(p.category);
    setProdDesc(p.description);
    setProdPrice(String(p.price));
    setProdDataVig(p.dataVigencia || '');
    setProdStock(String(p.stock));
    setProdStatus(p.status || 'Ativo');
    setProdImage(p.image || '');
  };

  const [buscaProd, setBuscaProd] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.id.toLowerCase().includes(buscaProd.toLowerCase()) || 
    p.name.toLowerCase().includes(buscaProd.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(buscaProd.toLowerCase())) ||
    (p.tipoProduto && p.tipoProduto.toLowerCase().includes(buscaProd.toLowerCase()))
  );

  // ----- Pedidos -----
  const [buscaPedidoId, setBuscaPedidoId] = useState('');
  const [buscaPedidoCpf, setBuscaPedidoCpf] = useState('');
  const [buscaPedidoNome, setBuscaPedidoNome] = useState('');
  const [buscaPedidoStatus, setBuscaPedidoStatus] = useState('');
  const [buscaPedidoDataInicio, setBuscaPedidoDataInicio] = useState('');
  const [buscaPedidoDataFim, setBuscaPedidoDataFim] = useState('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    let match = true;
    if (buscaPedidoId && !o.id.toLowerCase().includes(buscaPedidoId.toLowerCase())) match = false;
    if (buscaPedidoCpf && !o.customerCpf.includes(buscaPedidoCpf)) match = false;
    if (buscaPedidoNome && !o.customerName.toLowerCase().includes(buscaPedidoNome.toLowerCase())) match = false;
    if (buscaPedidoStatus && o.status !== buscaPedidoStatus) match = false;
    
    if (buscaPedidoDataInicio || buscaPedidoDataFim) {
      const orderDate = new Date(o.date).toISOString().split('T')[0];
      if (buscaPedidoDataInicio && orderDate < buscaPedidoDataInicio) match = false;
      if (buscaPedidoDataFim && orderDate > buscaPedidoDataFim) match = false;
    }
    return match;
  });

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    updateOrder(orderId, { status: newStatus, statusUpdatedAt: new Date().toISOString() });
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder({ ...viewingOrder, status: newStatus, statusUpdatedAt: new Date().toISOString() });
    }
    toast.success('Status do pedido atualizado!');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          {isGerente && <TabsTrigger value="funcionarios">Administradores</TabsTrigger>}
        </TabsList>

        <TabsContent value="produtos">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
            <form onSubmit={handleSaveProduto} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Código *</Label><Input value={prodId} onChange={e => setProdId(e.target.value)} /></div>
              <div><Label>Nome *</Label><Input value={prodName} onChange={e => setProdName(e.target.value)} /></div>
              
              <div>
                <Label>Tipo do produto *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={prodTipo} onChange={e => setProdTipo(e.target.value as any)}>
                  <option value="Componente Eletrônico">Componente Eletrônico</option>
                  <option value="Material Didático">Material Didático</option>
                </select>
              </div>

              <div>
                <Label>Categoria *</Label>
                {prodTipo === 'Componente Eletrônico' ? (
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={prodCat} onChange={e => setProdCat(e.target.value)}>
                    {categoriasEletronicos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={prodCat} onChange={e => setProdCat(e.target.value)}>
                    {categoriasDidaticos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              <div><Label>Preço *</Label><Input type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} /></div>
              <div><Label>Estoque *</Label><Input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} /></div>
              
              <div><Label>Início da vigência do preço *</Label><Input type="date" value={prodDataVig} onChange={e => setProdDataVig(e.target.value)} /></div>
              
              <div>
                <Label>Status *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={prodStatus} onChange={e => setProdStatus(e.target.value as any)}>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label>Arquivo da imagem do produto *</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="file:bg-primary file:text-primary-foreground file:hover:bg-primary/90 file:border-0 file:px-4 file:py-1 file:mr-4 file:rounded-md cursor-pointer" />
                  {prodImage && <img src={prodImage} alt="Preview" className="w-12 h-12 object-cover rounded border cursor-pointer" />}
                </div>
              </div>
              <div className="md:col-span-2"><Label>Descrição *</Label><Input value={prodDesc} onChange={e => setProdDesc(e.target.value)} /></div>
              
              <div className="md:col-span-2 flex justify-end gap-2">
                {editingId && <Button type="button" variant="outline" className="hover:!text-white" onClick={() => setEditingId(null)}>Cancelar</Button>}
                <Button type="submit" className="hover:!text-white">{editingId ? 'Salvar Alterações' : 'Cadastrar'}</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Consultar Produtos</h2>
            <div className="mb-4">
              <Input placeholder="Filtrar por código, nome, tipo ou categoria" value={buscaProd} onChange={e => setBuscaProd(e.target.value)} />
            </div>
            
            {filteredProducts.length === 0 ? (
              <p>Nenhum produto encontrado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b"><th className="text-left p-2">Código</th><th className="text-left p-2">Nome</th><th className="text-left p-2">Tipo do produto</th><th className="text-left p-2">Categoria</th><th className="text-left p-2">Preço</th><th className="text-left p-2">Estoque</th><th className="text-left p-2">Status</th><th className="p-2">Ação</th></tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="border-b">
                        <td className="p-2">{p.id}</td><td className="p-2">{p.name}</td><td className="p-2">{p.tipoProduto}</td><td className="p-2">{p.category || '-'}</td>
                        <td className="p-2">{parseFloat(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td className="p-2">{p.stock}</td><td className="p-2">{p.status}</td>
                        <td className="p-2 text-center">
                          <Button size="sm" variant="outline" className="hover:!text-white" onClick={() => handleEdit(p)}>Editar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="pedidos">
          {!viewingOrder ? (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Consultar Pedidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Número do Pedido</Label>
                  <Input value={buscaPedidoId} onChange={e => setBuscaPedidoId(e.target.value)} placeholder="Ex: PED-1234" />
                </div>
                <div>
                  <Label>CPF do Cliente</Label>
                  <Input value={buscaPedidoCpf} onChange={e => setBuscaPedidoCpf(formatCPF(e.target.value))} placeholder="000.000.000-00" />
                </div>
                <div>
                  <Label>Nome do Cliente</Label>
                  <Input value={buscaPedidoNome} onChange={e => setBuscaPedidoNome(e.target.value)} placeholder="Nome" />
                </div>
                <div>
                  <Label>Status</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={buscaPedidoStatus} onChange={e => setBuscaPedidoStatus(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                    <option value="Pagamento confirmado">Pagamento confirmado</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Em Transporte">Em transporte</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
                <div>
                  <Label>Data Inicial</Label>
                  <Input type="date" value={buscaPedidoDataInicio} onChange={e => setBuscaPedidoDataInicio(e.target.value)} />
                </div>
                <div>
                  <Label>Data Final</Label>
                  <Input type="date" value={buscaPedidoDataFim} onChange={e => setBuscaPedidoDataFim(e.target.value)} />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum pedido encontrado com os filtros informados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Nº do Pedido</th>
                        <th className="text-left p-2">Cliente</th>
                        <th className="text-left p-2">Data</th>
                        <th className="text-left p-2">Total</th>
                        <th className="text-left p-2">Status</th>
                        <th className="p-2">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="border-b">
                          <td className="p-2">{o.id}</td>
                          <td className="p-2">{o.customerName}</td>
                          <td className="p-2">{new Date(o.date).toLocaleDateString('pt-BR')}</td>
                          <td className="p-2">{o.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td className="p-2">{o.status}</td>
                          <td className="p-2 text-center">
                            <Button size="sm" variant="outline" className="hover:!text-white" onClick={() => setViewingOrder(o)}>Acessar detalhes</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Detalhes do Pedido {viewingOrder.id}</h2>
                <Button variant="outline" className="hover:!text-white" onClick={() => setViewingOrder(null)}>Voltar para lista</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Dados do Cliente</h3>
                  <p><strong>Nome:</strong> {viewingOrder.customerName}</p>
                  <p><strong>CPF:</strong> {formatCPF(viewingOrder.customerCpf)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Endereço de Entrega</h3>
                  <p>{viewingOrder.address.street}</p>
                  <p>{viewingOrder.address.neighborhood}</p>
                  <p>{viewingOrder.address.city} - {viewingOrder.address.state} - CEP: {viewingOrder.address.zip}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pagamento</h3>
                  <p><strong>Método:</strong> {viewingOrder.paymentMethod}</p>
                  <p><strong>Total:</strong> {viewingOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Status do pedido</h3>
                  <p><strong>Status Atual:</strong> {viewingOrder.status}</p>
                  {viewingOrder.statusUpdatedAt && (
                    <p className="text-xs text-muted-foreground mt-2">Última atualização: {new Date(viewingOrder.statusUpdatedAt).toLocaleString('pt-BR')}</p>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Itens Comprados</h3>
              <div className="space-y-4">
                {viewingOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border rounded">
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
                    {(viewingOrder.total - 10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">
                    {(10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t">
                  <span className="font-medium text-muted-foreground">Total do Pedido</span>
                  <span className="text-xl font-bold text-primary">
                    {viewingOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {isGerente && (
        <TabsContent value="funcionarios">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingFuncId ? 'Editar administrador' : 'Cadastrar administrador'}</h2>
            <form onSubmit={handleAddFuncionario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="flex items-center gap-1">Nome * {editingFuncId && !isGerente && <Lock className="w-3 h-3 text-muted-foreground" />}</Label><Input value={funcName} onChange={e => setFuncName(e.target.value)} disabled={editingFuncId ? !isGerente : false} /></div>
              <div><Label className="flex items-center gap-1">CPF * {!!editingFuncId && <Lock className="w-3 h-3 text-muted-foreground" />}</Label><Input value={funcCpf} onChange={e => setFuncCpf(formatCPF(e.target.value))} disabled={!!editingFuncId} /></div>
              <div><Label className="flex items-center gap-1">Email * {editingFuncId && !isGerente && <Lock className="w-3 h-3 text-muted-foreground" />}</Label><Input type="email" value={funcEmail} onChange={e => setFuncEmail(e.target.value)} disabled={editingFuncId ? !isGerente : false} /></div>
              <div>
                <Label className="flex items-center gap-1">Senha * {editingFuncId && !isGerente && <Lock className="w-3 h-3 text-muted-foreground" />}</Label>
                <div className="relative">
                  <Input type={showFuncSenha ? "text" : "password"} value={funcSenha} onChange={e => setFuncSenha(e.target.value)} disabled={editingFuncId ? !isGerente : false} className="pr-10" />
                  <button type="button" onClick={() => setShowFuncSenha(!showFuncSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showFuncSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div><Label className="flex items-center gap-1">Data de admissão * {editingFuncId && !isGerente && <Lock className="w-3 h-3 text-muted-foreground" />}</Label><Input type="date" value={funcDataAdm} onChange={e => setFuncDataAdm(e.target.value)} disabled={editingFuncId ? !isGerente : false} /></div>
              {!editingFuncId && (
                <div className="flex items-end">
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded">Perfil: <strong>Administrador</strong> (Gerado automaticamente)</p>
                </div>
              )}
              <div className="md:col-span-2 flex justify-end gap-2">
                {editingFuncId && <Button type="button" variant="outline" className="hover:!text-white" onClick={() => { setEditingFuncId(null); setFuncName(''); setFuncCpf(''); setFuncEmail(''); setFuncDataAdm(''); }}>Cancelar</Button>}
                <Button type="submit">{editingFuncId ? 'Salvar Alterações' : 'Cadastrar'}</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Administradores cadastrados</h2>
            <div className="mb-4">
              <Input placeholder="Consultar por Nome ou CPF" value={buscaFunc} onChange={e => setBuscaFunc(e.target.value)} />
            </div>
            <table className="w-full border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Nome</th><th className="text-left p-2">CPF</th><th className="text-left p-2">Role</th><th className="p-2">Ação</th></tr></thead>
              <tbody>
                {users
                  .filter(u => u.role === 'Administrador' || u.role === 'Gerente')
                  .filter(u => u.name.toLowerCase().includes(buscaFunc.toLowerCase()) || (u.cpf && u.cpf.includes(buscaFunc)))
                  .map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{formatCPF(u.cpf) || '-'}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 text-center">
                      <Button size="sm" variant="outline" className="hover:!text-white" onClick={() => handleEditFunc(u)} disabled={!isGerente}>Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
