import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import { useState } from "react";
import { StoreProvider } from "./contexts/StoreContext";
import { Product } from "./lib/mockData";

function Router() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setLocation(`/product/${product.id}`);
  };

  const handleNavigate = (page: string) => {
    setSelectedProduct(null);
    setSearchQuery("");
    setLocation(`/${page === 'home' ? '' : page}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLocation("/");
  };

  return (
    <Switch>
      <Route path="/">
        {() => (
          <>
            <Header
              onSearch={handleSearch}
              onNavigate={handleNavigate}
              onCartClick={() => setLocation("/cart")}
            />
            <Home onProductClick={handleProductClick} searchQuery={searchQuery} onSearch={handleSearch} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/product/:id">
        {() => (
          <>
            <Header
              onNavigate={handleNavigate}
              onCartClick={() => setLocation("/cart")}
            />
            <ProductDetail onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/cart">
        {() => (
          <>
            <Header
              onNavigate={handleNavigate}
              onCartClick={() => setLocation("/cart")}
            />
            <Cart onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/checkout">
        {() => (
          <>
            <Header onNavigate={handleNavigate} onCartClick={() => setLocation("/cart")} />
            <Checkout onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/orders">
        {() => (
          <>
            <Header onNavigate={handleNavigate} onCartClick={() => setLocation("/cart")} />
            <Orders onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/auth">
        {() => (
          <>
            <Header onNavigate={handleNavigate} onCartClick={() => setLocation("/cart")} />
            <Auth onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/admin">
        {() => (
          <>
            <Header onNavigate={handleNavigate} onCartClick={() => setLocation("/cart")} />
            <Admin onNavigate={handleNavigate} />
            <Footer />
          </>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <StoreProvider>
          <CartProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </AuthProvider>
          </CartProvider>
        </StoreProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
