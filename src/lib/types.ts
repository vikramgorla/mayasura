export interface Product {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  sort_order?: number;
}

export interface BrandData {
  // Step 1: Basics
  name: string;
  tagline: string;
  industry: string;
  description: string;
  templateId?: string;
  
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
  slug: string | null;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  brand_voice: string | null;
  channels: string;
  status: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  brand_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  category: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  satisfaction_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  role: 'customer' | 'agent' | 'ai';
  content: string;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  brand_id: string;
  type: string;
  description: string;
  metadata: string;
  created_at: string;
}

// V3 types
export interface Order {
  id: string;
  brand_id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string | null;
  items: string;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripe_session_id: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  brand_id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  category: string | null;
  tags: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
}

export interface BrandPage {
  id: string;
  brand_id: string;
  slug: string;
  title: string;
  content: string | null;
  is_published: number;
  sort_order: number;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  brand_id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export interface ChatbotFaq {
  id: string;
  brand_id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface ConsumerUser {
  id: string;
  brand_id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

// API Response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
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

export const INDUSTRY_CATEGORIES = [
  { id: 'restaurant', name: 'Restaurant/Food & Beverage', emoji: '🍕' },
  { id: 'fashion', name: 'Fashion/Clothing', emoji: '👗' },
  { id: 'tech', name: 'Tech/SaaS', emoji: '💻' },
  { id: 'fitness', name: 'Fitness/Wellness', emoji: '🏋️' },
  { id: 'education', name: 'Education/Courses', emoji: '📚' },
  { id: 'realestate', name: 'Real Estate', emoji: '🏠' },
  { id: 'beauty', name: 'Beauty/Salon', emoji: '✂️' },
  { id: 'music', name: 'Music/Entertainment', emoji: '🎵' },
  { id: 'retail', name: 'General Retail', emoji: '🛒' },
  { id: 'healthcare', name: 'Healthcare', emoji: '🏥' },
] as const;
