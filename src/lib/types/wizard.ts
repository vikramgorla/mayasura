export interface WizardProduct {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency: string;
  category?: string;
}

export interface WizardData {
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
  websiteTemplate: string;
  // Step 3: Products
  products: WizardProduct[];
  // Step 4: Content & Tone
  brandVoice: string;
  toneKeywords: string[];
  // Step 5: Channels
  channels: string[];
}

export const INITIAL_WIZARD_DATA: WizardData = {
  name: "",
  tagline: "",
  industry: "",
  description: "",
  primaryColor: "#18181B",
  secondaryColor: "#FAFAFA",
  accentColor: "#5B21B6",
  fontHeading: "Plus Jakarta Sans",
  fontBody: "Inter",
  websiteTemplate: "minimal",
  products: [],
  brandVoice: "",
  toneKeywords: [],
  channels: ["website", "chatbot"],
};

export const WIZARD_STEPS = [
  { id: 1, label: "Basics", description: "Name & industry" },
  { id: 2, label: "Identity", description: "Colors & template" },
  { id: 3, label: "Products", description: "What you sell" },
  { id: 4, label: "Content", description: "Voice & tone" },
  { id: 5, label: "Channels", description: "Where to publish" },
  { id: 6, label: "Launch", description: "Review & go live" },
] as const;

export const INDUSTRIES = [
  "Restaurant & Food",
  "Fashion & Apparel",
  "Technology",
  "Health & Fitness",
  "Education & E-Learning",
  "Real Estate",
  "Beauty & Cosmetics",
  "Music & Entertainment",
  "Retail & E-Commerce",
  "Healthcare & Medical",
  "Photography & Art",
  "Consulting & Services",
  "Travel & Hospitality",
  "Finance & Fintech",
  "Sports & Recreation",
  "Home & Interior",
  "Automotive",
  "Non-Profit",
  "Media & Publishing",
  "Gaming",
] as const;

export const TONE_KEYWORDS = [
  "Professional",
  "Casual & Friendly",
  "Bold & Confident",
  "Warm & Caring",
  "Minimalist & Clean",
  "Playful & Fun",
  "Luxurious & Premium",
  "Technical & Expert",
] as const;

export const CHANNELS = [
  {
    id: "website",
    name: "Website",
    description: "Your brand's home on the web with customizable pages",
    icon: "globe",
  },
  {
    id: "chatbot",
    name: "AI Chatbot",
    description: "24/7 customer support powered by AI trained on your brand",
    icon: "message-circle",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "Online store with product catalog, cart, and checkout",
    icon: "shopping-bag",
  },
  {
    id: "email-marketing",
    name: "Email Marketing",
    description: "Newsletter signup and automated email campaigns",
    icon: "mail",
  },
  {
    id: "social-media",
    name: "Social Media",
    description: "Social media content generation and scheduling",
    icon: "share-2",
  },
  {
    id: "push-notifications",
    name: "Push Notifications",
    description: "Real-time updates and promotions to engaged customers",
    icon: "bell",
  },
  {
    id: "crm",
    name: "CRM",
    description: "Customer relationship management and lead tracking",
    icon: "users",
  },
] as const;

export const FONT_GROUPS = [
  {
    label: "Sans Serif",
    fonts: [
      "Inter",
      "Plus Jakarta Sans",
      "DM Sans",
      "Sora",
      "Outfit",
      "Raleway",
      "Nunito",
      "Space Grotesk",
      "Poppins",
      "Manrope",
      "Work Sans",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Source Sans 3",
      "Roboto",
      "Noto Sans",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "Playfair Display",
      "Source Serif 4",
      "Lora",
      "Cormorant Garamond",
      "Merriweather",
      "Crimson Text",
      "Libre Baskerville",
      "EB Garamond",
      "Bitter",
      "Noto Serif",
    ],
  },
  {
    label: "Display",
    fonts: [
      "Fraunces",
      "Bricolage Grotesque",
      "Cabinet Grotesk",
      "Clash Display",
    ],
  },
  {
    label: "Monospace",
    fonts: [
      "JetBrains Mono",
      "Fira Code",
      "IBM Plex Mono",
    ],
  },
] as const;

export const COLOR_PRESETS = [
  { name: "Minimal Slate", primary: "#18181B", secondary: "#FAFAFA", accent: "#18181B" },
  { name: "Deep Violet", primary: "#18181B", secondary: "#FAFAFA", accent: "#5B21B6" },
  { name: "Ocean Blue", primary: "#0F172A", secondary: "#F8FAFC", accent: "#2563EB" },
  { name: "Warm Terra", primary: "#2D1B0E", secondary: "#FDF8F3", accent: "#92400E" },
  { name: "Forest Green", primary: "#1A3A2A", secondary: "#F5FAF7", accent: "#059669" },
  { name: "Ruby Red", primary: "#1C1917", secondary: "#FFFBFA", accent: "#DC2626" },
  { name: "Golden Hour", primary: "#1A1A1A", secondary: "#FAF9F7", accent: "#B8860B" },
  { name: "Electric Indigo", primary: "#0F172A", secondary: "#FFFFFF", accent: "#6366F1" },
  { name: "Coral Reef", primary: "#1F1215", secondary: "#FFF5F5", accent: "#F43F5E" },
  { name: "Cyber Neon", primary: "#F0F0FF", secondary: "#0A0A1A", accent: "#A855F7" },
  { name: "Teal Calm", primary: "#1F2937", secondary: "#F0FDFA", accent: "#0D9488" },
  { name: "Sunset Orange", primary: "#1A1A2E", secondary: "#FFF8F0", accent: "#F97316" },
  { name: "Pine & Sage", primary: "#2C1810", secondary: "#FBF7F2", accent: "#B45309" },
  { name: "Royal Navy", primary: "#1F2937", secondary: "#F8F8F8", accent: "#1E40AF" },
  { name: "Charcoal & Cyan", primary: "#E4E4E7", secondary: "#09090B", accent: "#22D3EE" },
  { name: "Blush Pink", primary: "#1C1917", secondary: "#FFF1F2", accent: "#DB2777" },
] as const;
