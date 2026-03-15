export interface StarterTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  websiteTemplate: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  brandVoice: string;
  toneKeywords: string[];
  channels: string[];
  products: Array<{
    name: string;
    description: string;
    price: number;
    currency: string;
    category: string;
  }>;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    industry: "Food & Dining",
    description: "Complete restaurant setup with menu, reservations, and online ordering.",
    websiteTemplate: "restaurant",
    primaryColor: "#2D1B0E",
    secondaryColor: "#FDF8F3",
    accentColor: "#92400E",
    fontHeading: "Playfair Display",
    fontBody: "Lato",
    brandVoice: "Warm, inviting, and passionate about great food. We speak with the confidence of a chef who knows their craft.",
    toneKeywords: ["Warm & Caring", "Professional"],
    channels: ["website", "chatbot", "ecommerce"],
    products: [
      { name: "Signature Tasting Menu", description: "A curated 5-course experience showcasing our chef's seasonal creations", price: 85, currency: "USD", category: "Dining" },
      { name: "Weekend Brunch", description: "Start your weekend right with our signature brunch dishes and bottomless mimosas", price: 45, currency: "USD", category: "Dining" },
      { name: "Gift Card", description: "The perfect gift — a culinary experience to remember", price: 100, currency: "USD", category: "Gifts" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    industry: "Fashion & Apparel",
    description: "Boutique fashion brand with curated collections and lookbooks.",
    websiteTemplate: "boutique",
    primaryColor: "#1A1A1A",
    secondaryColor: "#FAF9F7",
    accentColor: "#B8860B",
    fontHeading: "Cormorant Garamond",
    fontBody: "Inter",
    brandVoice: "Refined and aspirational. We curate, not just sell. Every piece tells a story of craftsmanship and intention.",
    toneKeywords: ["Luxurious & Premium", "Minimalist & Clean"],
    channels: ["website", "chatbot", "ecommerce", "social-media", "email-marketing"],
    products: [
      { name: "Essentials Collection", description: "Timeless wardrobe staples crafted from premium materials", price: 189, currency: "USD", category: "Collections" },
      { name: "Silk Scarf", description: "Hand-printed Italian silk scarf in our signature pattern", price: 95, currency: "USD", category: "Accessories" },
      { name: "Leather Tote", description: "Full-grain leather tote, handcrafted by artisans", price: 285, currency: "USD", category: "Accessories" },
    ],
  },
  {
    id: "tech",
    name: "Tech Startup",
    industry: "Technology",
    description: "SaaS product or developer tool with modern aesthetics.",
    websiteTemplate: "startup",
    primaryColor: "#0F172A",
    secondaryColor: "#F8FAFC",
    accentColor: "#6366F1",
    fontHeading: "Sora",
    fontBody: "Inter",
    brandVoice: "Clear, concise, and technically credible. We explain complex things simply without dumbing them down.",
    toneKeywords: ["Technical & Expert", "Professional"],
    channels: ["website", "chatbot", "email-marketing", "crm"],
    products: [
      { name: "Starter Plan", description: "Everything you need to get started. Includes core features and community support.", price: 29, currency: "USD", category: "Plans" },
      { name: "Pro Plan", description: "Advanced features, priority support, and unlimited integrations for growing teams.", price: 99, currency: "USD", category: "Plans" },
      { name: "Enterprise", description: "Custom deployment, dedicated support, SLA guarantees, and advanced security.", price: 499, currency: "USD", category: "Plans" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    industry: "Health & Fitness",
    description: "Gym, personal training, or fitness app brand.",
    websiteTemplate: "bold",
    primaryColor: "#FAFAFA",
    secondaryColor: "#09090B",
    accentColor: "#EF4444",
    fontHeading: "Space Grotesk",
    fontBody: "Inter",
    brandVoice: "Motivating and energetic. We push you to be your best without being preachy. Results speak louder.",
    toneKeywords: ["Bold & Confident", "Casual & Friendly"],
    channels: ["website", "chatbot", "ecommerce", "push-notifications"],
    products: [
      { name: "Monthly Membership", description: "Unlimited access to all classes, equipment, and locker rooms", price: 59, currency: "USD", category: "Memberships" },
      { name: "Personal Training (10 sessions)", description: "One-on-one sessions with a certified personal trainer", price: 450, currency: "USD", category: "Training" },
      { name: "Nutrition Plan", description: "Custom meal plans and weekly check-ins with our nutritionist", price: 149, currency: "USD", category: "Nutrition" },
    ],
  },
  {
    id: "education",
    name: "Education",
    industry: "Education & E-Learning",
    description: "Online courses, tutoring, or educational platform.",
    websiteTemplate: "classic",
    primaryColor: "#1F2937",
    secondaryColor: "#F8F8F8",
    accentColor: "#1E40AF",
    fontHeading: "Source Serif 4",
    fontBody: "Inter",
    brandVoice: "Knowledgeable yet approachable. We make learning feel like an adventure, not a chore.",
    toneKeywords: ["Professional", "Warm & Caring"],
    channels: ["website", "chatbot", "email-marketing", "crm"],
    products: [
      { name: "Fundamentals Course", description: "Master the basics with our comprehensive 8-week program", price: 199, currency: "USD", category: "Courses" },
      { name: "Advanced Masterclass", description: "Deep-dive into advanced topics with industry experts", price: 399, currency: "USD", category: "Courses" },
      { name: "1-on-1 Tutoring (Monthly)", description: "Weekly personalized sessions tailored to your learning goals", price: 249, currency: "USD", category: "Tutoring" },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate",
    industry: "Real Estate",
    description: "Property listings, agent profiles, and virtual tours.",
    websiteTemplate: "corporate",
    primaryColor: "#111827",
    secondaryColor: "#FFFFFF",
    accentColor: "#1D4ED8",
    fontHeading: "Inter",
    fontBody: "Inter",
    brandVoice: "Trustworthy and knowledgeable. We guide you home with expertise and a personal touch.",
    toneKeywords: ["Professional", "Warm & Caring"],
    channels: ["website", "chatbot", "crm", "email-marketing"],
    products: [
      { name: "Home Valuation Report", description: "Comprehensive market analysis and property valuation", price: 0, currency: "USD", category: "Services" },
      { name: "Buyer Consultation", description: "Personalized buying strategy session with our top agents", price: 0, currency: "USD", category: "Services" },
      { name: "Premium Listing Package", description: "Professional photography, virtual tour, and featured placement", price: 499, currency: "USD", category: "Services" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Skincare",
    industry: "Beauty & Cosmetics",
    description: "Skincare, cosmetics, or beauty salon brand.",
    websiteTemplate: "wellness",
    primaryColor: "#1A3A2A",
    secondaryColor: "#F5FAF7",
    accentColor: "#059669",
    fontHeading: "Raleway",
    fontBody: "Nunito",
    brandVoice: "Gentle, empowering, and science-backed. Beautiful skin starts with understanding your skin.",
    toneKeywords: ["Warm & Caring", "Luxurious & Premium"],
    channels: ["website", "chatbot", "ecommerce", "social-media"],
    products: [
      { name: "Daily Glow Serum", description: "Vitamin C and hyaluronic acid serum for radiant, hydrated skin", price: 65, currency: "USD", category: "Skincare" },
      { name: "Renewal Night Cream", description: "Retinol-infused night cream that repairs while you sleep", price: 78, currency: "USD", category: "Skincare" },
      { name: "Complete Skincare Kit", description: "Everything you need for a complete morning and evening routine", price: 185, currency: "USD", category: "Kits" },
    ],
  },
  {
    id: "music",
    name: "Music",
    industry: "Music & Entertainment",
    description: "Artist, label, or music venue brand.",
    websiteTemplate: "neon",
    primaryColor: "#F0F0FF",
    secondaryColor: "#0A0A1A",
    accentColor: "#A855F7",
    fontHeading: "Space Grotesk",
    fontBody: "Inter",
    brandVoice: "Raw, authentic, and unapologetically creative. Music isn't just what we make — it's who we are.",
    toneKeywords: ["Bold & Confident", "Playful & Fun"],
    channels: ["website", "chatbot", "ecommerce", "social-media", "push-notifications"],
    products: [
      { name: "Latest Album (Digital)", description: "12 tracks of pure sonic exploration — download in lossless quality", price: 12, currency: "USD", category: "Music" },
      { name: "Vinyl LP", description: "Limited edition 180g vinyl with exclusive artwork and liner notes", price: 35, currency: "USD", category: "Merch" },
      { name: "Concert Ticket", description: "General admission to our upcoming live show", price: 45, currency: "USD", category: "Events" },
    ],
  },
  {
    id: "retail",
    name: "Retail Store",
    industry: "Retail & E-Commerce",
    description: "General retail or specialty shop with diverse inventory.",
    websiteTemplate: "playful",
    primaryColor: "#1A1A2E",
    secondaryColor: "#FFF8F0",
    accentColor: "#F97316",
    fontHeading: "DM Sans",
    fontBody: "Inter",
    brandVoice: "Friendly, helpful, and enthusiastic about finding you the perfect item. Shopping should be fun!",
    toneKeywords: ["Casual & Friendly", "Playful & Fun"],
    channels: ["website", "chatbot", "ecommerce", "email-marketing", "push-notifications"],
    products: [
      { name: "Best Seller Bundle", description: "Our top-rated products curated into one amazing package", price: 79, currency: "USD", category: "Bundles" },
      { name: "Mystery Box", description: "A surprise selection of hand-picked favorites — always worth more than the price!", price: 49, currency: "USD", category: "Specials" },
      { name: "Gift Set", description: "Beautifully wrapped and ready to give — perfect for any occasion", price: 65, currency: "USD", category: "Gifts" },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    industry: "Healthcare & Medical",
    description: "Medical practice, clinic, or healthcare service.",
    websiteTemplate: "classic",
    primaryColor: "#1F2937",
    secondaryColor: "#F0FDF4",
    accentColor: "#0D9488",
    fontHeading: "Source Serif 4",
    fontBody: "Inter",
    brandVoice: "Compassionate, trustworthy, and evidence-based. Your health is our mission, and we treat every patient like family.",
    toneKeywords: ["Professional", "Warm & Caring"],
    channels: ["website", "chatbot", "crm", "email-marketing"],
    products: [
      { name: "General Consultation", description: "Comprehensive health assessment with our experienced physicians", price: 150, currency: "USD", category: "Consultations" },
      { name: "Wellness Check-up", description: "Annual preventive health screening including blood work and vitals", price: 350, currency: "USD", category: "Check-ups" },
      { name: "Telehealth Visit", description: "Convenient virtual consultation from the comfort of your home", price: 75, currency: "USD", category: "Virtual Care" },
    ],
  },
];

export const STARTER_MAP = new Map(
  STARTER_TEMPLATES.map((t) => [t.id, t])
);
