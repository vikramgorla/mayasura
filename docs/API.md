# API Reference

> All API routes in Mayasura, grouped by resource

## Authentication

All authenticated endpoints require a `mayasura-session` cookie containing a valid JWT.

**Auth Guard Functions:**
- `requireAuth()` — Returns 401 if not logged in
- `requireBrandOwner(brandId)` — Returns 401/403/404 if not authorized

---

## Auth Routes

### POST `/api/auth/signup`
Create a new user account.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✅ | Valid email format |
| `password` | string | ✅ | 8+ chars, uppercase, lowercase, number |
| `name` | string | ✅ | Max 200 chars, HTML sanitized |

**Response (201):**
```json
{ "user": { "id": "...", "email": "...", "name": "..." } }
```

**Errors:** `400` (validation), `409` (email exists)

**Side effects:** Sets `mayasura-session` httpOnly cookie (JWT, 7-day expiry)

---

### POST `/api/auth/login`
Authenticate and receive a session.

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response (200):**
```json
{ "user": { "id": "...", "email": "...", "name": "..." } }
```

**Errors:** `401` (invalid credentials)

**Side effects:** Sets `mayasura-session` cookie

---

### POST `/api/auth/logout`
End the current session.

**Auth:** Required

**Response (200):**
```json
{ "success": true }
```

**Side effects:** Deletes cookie, increments `token_version` (revokes all tokens)

---

### GET `/api/auth/me`
Get current authenticated user.

**Auth:** Required

**Response (200):**
```json
{ "user": { "userId": "...", "email": "...", "name": "..." } }
```

**Errors:** `401` (not authenticated)

---

## Brand Routes

### GET `/api/brands`
List all brands for the authenticated user.

**Auth:** Required

**Response (200):**
```json
[
  {
    "id": "...", "name": "...", "slug": "...", "tagline": "...",
    "industry": "...", "primary_color": "#...", "status": "draft|launched",
    "website_template": "minimal", "created_at": "...", "updated_at": "..."
  }
]
```

---

### POST `/api/brands`
Create a new brand.

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `name` | string | ✅ | — |
| `tagline` | string | | null |
| `description` | string | | null |
| `industry` | string | | null |
| `primary_color` | string | | `#0f172a` |
| `secondary_color` | string | | `#f8fafc` |
| `accent_color` | string | | `#3b82f6` |
| `font_heading` | string | | `Inter` |
| `font_body` | string | | `Inter` |
| `brand_voice` | string | | null |
| `channels` | string (JSON) | | `[]` |
| `status` | string | | `draft` |
| `products` | Product[] | | `[]` |
| `website_template` | string | | `minimal` |

**Response (201):**
```json
{
  "id": "...", "name": "...", "slug": "...",
  "products": [{ "id": "...", "name": "..." }]
}
```

---

### GET `/api/brands/[id]`
Get a specific brand by ID.

**Auth:** Brand owner required

**Response (200):** Full brand object

---

### PUT `/api/brands/[id]`
Update brand fields.

**Auth:** Brand owner required

**Body:** Any subset of allowed brand fields (name, tagline, description, industry, logo_url, primary_color, secondary_color, accent_color, font_heading, font_body, brand_voice, channels, status, slug, website_template, custom_css)

**Response (200):** `{ "success": true }`

---

### DELETE `/api/brands/[id]`
Delete a brand and all related data (cascade).

**Auth:** Brand owner required

**Response (200):**
```json
{
  "success": true,
  "deleted": { "products": 3, "orders": 1, "blog_posts": 2, "brands": 1, ... }
}
```

---

## Product Routes

### GET `/api/brands/[id]/products`
List all products for a brand.

**Auth:** Brand owner required

**Response (200):** Array of product objects

---

### POST `/api/brands/[id]/products`
Create a new product.

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✅ |
| `description` | string | |
| `price` | number | |
| `currency` | string | `USD` |
| `image_url` | string | |
| `category` | string | |

**Response (201):** `{ "id": "...", "name": "..." }`

---

### PUT `/api/brands/[id]/products`
Update an existing product.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | ✅ |
| `name`, `description`, `price`, `currency`, `image_url`, `category`, `sort_order`, `status`, `stock_count` | various | |

**Response (200):** `{ "success": true }`

---

### DELETE `/api/brands/[id]/products`
Delete a product.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | ✅ |

**Response (200):** `{ "success": true }`

---

### PUT `/api/brands/[id]/reorder-products`
Reorder products.

**Body:**
```json
{ "updates": [{ "id": "...", "sort_order": 0 }, ...] }
```

**Response (200):** `{ "success": true }`

---

## Blog Routes

### GET `/api/brands/[id]/blog`
List blog posts for a brand.

**Auth:** Brand owner required

**Response (200):** Array of blog post objects

---

### POST `/api/brands/[id]/blog`
Create a blog post.

| Field | Type | Required |
|-------|------|----------|
| `title` | string | ✅ |
| `content` | string | |
| `excerpt` | string | |
| `category` | string | |
| `tags` | string (JSON) | `[]` |
| `status` | string | `draft` |

**Response (201):** `{ "id": "...", "slug": "..." }`

---

### GET `/api/brands/[id]/blog/[postId]`
Get a specific blog post.

**Auth:** Brand owner required

---

### PUT `/api/brands/[id]/blog/[postId]`
Update a blog post.

**Auth:** Brand owner required

---

### DELETE `/api/brands/[id]/blog/[postId]`
Delete a blog post.

**Auth:** Brand owner required

---

## Order Routes

### GET `/api/brands/[id]/orders`
List all orders for a brand.

**Auth:** Brand owner required

**Response (200):** Array of order objects

---

### PUT `/api/brands/[id]/orders`
Update order status.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | ✅ |
| `status` | string | ✅ |

**Response (200):** `{ "success": true }`

---

## Content Routes

### GET `/api/brands/[id]/content`
List all content pieces.

**Auth:** Brand owner required

---

### POST `/api/brands/[id]/content`
Create a content piece.

**Auth:** Brand owner required

---

### DELETE `/api/brands/[id]/content`
Delete a content piece.

**Auth:** Brand owner required

---

## Support Ticket Routes

### GET `/api/brands/[id]/tickets`
List tickets, optionally filtered by status.

**Auth:** Brand owner required

**Query params:** `?status=open|in-progress|resolved|closed`

---

### POST `/api/brands/[id]/tickets`
Create a support ticket.

| Field | Type | Required |
|-------|------|----------|
| `customer_name` | string | ✅ |
| `customer_email` | string | ✅ |
| `subject` | string | ✅ |
| `category` | string | |
| `priority` | string | `medium` |

---

### PUT `/api/brands/[id]/tickets`
Update ticket or add a message.

| Field | Type | Notes |
|-------|------|-------|
| `ticketId` | string | Required |
| `status` | string | Update status |
| `priority` | string | Update priority |
| `message` | object | `{ role, content }` to add message |

---

## Chatbot Routes

### POST `/api/brands/[id]/chatbot`
Send a message to the brand's AI chatbot (admin testing).

**Auth:** Brand owner required

---

### GET `/api/brands/[id]/chatbot-faqs`
List chatbot FAQs.

**Auth:** Brand owner required

---

### POST `/api/brands/[id]/chatbot-faqs`
Create a chatbot FAQ.

---

### PUT `/api/brands/[id]/chatbot-faqs`
Update a chatbot FAQ.

---

### DELETE `/api/brands/[id]/chatbot-faqs`
Delete a chatbot FAQ.

---

## Settings Routes

### GET `/api/brands/[id]/settings`
Get all brand settings (key-value pairs).

**Auth:** Brand owner required

---

### PUT `/api/brands/[id]/settings`
Update brand settings.

**Body:**
```json
{ "settings": { "key1": "value1", "key2": "value2" } }
```

---

## Analytics Routes

### GET `/api/brands/[id]/analytics`
Get analytics data for a brand.

**Auth:** Brand owner required

**Query params:** `?days=30`

**Response (200):**
```json
{
  "pageViews": { "total": 150, "byPage": [...], "byDay": [...] },
  "contactSubmissions": [...],
  "newsletterSubscribers": [...]
}
```

---

## Other Brand Routes

### GET `/api/brands/[id]/counts`
Get counts of all related items.

---

### GET `/api/brands/[id]/contacts`
List contact form submissions.

---

### PUT `/api/brands/[id]/contacts`
Update contact submission status.

---

### GET `/api/brands/[id]/export`
Export all brand data as JSON.

---

### POST `/api/brands/[id]/generate`
Generate AI content for the brand.

---

### POST `/api/brands/[id]/strategy`
Get AI strategy suggestions.

---

## AI Routes

### POST `/api/ai/suggest`
Get AI-powered suggestions.

| Field | Type | Values |
|-------|------|--------|
| `type` | string | `brand-names`, `taglines` |
| `industry` | string | For brand-names |
| `keywords` | string[] | For brand-names |
| `brandName` | string | For taglines |

**Response (200):**
```json
{ "suggestions": ["Name 1", "Name 2", ...] }
```

---

## Public Routes (No Auth)

These routes are accessible without authentication — they power the consumer-facing experience.

### GET `/api/public/brand/[slug]`
Get public brand data by slug.

---

### POST `/api/public/brand/[slug]/contact`
Submit a contact form.

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `message` | string | ✅ |

---

### POST `/api/public/brand/[slug]/chat`
Send a message to the brand chatbot.

| Field | Type | Required |
|-------|------|----------|
| `message` | string | ✅ |
| `history` | array | |
| `sessionId` | string | |

---

### POST `/api/public/brand/[slug]/newsletter`
Subscribe to newsletter.

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |

---

### POST `/api/public/brand/[slug]/orders`
Place an order.

| Field | Type | Required |
|-------|------|----------|
| `customer_email` | string | ✅ |
| `customer_name` | string | ✅ |
| `items` | array | ✅ |
| `shipping_address` | string | |

---

### POST `/api/public/brand/[slug]/track`
Track a page view.

| Field | Type | Required |
|-------|------|----------|
| `page` | string | ✅ |
| `referrer` | string | |

---

### GET `/api/public/brand/[slug]/widget`
Get embeddable chatbot widget configuration.

---

## Migration Routes

### POST `/api/migrate`
Run database migrations.

### GET `/api/migrate`
Get migration status.
