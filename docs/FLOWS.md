# User Flows

> Text-based flow diagrams for every major user journey in Mayasura

---

## 1. Signup → Login → Dashboard

```
┌──────────────┐
│  Landing Page │
│   /           │
└──────┬───────┘
       │ Click "Get Started" or "Sign Up"
       ▼
┌──────────────┐
│  Signup Page  │
│  /signup      │
│               │
│  • Name       │
│  • Email      │
│  • Password   │
│  (8+ chars,   │
│   A-Z, a-z,   │
│   0-9)        │
└──────┬───────┘
       │ POST /api/auth/signup
       │ • Validate email format
       │ • Validate password strength
       │ • Check email uniqueness
       │ • Hash password (bcrypt, 12 rounds)
       │ • Create user with nanoid
       │ • Issue JWT (7-day, HS256)
       │ • Set httpOnly cookie
       ▼
┌──────────────┐        ┌──────────────┐
│  Dashboard   │◄───────│  Login Page  │
│  /dashboard  │        │  /login      │
│              │        │              │
│  Brand List  │        │  • Email     │
│  or Create   │        │  • Password  │
│  New Brand   │        │              │
└──────────────┘        └──────────────┘
                              │
                        POST /api/auth/login
                        • Lookup user by email
                        • Verify bcrypt hash
                        • Issue JWT with tokenVersion
                        • Set session cookie
```

### Logout Flow

```
Dashboard → Click "Logout"
  │
  POST /api/auth/logout
  │ • Increment token_version (revokes all tokens)
  │ • Delete session cookie
  ▼
Redirect to /login
```

---

## 2. Brand Creation Wizard (6 Steps)

```
/create
  │
  ▼
┌─────────────────────────────────────────────────────┐
│ Step 1: BASICS                                       │
│                                                       │
│  ┌─────────────┐  ┌──────────────────┐               │
│  │ Industry    │  │ Brand Name       │               │
│  │ (required)  │  │ (required)       │               │
│  └─────────────┘  │ [AI Suggest] ✨  │               │
│                    └──────────────────┘               │
│  ┌──────────────────┐  ┌────────────────────────┐    │
│  │ Tagline          │  │ Description            │    │
│  │ [AI Suggest] ✨  │  │ (textarea)             │    │
│  └──────────────────┘  └────────────────────────┘    │
│                                          [Continue →] │
└──────────────────────────┬──────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│ Step 2: IDENTITY                                     │
│                                                       │
│  Template Selection (5 options):                      │
│  ┌─────────┐ ┌──────────┐ ┌──────┐ ┌───────┐ ┌────┐│
│  │ Minimal │ │ Editorial│ │ Bold │ │Classic│ │Play││
│  └─────────┘ └──────────┘ └──────┘ └───────┘ └────┘│
│                                                       │
│  Color System:                                        │
│  ┌─────────┐ ┌───────────┐ ┌────────┐               │
│  │ Primary │ │ Secondary │ │ Accent │               │
│  │ #...    │ │ #...      │ │ #...   │               │
│  └─────────┘ └───────────┘ └────────┘               │
│  [Preset Palettes: 16+ options]                      │
│                                                       │
│  Font Selection:                                      │
│  ┌──────────────────┐ ┌─────────────────┐            │
│  │ Heading Font     │ │ Body Font       │            │
│  │ (34+ options)    │ │ (34+ options)   │            │
│  └──────────────────┘ └─────────────────┘            │
│                                    [← Back] [Next →] │
└──────────────────────────┬──────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│ Step 3: PRODUCTS                                     │
│                                                       │
│  Product List:                                        │
│  ┌──────────────────────────────────┐                │
│  │ Product 1: Name, Desc, Price    │ [🗑️]          │
│  │ Product 2: Name, Desc, Price    │ [🗑️]          │
│  │ [+ Add Product]                 │                 │
│  └──────────────────────────────────┘                │
│  [AI Generate Description] ✨                        │
│                                    [← Back] [Next →] │
└──────────────────────────┬──────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│ Step 4: CONTENT & TONE                               │
│                                                       │
│  Brand Voice:                                         │
│  ┌──────────────────────────────────────┐            │
│  │ (textarea) Describe your brand voice │            │
│  └──────────────────────────────────────┘            │
│                                                       │
│  Tone Keywords (select multiple):                     │
│  [Professional] [Casual] [Bold] [Warm]               │
│  [Minimalist] [Playful] [Luxurious] [Technical]     │
│                                    [← Back] [Next →] │
└──────────────────────────┬──────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│ Step 5: CHANNELS                                     │
│                                                       │
│  Select channels to activate:                         │
│  ☑ Website       ☑ AI Chatbot    ☑ E-Commerce       │
│  ☐ Email         ☑ Social Media  ☐ Push Notifs      │
│  ☐ CRM                                              │
│                                    [← Back] [Next →] │
└──────────────────────────┬──────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│ Step 6: REVIEW                                       │
│                                                       │
│  Summary of all settings:                             │
│  • Brand details                                      │
│  • Template & colors preview                          │
│  • Products list                                      │
│  • Voice & channels                                   │
│                                                       │
│                [← Back] [🚀 Create Brand]            │
└──────────────────────────┬──────────────────────────┘
                           │
                   POST /api/brands
                   • Create brand record
                   • Create product records
                   • Generate slug
                   • Create activity log
                           │
                           ▼
                   /dashboard/[brandId]
```

---

## 3. Design Studio Customization

```
/dashboard/[brandId]/design
  │
  ▼
┌─────────────────────────────────────────────────────┐
│ DESIGN STUDIO                                        │
│                                                       │
│  ┌─ Sidebar ──────────────┐  ┌─ Preview ──────────┐ │
│  │                         │  │                     │ │
│  │  Template Tab:          │  │  Live Preview       │ │
│  │  [Minimal] [Editorial]  │  │  of consumer site   │ │
│  │  [Bold] [Classic]       │  │  with current       │ │
│  │  [Playful]              │  │  settings applied   │ │
│  │                         │  │                     │ │
│  │  Colors Tab:            │  │  ┌───────────────┐  │ │
│  │  Primary: [#___]        │  │  │   Hero        │  │ │
│  │  Secondary: [#___]      │  │  │   Section     │  │ │
│  │  Accent: [#___]         │  │  ├───────────────┤  │ │
│  │  [Palette Presets]      │  │  │   Features    │  │ │
│  │                         │  │  ├───────────────┤  │ │
│  │  Fonts Tab:             │  │  │   Products    │  │ │
│  │  Heading: [Dropdown]    │  │  ├───────────────┤  │ │
│  │  Body: [Dropdown]       │  │  │   CTA         │  │ │
│  │                         │  │  └───────────────┘  │ │
│  │  Style Tab:             │  │                     │ │
│  │  Button: [pill/rounded] │  │  [Desktop] [Mobile] │ │
│  │  Spacing: [compact/gen] │  │                     │ │
│  │  Radius: [0-24px]       │  │                     │ │
│  │                         │  │                     │ │
│  │  Layout Tab:            │  │                     │ │
│  │  [Drag-drop sections]   │  │                     │ │
│  │  [Toggle visibility]    │  │                     │ │
│  │                         │  │                     │ │
│  └─────────────────────────┘  └─────────────────────┘ │
│                                                       │
│  [💾 Save Changes]                                    │
│  │                                                    │
│  PUT /api/brands/[id]                                │
│  PUT /api/brands/[id]/settings                       │
│  → Toast: "Design saved successfully" ✅             │
└─────────────────────────────────────────────────────┘
```

---

## 4. Settings Management

```
/dashboard/[brandId]/settings
  │
  ▼
┌─────────────────────────────────────────────────────┐
│ SETTINGS                                             │
│                                                       │
│  Brand Details:                                       │
│  ┌──────────────────────────────┐                    │
│  │ Name: [_______]              │                    │
│  │ Tagline: [_______]          │                    │
│  │ Description: [________]      │                    │
│  │ Industry: [_______]          │                    │
│  │ Slug: [_______]              │                    │
│  └──────────────────────────────┘                    │
│  [Save] → PUT /api/brands/[id]                       │
│                                                       │
│  Integrations:                                        │
│  ┌──────────────────────────────┐                    │
│  │ Stripe Key: [_______]       │                    │
│  │ Analytics ID: [_______]     │                    │
│  └──────────────────────────────┘                    │
│  [Save] → PUT /api/brands/[id]/settings              │
│                                                       │
│  Danger Zone:                                         │
│  ┌──────────────────────────────┐                    │
│  │ [🗑️ Delete Brand]           │                    │
│  │                              │                    │
│  │ Confirmation Dialog:         │                    │
│  │ "This will delete:           │                    │
│  │  • X products                │                    │
│  │  • X blog posts              │                    │
│  │  • X orders                  │                    │
│  │  Type brand name to confirm" │                    │
│  └──────────────────────────────┘                    │
│  DELETE /api/brands/[id]                             │
│  → Cascade delete all related data                    │
│  → Redirect to /dashboard                            │
└─────────────────────────────────────────────────────┘
```

---

## 5. Consumer Site Rendering Pipeline

```
Visitor requests /site/[slug]
  │
  ▼
┌─────────────────────────────────────┐
│ Server-side (Next.js App Router)     │
│                                       │
│ 1. Extract slug from URL params      │
│ 2. getBrandBySlug(slug) → brand      │
│    └─ 404 if not found               │
│ 3. getWebsiteTemplate(brand.template)│
│    → template config (colors, fonts, │
│       spacing, typography, etc.)      │
│ 4. getBrandSetting(brandId,          │
│    'page_layout') → sections         │
│ 5. getProductsByBrand(brandId)       │
│ 6. getBlogPosts(brandId, published)  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Client-side Rendering                │
│                                       │
│ 1. Inject CSS custom properties:     │
│    --brand-primary, --brand-accent,  │
│    --brand-font-heading, etc.        │
│ 2. Load Google Fonts dynamically     │
│    buildGoogleFontsUrl([heading,     │
│    body], templateId)                │
│ 3. Render navigation:               │
│    Home | About | Products | Contact │
│ 4. Render sections in order:         │
│    section-renderer.tsx maps         │
│    section.type → component          │
│ 5. Track page view:                  │
│    POST /api/public/brand/[slug]/    │
│    track                             │
└─────────────────────────────────────┘
```

---

## 6. Shop Purchase Flow

```
Consumer visits /shop/[slug]
  │
  ▼
┌──────────────┐
│  Shop Home   │ ← Products listed in grid
│  Browse      │
└──────┬───────┘
       │ Click product
       ▼
┌──────────────┐
│  Product     │ ← Product detail with description,
│  Detail Page │   price, add-to-cart button
│  /shop/[slug]│
│  /product/   │
│  [productId] │
└──────┬───────┘
       │ Add to Cart (client-side state)
       ▼
┌──────────────┐
│  Cart Page   │ ← Item list with quantities,
│  /shop/[slug]│   totals, remove buttons
│  /cart       │
└──────┬───────┘
       │ Proceed to Checkout
       ▼
┌──────────────┐
│  Checkout    │
│  /shop/[slug]│
│  /checkout   │
│              │
│  • Name      │
│  • Email     │
│  • Shipping  │
│    Address   │
│              │
│  [Place      │
│   Order]     │
└──────┬───────┘
       │ POST /api/public/brand/[slug]/orders
       │ • Validate items & calculate total
       │ • Create order record
       │ • Create order items
       │ • Create activity log
       ▼
┌──────────────┐
│  Order       │
│  Confirmation│
│  /shop/[slug]│
│  /order/     │
│  [orderId]   │
│              │
│  "Thank you! │
│  Order #..."  │
└──────────────┘
```

---

## 7. Blog Creation → Publishing → Consumer Viewing

```
ADMIN FLOW:
/dashboard/[brandId]/blog
  │
  ├── [+ New Post]
  │     │
  │     ▼
  │   ┌──────────────────────┐
  │   │ Blog Editor          │
  │   │                      │
  │   │ Title: [_________]   │
  │   │ Slug: (auto-gen)     │
  │   │ Content: [________]  │
  │   │ Excerpt: [________]  │
  │   │ Category: [________] │
  │   │ Tags: [________]     │
  │   │                      │
  │   │ [Save Draft]         │
  │   │ [Publish] ✨         │
  │   │ [AI Generate] ✨     │
  │   └──────────┬───────────┘
  │              │
  │   POST /api/brands/[id]/blog
  │   • Create blog post record
  │   • Set status: draft or published
  │   • Set published_at timestamp
  │
  ├── Blog Post List
  │   │ ┌─────────────────────┐
  │   │ │ Post 1 [Draft]     │ [Edit] [Delete]
  │   │ │ Post 2 [Published] │ [Edit] [Delete]
  │   │ └─────────────────────┘
  │   │
  │   PUT /api/brands/[id]/blog/[postId]
  │   DELETE /api/brands/[id]/blog/[postId]

CONSUMER FLOW:
/blog/[slug]
  │
  ├── Blog Listing Page
  │   │ Shows published posts, most recent first
  │   │ Title, excerpt, category, date
  │   ▼
  │
  └── /blog/[slug]/[postSlug]
      │ Full post content
      │ Related posts
      │ Brand-styled layout
```

---

## 8. Support Ticket Flow

```
CONSUMER (via contact form or chat):
  │
  POST /api/public/brand/[slug]/contact
  │ Creates contact_submission
  │
  ▼
ADMIN: /dashboard/[brandId]/support
  │
  ├── Ticket List
  │   ┌──────────────────────────────────┐
  │   │ Ticket #1 [open]    [high] 🔴  │
  │   │ Ticket #2 [in-prog] [med]  🟡  │
  │   │ Ticket #3 [resolved][low]  🟢  │
  │   └──────────────────────────────────┘
  │
  ├── Create Ticket
  │   POST /api/brands/[id]/tickets
  │   • customer_name, email, subject
  │   • category, priority
  │
  ├── View Ticket
  │   │ GET /api/brands/[id]/tickets
  │   │
  │   │ Message Thread:
  │   │ ┌─ Customer: "My order hasn't arrived"
  │   │ ├─ AI: "I'll check on that for you..."
  │   │ ├─ Agent: "Order #123 shipped yesterday"
  │   │ └─ Customer: "Thank you!"
  │   │
  │   │ POST ticket message (role: agent/ai)
  │   │ PUT ticket status
  │
  └── Ticket Stats
      GET /api/brands/[id]/tickets (stats)
      • Total tickets
      • Open count
      • Resolved count
      • Average satisfaction
```

---

## 9. AI-Assisted Operations

```
┌─────────────────────────────────────────────────────┐
│ AI Integration Points (via Anthropic Claude)         │
│                                                       │
│  ┌─ Brand Creation ─────────────────────────────┐   │
│  │ POST /api/ai/suggest                          │   │
│  │ • type: "brand-names" → 6 name suggestions   │   │
│  │ • type: "taglines" → 5 tagline suggestions   │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ Content Generation ─────────────────────────┐   │
│  │ POST /api/brands/[id]/generate                │   │
│  │ • type: "blog" → blog post draft             │   │
│  │ • type: "social" → 5 social media posts      │   │
│  │ • type: "email" → welcome email template     │   │
│  │ • type: "about" → about page content         │   │
│  │ • type: "landing" → landing page copy        │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ Product Descriptions ───────────────────────┐   │
│  │ generateProductDescription()                   │   │
│  │ • Brand-voice-aware product copy generation   │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ Chatbot ────────────────────────────────────┐   │
│  │ POST /api/public/brand/[slug]/chat            │   │
│  │ • Brand-aware conversational AI               │   │
│  │ • Product knowledge                           │   │
│  │ • FAQ-trained responses                       │   │
│  │ • Conversation history maintained             │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ Brand Voice Analysis ───────────────────────┐   │
│  │ analyzeBrandVoice(description)                 │   │
│  │ • Returns: tone, personality traits,          │   │
│  │   sample greeting                             │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ Strategy Advisor ───────────────────────────┐   │
│  │ /dashboard/[brandId]/strategy                  │   │
│  │ • AI-powered business strategy suggestions    │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```
