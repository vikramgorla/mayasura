export interface Product {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
}

export interface BrandData {
  // Step 1: Basics
  name: string;
  tagline: string;
  industry: string;
  description: string;
  
  // Step 2: Identity
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoUrl?: string;
  
  // Step 3: Products
  products: Product[];
  
  // Step 4: Content & Tone
  brandVoice: string;
  toneKeywords: string[];
  
  // Step 5: Channels
  channels: string[];
  
  // Step 6: Review
  status: 'draft' | 'launched';
}

export interface Brand {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  brand_voice: string | null;
  channels: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const AVAILABLE_CHANNELS = [
  { id: 'website', name: 'Website', description: 'Landing page, product pages, about & contact', icon: 'Globe' },
  { id: 'chatbot', name: 'AI Chatbot', description: 'AI-powered customer support', icon: 'MessageSquare' },
  { id: 'ecommerce', name: 'E-Commerce', description: 'Online storefront with product catalog', icon: 'ShoppingBag' },
  { id: 'email', name: 'Email Marketing', description: 'Templates, welcome series, newsletters', icon: 'Mail' },
  { id: 'social', name: 'Social Media', description: 'Content suggestions for all platforms', icon: 'Share2' },
  { id: 'push', name: 'Push Notifications', description: 'Web push notifications setup', icon: 'Bell' },
  { id: 'crm', name: 'CRM Dashboard', description: 'Customer relationship management', icon: 'Users' },
] as const;

export const TONE_OPTIONS = [
  'Professional',
  'Casual & Friendly',
  'Bold & Confident',
  'Warm & Caring',
  'Minimalist & Clean',
  'Playful & Fun',
  'Luxurious & Premium',
  'Technical & Expert',
] as const;

export const FONT_OPTIONS = [
  'Inter',
  'Plus Jakarta Sans',
  'DM Sans',
  'Outfit',
  'Space Grotesk',
  'Manrope',
  'Sora',
  'Geist',
] as const;
