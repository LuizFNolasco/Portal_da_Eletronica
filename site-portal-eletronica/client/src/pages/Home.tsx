import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/mockData';
import { useStore } from '@/contexts/StoreContext';
import { ChevronRight, Zap, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HomeProps {
  onProductClick?: (product: Product) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

type Category = 'all' | 'Componente Eletrônico' | 'Material Didático';

export default function Home({ onProductClick, searchQuery = '', onSearch }: HomeProps) {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.status === 'Ativo'); // Only active products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.tipoProduto === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const featuredProducts = products.filter((p) => p.featured && p.status === 'Ativo');

  const categories: { value: Category | string; label: string }[] = [
    { value: 'all', label: 'Todos os produtos' },
    { value: 'Componente Eletrônico', label: 'Componentes Eletrônicos' },
    { value: 'Material Didático', label: 'Material Didático' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/30">
                <Zap size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Novidades Disponíveis</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Componentes Eletrônicos e Materiais Didáticos
              </h1>

              <p className="text-lg text-muted-foreground">
                Explore nossa coleção cuidadosamente selecionada de componentes eletrônicos, placas de desenvolvimento e materiais didáticos. A inovação ao seu alcance.
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-video md:aspect-auto md:h-full min-h-[250px] md:min-h-[400px]">
              <img
                src="img-hero.jpg"
                alt="Hero"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Products Grid */}
      <section className="py-12 md:py-16 flex-1">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {selectedCategory === 'all' ? 'Todos os produtos' : categories.find((c) => c.value === selectedCategory)?.label}
            </h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="mt-4 max-w-2xl">
              <form onSubmit={(e) => { e.preventDefault(); onSearch?.(searchQuery); }} className="flex w-full gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="w-full pr-10"
                  />
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <select 
                  className="flex h-10 w-48 shrink-0 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </form>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Nenhum produto encontrado.
              </p>
              <Button onClick={() => { setSelectedCategory('all'); onSearch?.(''); }}>
                Ver Todos os produtos
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
