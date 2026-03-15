'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { getWebsiteTemplate, type WebsiteTemplate } from '@/lib/website-templates';
import { buildGoogleFontsUrl } from '@/lib/font-loader';
import {
  resolveDesignSettings,
  designSettingsToCSSVars,
  type ResolvedDesignSettings,
} from '@/lib/design-settings';

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
  websiteTemplate?: WebsiteTemplate;
  settings?: Record<string, string>;
  designSettings: ResolvedDesignSettings;
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
  const [websiteTemplate, setWebsiteTemplate] = useState<WebsiteTemplate | undefined>();
  const [settings, setSettings] = useState<Record<string, string> | undefined>();
  const [designSettings, setDesignSettings] = useState<ResolvedDesignSettings | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getCartKey(slug));
      if (stored) setCart(JSON.parse(stored));
    } catch { /* empty */ }
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
        const templateId = d.settings?.website_template || 'minimal';
        setWebsiteTemplate(getWebsiteTemplate(templateId));
        setSettings(d.settings);
        const ds = resolveDesignSettings(d.settings, d.brand.primary_color || '#0f172a');
        setDesignSettings(ds);
      })
      .catch(() => setError(true));
  }, [slug]);

  // Load Google Fonts
  useEffect(() => {
    if (!brand) return;
    const tId = websiteTemplate?.id || 'minimal';
    const fonts = [brand.font_heading, brand.font_body].filter(Boolean) as string[];
    if (fonts.length === 0) return;
    const url = buildGoogleFontsUrl(fonts);
    const existing = document.querySelector(`link[href="${url}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [brand, websiteTemplate]);

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
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">Shop not found</h1>
          <Link href="/" className="text-sm font-medium underline underline-offset-4 hover:opacity-70">
            ← Back to Mayasura
          </Link>
        </div>
      </div>
    );
  }

  if (!brand || !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded bg-zinc-100" />
          <div className="h-3 w-24 rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const templateId = websiteTemplate?.id || 'minimal';
  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const cssVars = designSettingsToCSSVars(
    designSettings,
    brand.primary_color || '#0f172a',
    brand.secondary_color || '#fafafa',
    brand.accent_color || '#3b82f6',
  );

  // Nav link style per template
  const linkClass = (() => {
    if (templateId === 'bold') return 'text-[11px] font-bold uppercase tracking-[0.12em]';
    if (templateId === 'editorial') return 'text-[13px] font-medium';
    if (templateId === 'playful') return 'text-[13px] font-semibold';
    return 'text-[13px] font-medium';
  })();

  return (
    <ShopContext.Provider value={{ brand, products, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, websiteTemplate, settings, designSettings }}>
      <div
        className="min-h-screen flex flex-col"
        data-template={templateId}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: brand.font_body || 'Inter',
          '--accent': accentColor,
          ...cssVars as React.CSSProperties,
        } as React.CSSProperties}
      >
        {/* Shop nav */}
        <nav
          className="sticky top-0 z-50 border-b transition-all duration-300"
          style={{
            backgroundColor: `${bgColor}f0`,
            borderColor: `${textColor}08`,
            backdropFilter: 'blur(16px) saturate(180%)',
          }}
        >
          <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
            <div className={`flex items-center justify-between ${templateId === 'bold' ? 'h-14' : 'h-16'}`}>
              <Link
                href={`/site/${slug}`}
                className="transition-opacity hover:opacity-70"
                style={{
                  color: textColor,
                  fontFamily: brand.font_heading,
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  fontSize: templateId === 'bold' ? '0.8125rem' : '1.125rem',
                  letterSpacing: templateId === 'bold' ? '0.1em' : '-0.01em',
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                }}
              >
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="h-7" />
                ) : (
                  brand.name
                )}
              </Link>
              <div className="flex items-center gap-6">
                <Link href={`/shop/${slug}`} className={`${linkClass} transition-colors`} style={{ color: textColor }}>
                  {templateId === 'bold' ? 'SHOP' : 'Shop'}
                </Link>
                <Link href={`/site/${slug}`} className={`${linkClass} transition-colors hidden sm:inline`} style={{ color: `${textColor}55` }}>
                  {templateId === 'bold' ? 'WEBSITE' : 'Website'}
                </Link>
                <Link
                  href={`/shop/${slug}/cart`}
                  className="relative flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: textColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-2 -right-3 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: accentColor, color: '#fff' }}
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
          style={{
            borderColor: `${textColor}06`,
            borderTopWidth: templateId === 'bold' ? '2px' : '1px',
          }}
        >
          <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8 text-center`}>
            <p className="text-xs" style={{ color: `${textColor}30` }}>
              © {new Date().getFullYear()} {brand.name} · Powered by{' '}
              <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: accentColor }}>
                Mayasura
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </ShopContext.Provider>
  );
}
