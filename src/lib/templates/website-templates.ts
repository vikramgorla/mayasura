export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  fonts: { heading: string; body: string; headingWeight: string };
  colors: {
    light: {
      text: string;
      background: string;
      accent: string;
      surface: string;
      muted: string;
      border: string;
    };
    dark: {
      text: string;
      background: string;
      accent: string;
      surface: string;
      muted: string;
      border: string;
    };
  };
  preview: {
    heroStyle:
      | "centered"
      | "left-aligned"
      | "split"
      | "full-width"
      | "stacked";
    cardStyle: "minimal" | "bordered" | "elevated" | "flat" | "rounded";
    navStyle: "minimal" | "centered" | "spread" | "classic" | "playful";
    typography: {
      headingWeight: string;
      headingTracking: string;
      headingCase: "normal" | "uppercase" | "capitalize";
      bodySize: string;
    };
    spacing: "compact" | "normal" | "generous" | "spacious";
    borderRadius: string;
    accentUsage: "minimal" | "moderate" | "bold";
  };
}

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Clean and understated. Lets your content breathe with generous whitespace and subtle typography.",
    bestFor: ["Personal brands", "Studios", "Agencies", "Portfolios"],
    fonts: {
      heading: "Plus Jakarta Sans",
      body: "Inter",
      headingWeight: "300",
    },
    colors: {
      light: {
        text: "#1A1A1A",
        background: "#FAFAFA",
        accent: "#18181B",
        surface: "#FFFFFF",
        muted: "#71717A",
        border: "#E4E4E7",
      },
      dark: {
        text: "#FAFAFA",
        background: "#09090B",
        accent: "#E4E4E7",
        surface: "#18181B",
        muted: "#71717A",
        border: "#27272A",
      },
    },
    preview: {
      heroStyle: "left-aligned",
      cardStyle: "minimal",
      navStyle: "minimal",
      typography: {
        headingWeight: "300",
        headingTracking: "-0.025em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "spacious",
      borderRadius: "0px",
      accentUsage: "minimal",
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description:
      "Serif elegance meets modern layout. Perfect for story-driven brands that value craftsmanship.",
    bestFor: ["Magazines", "Publishers", "Writers", "Luxury brands"],
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#1A1A1A",
        background: "#FAF9F6",
        accent: "#8B4513",
        surface: "#FFFFFF",
        muted: "#6B7280",
        border: "#E5E2DC",
      },
      dark: {
        text: "#F5F0E8",
        background: "#0F0E0C",
        accent: "#C4864C",
        surface: "#1A1917",
        muted: "#8C8C8C",
        border: "#2A2825",
      },
    },
    preview: {
      heroStyle: "split",
      cardStyle: "flat",
      navStyle: "centered",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.02em",
        headingCase: "normal",
        bodySize: "1.0625rem",
      },
      spacing: "generous",
      borderRadius: "0px",
      accentUsage: "moderate",
    },
  },
  {
    id: "bold",
    name: "Bold",
    description:
      "High-impact, unapologetic design. Makes a statement with heavy type and sharp edges.",
    bestFor: ["Streetwear", "Music", "Events", "Creative agencies"],
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#FAFAFA",
        background: "#09090B",
        accent: "#EF4444",
        surface: "#18181B",
        muted: "#A1A1AA",
        border: "#27272A",
      },
      dark: {
        text: "#FAFAFA",
        background: "#09090B",
        accent: "#EF4444",
        surface: "#18181B",
        muted: "#A1A1AA",
        border: "#27272A",
      },
    },
    preview: {
      heroStyle: "full-width",
      cardStyle: "bordered",
      navStyle: "spread",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.03em",
        headingCase: "uppercase",
        bodySize: "1rem",
      },
      spacing: "compact",
      borderRadius: "0px",
      accentUsage: "bold",
    },
  },
  {
    id: "classic",
    name: "Classic",
    description:
      "Timeless and trustworthy. Neumorphic depth with balanced proportions for established brands.",
    bestFor: ["Professional services", "Law firms", "Finance", "Consulting"],
    fonts: {
      heading: "Source Serif 4",
      body: "Inter",
      headingWeight: "600",
    },
    colors: {
      light: {
        text: "#1F2937",
        background: "#F8F8F8",
        accent: "#1E40AF",
        surface: "#FFFFFF",
        muted: "#6B7280",
        border: "#D1D5DB",
      },
      dark: {
        text: "#F3F4F6",
        background: "#0F1117",
        accent: "#60A5FA",
        surface: "#1A1D29",
        muted: "#9CA3AF",
        border: "#374151",
      },
    },
    preview: {
      heroStyle: "centered",
      cardStyle: "elevated",
      navStyle: "classic",
      typography: {
        headingWeight: "600",
        headingTracking: "-0.02em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "normal",
      borderRadius: "8px",
      accentUsage: "moderate",
    },
  },
  {
    id: "playful",
    name: "Playful",
    description:
      "Bouncy, colorful, and fun. Spring animations and rounded shapes that spark joy.",
    bestFor: ["Kids brands", "Toys", "Games", "Creative projects"],
    fonts: {
      heading: "DM Sans",
      body: "Inter",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#1A1A2E",
        background: "#FFF8F0",
        accent: "#F97316",
        surface: "#FFFFFF",
        muted: "#9CA3AF",
        border: "#FED7AA",
      },
      dark: {
        text: "#FFF8F0",
        background: "#1A1A2E",
        accent: "#FB923C",
        surface: "#242445",
        muted: "#9CA3AF",
        border: "#3B3B5E",
      },
    },
    preview: {
      heroStyle: "stacked",
      cardStyle: "rounded",
      navStyle: "playful",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.015em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "generous",
      borderRadius: "9999px",
      accentUsage: "bold",
    },
  },
  {
    id: "startup",
    name: "Startup",
    description:
      "Modern SaaS aesthetic with gradient accents and social proof elements. Built to convert.",
    bestFor: ["SaaS", "Tech startups", "Apps", "Digital products"],
    fonts: {
      heading: "Sora",
      body: "Inter",
      headingWeight: "600",
    },
    colors: {
      light: {
        text: "#0F172A",
        background: "#FFFFFF",
        accent: "#6366F1",
        surface: "#F8FAFC",
        muted: "#64748B",
        border: "#E2E8F0",
      },
      dark: {
        text: "#F8FAFC",
        background: "#0B0F1A",
        accent: "#818CF8",
        surface: "#1E293B",
        muted: "#94A3B8",
        border: "#334155",
      },
    },
    preview: {
      heroStyle: "centered",
      cardStyle: "elevated",
      navStyle: "spread",
      typography: {
        headingWeight: "600",
        headingTracking: "-0.025em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "generous",
      borderRadius: "12px",
      accentUsage: "moderate",
    },
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description:
      "Full-bleed imagery with restrained typography. Your work is the hero.",
    bestFor: [
      "Photographers",
      "Designers",
      "Artists",
      "Architects",
    ],
    fonts: {
      heading: "Outfit",
      body: "Inter",
      headingWeight: "400",
    },
    colors: {
      light: {
        text: "#1A1A1A",
        background: "#FFFFFF",
        accent: "#2563EB",
        surface: "#F5F5F5",
        muted: "#737373",
        border: "#E5E5E5",
      },
      dark: {
        text: "#F5F5F5",
        background: "#0A0A0A",
        accent: "#60A5FA",
        surface: "#171717",
        muted: "#737373",
        border: "#262626",
      },
    },
    preview: {
      heroStyle: "full-width",
      cardStyle: "minimal",
      navStyle: "minimal",
      typography: {
        headingWeight: "400",
        headingTracking: "-0.025em",
        headingCase: "normal",
        bodySize: "0.9375rem",
      },
      spacing: "spacious",
      borderRadius: "0px",
      accentUsage: "minimal",
    },
  },
  {
    id: "magazine",
    name: "Magazine",
    description:
      "Multi-column layouts with editorial typography. Built for content-rich brands.",
    bestFor: ["Media", "News", "Content creators", "Bloggers"],
    fonts: {
      heading: "Lora",
      body: "Source Serif 4",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#1A1A1A",
        background: "#FEFCF8",
        accent: "#B91C1C",
        surface: "#FFFFFF",
        muted: "#78716C",
        border: "#E7E5E4",
      },
      dark: {
        text: "#FAF5EF",
        background: "#0E0D0B",
        accent: "#EF4444",
        surface: "#1C1A17",
        muted: "#A8A29E",
        border: "#292524",
      },
    },
    preview: {
      heroStyle: "split",
      cardStyle: "flat",
      navStyle: "classic",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.02em",
        headingCase: "normal",
        bodySize: "1.0625rem",
      },
      spacing: "normal",
      borderRadius: "0px",
      accentUsage: "moderate",
    },
  },
  {
    id: "boutique",
    name: "Boutique",
    description:
      "Refined luxury with delicate typography and generous spacing. Whispers rather than shouts.",
    bestFor: ["Fashion", "Jewelry", "Luxury goods", "Premium brands"],
    fonts: {
      heading: "Cormorant Garamond",
      body: "Inter",
      headingWeight: "500",
    },
    colors: {
      light: {
        text: "#1A1A1A",
        background: "#FAF9F7",
        accent: "#B8860B",
        surface: "#FFFFFF",
        muted: "#8C8C8C",
        border: "#E8E6E1",
      },
      dark: {
        text: "#F5F0E8",
        background: "#0F0F0F",
        accent: "#D4A84B",
        surface: "#1A1917",
        muted: "#8C8C8C",
        border: "#2A2825",
      },
    },
    preview: {
      heroStyle: "centered",
      cardStyle: "minimal",
      navStyle: "centered",
      typography: {
        headingWeight: "500",
        headingTracking: "0.08em",
        headingCase: "uppercase",
        bodySize: "0.9375rem",
      },
      spacing: "spacious",
      borderRadius: "0px",
      accentUsage: "minimal",
    },
  },
  {
    id: "tech",
    name: "Tech",
    description:
      "Developer-friendly with monospace accents, dark theme, and terminal aesthetics.",
    bestFor: ["Developer tools", "APIs", "Tech companies", "Open source"],
    fonts: {
      heading: "JetBrains Mono",
      body: "Inter",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#E4E4E7",
        background: "#09090B",
        accent: "#22D3EE",
        surface: "#18181B",
        muted: "#71717A",
        border: "#27272A",
      },
      dark: {
        text: "#E4E4E7",
        background: "#09090B",
        accent: "#22D3EE",
        surface: "#18181B",
        muted: "#71717A",
        border: "#27272A",
      },
    },
    preview: {
      heroStyle: "split",
      cardStyle: "bordered",
      navStyle: "minimal",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.02em",
        headingCase: "normal",
        bodySize: "0.9375rem",
      },
      spacing: "compact",
      borderRadius: "8px",
      accentUsage: "moderate",
    },
  },
  {
    id: "wellness",
    name: "Wellness",
    description:
      "Calming and organic with soft curves and nature-inspired tones. Breathe deeply.",
    bestFor: ["Yoga", "Meditation", "Health", "Spas"],
    fonts: {
      heading: "Raleway",
      body: "Nunito",
      headingWeight: "300",
    },
    colors: {
      light: {
        text: "#1A3A2A",
        background: "#F5FAF7",
        accent: "#059669",
        surface: "#FFFFFF",
        muted: "#6B8F7B",
        border: "#D1E7DD",
      },
      dark: {
        text: "#D1FAE5",
        background: "#0A1612",
        accent: "#34D399",
        surface: "#132A20",
        muted: "#6B8F7B",
        border: "#1E3A2C",
      },
    },
    preview: {
      heroStyle: "centered",
      cardStyle: "rounded",
      navStyle: "centered",
      typography: {
        headingWeight: "300",
        headingTracking: "0.02em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "spacious",
      borderRadius: "16px",
      accentUsage: "moderate",
    },
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description:
      "Warm and inviting with rich typography. Designed for menus, reservations, and ambiance.",
    bestFor: ["Restaurants", "Cafés", "Bakeries", "Food brands"],
    fonts: {
      heading: "Playfair Display",
      body: "Lato",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#2D1B0E",
        background: "#FDF8F3",
        accent: "#92400E",
        surface: "#FFFFFF",
        muted: "#8B7355",
        border: "#E8DFD4",
      },
      dark: {
        text: "#F5E6D3",
        background: "#100C08",
        accent: "#D4915A",
        surface: "#1E1812",
        muted: "#8B7355",
        border: "#2E251D",
      },
    },
    preview: {
      heroStyle: "centered",
      cardStyle: "elevated",
      navStyle: "classic",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.015em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "generous",
      borderRadius: "4px",
      accentUsage: "moderate",
    },
  },
  {
    id: "neon",
    name: "Neon",
    description:
      "Cyberpunk-inspired with glowing accents and dark backgrounds. Electric and futuristic.",
    bestFor: ["Nightlife", "Gaming", "Music producers", "Tech art"],
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
      headingWeight: "800",
    },
    colors: {
      light: {
        text: "#F0F0FF",
        background: "#0A0A1A",
        accent: "#A855F7",
        surface: "#12122A",
        muted: "#7C7C9A",
        border: "#1E1E3A",
      },
      dark: {
        text: "#F0F0FF",
        background: "#0A0A1A",
        accent: "#A855F7",
        surface: "#12122A",
        muted: "#7C7C9A",
        border: "#1E1E3A",
      },
    },
    preview: {
      heroStyle: "full-width",
      cardStyle: "bordered",
      navStyle: "spread",
      typography: {
        headingWeight: "800",
        headingTracking: "-0.03em",
        headingCase: "normal",
        bodySize: "0.9375rem",
      },
      spacing: "normal",
      borderRadius: "8px",
      accentUsage: "bold",
    },
  },
  {
    id: "organic",
    name: "Organic",
    description:
      "Earth-toned and natural with rounded shapes and warm textures. Sustainable by design.",
    bestFor: [
      "Organic food",
      "Eco brands",
      "Natural products",
      "Sustainability",
    ],
    fonts: {
      heading: "Nunito",
      body: "Nunito",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#2C1810",
        background: "#FBF7F2",
        accent: "#B45309",
        surface: "#FFFFFF",
        muted: "#8B7355",
        border: "#E6DDD3",
      },
      dark: {
        text: "#F5E6D3",
        background: "#0E0A06",
        accent: "#D97706",
        surface: "#1A1408",
        muted: "#8B7355",
        border: "#2E251D",
      },
    },
    preview: {
      heroStyle: "stacked",
      cardStyle: "rounded",
      navStyle: "centered",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.01em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "generous",
      borderRadius: "9999px",
      accentUsage: "moderate",
    },
  },
  {
    id: "artisan",
    name: "Artisan",
    description:
      "Handcrafted feel with stamp-like details and textured surfaces. For makers and creators.",
    bestFor: ["Craftspeople", "Handmade goods", "Pottery", "Small batch"],
    fonts: {
      heading: "Playfair Display",
      body: "Source Sans 3",
      headingWeight: "700",
    },
    colors: {
      light: {
        text: "#1C1917",
        background: "#FAF5EF",
        accent: "#78350F",
        surface: "#FFFFFF",
        muted: "#78716C",
        border: "#D6D3D1",
      },
      dark: {
        text: "#F5F0E8",
        background: "#0C0A07",
        accent: "#B45309",
        surface: "#1C1A16",
        muted: "#A8A29E",
        border: "#292524",
      },
    },
    preview: {
      heroStyle: "split",
      cardStyle: "bordered",
      navStyle: "classic",
      typography: {
        headingWeight: "700",
        headingTracking: "-0.02em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "generous",
      borderRadius: "8px",
      accentUsage: "moderate",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    description:
      "Professional and structured. Clean grids, business-focused components, and enterprise-grade polish.",
    bestFor: ["Enterprise", "B2B", "Corporate sites", "Professional services"],
    fonts: {
      heading: "Inter",
      body: "Inter",
      headingWeight: "600",
    },
    colors: {
      light: {
        text: "#111827",
        background: "#FFFFFF",
        accent: "#1D4ED8",
        surface: "#F9FAFB",
        muted: "#6B7280",
        border: "#E5E7EB",
      },
      dark: {
        text: "#F9FAFB",
        background: "#0B0F1A",
        accent: "#3B82F6",
        surface: "#111827",
        muted: "#9CA3AF",
        border: "#1F2937",
      },
    },
    preview: {
      heroStyle: "split",
      cardStyle: "elevated",
      navStyle: "spread",
      typography: {
        headingWeight: "600",
        headingTracking: "-0.025em",
        headingCase: "normal",
        bodySize: "1rem",
      },
      spacing: "normal",
      borderRadius: "8px",
      accentUsage: "moderate",
    },
  },
];

export const TEMPLATE_MAP = new Map(
  WEBSITE_TEMPLATES.map((t) => [t.id, t])
);

export function getTemplate(id: string): WebsiteTemplate | undefined {
  return TEMPLATE_MAP.get(id);
}
