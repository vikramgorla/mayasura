'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image_url?: string;
}

interface ShopContextType {
  brand: Brand;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image_url: string | null;
    category: string | null;
    stock_count?: number;
  }>;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | null>(null);
export function useShop() {
  return useContext(ShopContext);
}

function getCartKey(slug: string) {
  return `mayasura_cart_${slug}`;
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<ShopContextType['products']>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getCartKey(slug));
      if (stored) setCart(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, [slug]);

  // Save cart to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(getCartKey(slug), JSON.stringify(cart));
    }
  }, [cart, slug, loaded]);

  // Fetch brand data
  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((d) => {
        setBrand(d.brand);
        setProducts(d.products || []);
      })
      .catch(() => setError(true));
  }, [slug]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Shop not found</h1>
          <Link href="/" className="text-blue-400 hover:underline">← Back to Mayasura</Link>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-pulse h-8 w-32 rounded bg-zinc-200" />
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <ShopContext.Provider value={{ brand, products, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: brand.secondary_color || '#f8fafc',
          color: brand.primary_color || '#0f172a',
          fontFamily: brand.font_body || 'Inter',
        }}
      >
        {/* Shop nav */}
        <nav
          className="sticky top-0 z-50 backdrop-blur-xl border-b"
          style={{
            backgroundColor: `${brand.primary_color}f0`,
            borderColor: `${brand.accent_color}30`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link
                href={`/site/${slug}`}
                className="text-lg font-bold"
                style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
              >
                {brand.name}
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href={`/shop/${slug}`}
                  className="text-sm font-medium"
                  style={{ color: `${brand.secondary_color}cc` }}
                >
                  Shop
                </Link>
                <Link
                  href={`/site/${slug}`}
                  className="text-sm font-medium hidden sm:inline"
                  style={{ color: `${brand.secondary_color}80` }}
                >
                  Website
                </Link>
                <Link
                  href={`/shop/${slug}/cart`}
                  className="relative flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: brand.secondary_color }}
                >
                  🛒
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-2 -right-4 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer
          className="border-t py-8"
          style={{ borderColor: `${brand.primary_color}10` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm opacity-40">
              © {new Date().getFullYear()} {brand.name} · Powered by{' '}
              <Link href="/" className="hover:opacity-80" style={{ color: brand.accent_color }}>
                Mayasura
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </ShopContext.Provider>
  );
}
