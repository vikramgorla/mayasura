# 🔒 Mayasura Security Audit Report

**Date:** 2026-03-14  
**Target:** https://mayasura-web-production.up.railway.app  
**Auditor:** Automated Security Audit  
**Status:** ⚠️ Multiple Critical and High findings

---

## Executive Summary

The Mayasura web application has **critical authorization gaps** that allow unauthenticated users to perform virtually all CRUD operations on brands, products, content, and other resources. While the authentication *mechanism* (signup, login, JWT, cookies) is reasonably well-implemented, the **authorization layer is almost entirely missing** from API routes. Only 1 of 16 brand API route files checks authentication.

| Severity | Count |
|----------|-------|
| 🔴 Critical | 4 |
| 🟠 High | 5 |
| 🟡 Medium | 5 |
| 🟢 Low | 3 |
| **Total** | **17** |

---

## 🔴 Critical Findings

### C1: No Authentication Required on Brand Sub-Resource API Routes

**Severity:** 🔴 Critical  
**Affected:** ALL `/api/brands/[id]/*` routes (15 of 16 route files)

**Description:**  
None of the following API routes check authentication:
- `/api/brands/[id]` — GET, PUT, DELETE a brand
- `/api/brands/[id]/products` — CRUD products
- `/api/brands/[id]/content` — CRUD content
- `/api/brands/[id]/orders` — view/manage orders
- `/api/brands/[id]/contacts` — view contact submissions
- `/api/brands/[id]/settings` — view/modify brand settings
- `/api/brands/[id]/analytics` — view analytics
- `/api/brands/[id]/blog` — CRUD blog posts
- `/api/brands/[id]/chatbot` — chatbot interactions
- `/api/brands/[id]/chatbot-faqs` — CRUD FAQs
- `/api/brands/[id]/generate` — trigger AI content generation
- `/api/brands/[id]/export` — export brand data
- `/api/brands/[id]/strategy` — view/generate strategy
- `/api/brands/[id]/tickets` — view/manage support tickets
- `/api/brands/[id]/reorder-products` — reorder products

Only `src/app/api/brands/route.ts` (the top-level list/create) calls `getSession()`.

**Steps to Reproduce:**
```bash
# Anonymous user creates a product on someone else's brand
curl -X POST "https://mayasura-web-production.up.railway.app/api/brands/_WJosU-dG6r2/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacked Product","price":0}'
# Returns 201 Created
```

**Recommendation:**  
Create an auth middleware or helper for ALL API routes under `/api/brands/[id]/*`:

```typescript
// src/lib/api-auth.ts
import { getSession } from './auth';
import { getBrand } from './db';
import { NextResponse } from 'next/server';

export async function requireBrandOwner(brandId: string) {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }
  const brand = getBrand(brandId);
  if (!brand) {
    return { error: NextResponse.json({ error: 'Brand not found' }, { status: 404 }) };
  }
  if (brand.user_id !== session.userId) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session, brand };
}
```

Then in every route:
```typescript
const { error, session, brand } = await requireBrandOwner(id);
if (error) return error;
```

---

### C2: No Authorization Checks — Any User Can Edit/Delete Any Brand

**Severity:** 🔴 Critical  
**Affected:** `src/app/api/brands/[id]/route.ts`

**Description:**  
The PUT and DELETE handlers for `/api/brands/[id]` do NOT check if the requesting user owns the brand. Any authenticated user can edit or delete any other user's brand. The route doesn't even call `getSession()`.

**Steps to Reproduce:**
```bash
# User B edits User A's brand
curl -X PUT "https://...app/api/brands/USER_A_BRAND_ID" \
  -H "Content-Type: application/json" \
  -b "cookies_user_b.txt" \
  -d '{"name":"HACKED BY USER B"}'
# Returns 200 with modified brand
```

**Verified Result:** User B successfully renamed User A's brand to "HACKED BY USER B" and then deleted it.

**Recommendation:**  
Add ownership verification to all mutating operations. See C1 recommendation.

---

### C3: Anonymous Users Can Create Brands

**Severity:** 🔴 Critical  
**Affected:** `src/app/api/brands/route.ts` POST handler

**Description:**  
While the POST handler calls `getSession()`, it doesn't *require* a session. If no session exists, the brand is created with `user_id: null`. This means:
1. Anonymous brands can be created without any auth
2. Anonymous brands appear in the global listing for ALL anonymous users (32 brands visible)
3. Anonymous brands can be edited/deleted by anyone

**Steps to Reproduce:**
```bash
curl -X POST "https://...app/api/brands" \
  -H "Content-Type: application/json" \
  -d '{"name":"Anonymous Brand","industry":"test"}'
# Returns 201 — brand created with user_id: null
```

**Recommendation:**
```typescript
// In POST handler of /api/brands/route.ts
const session = await getSession();
if (!session) {
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
}
```

---

### C4: JWT Tokens Not Invalidated on Logout (Stateless JWT Issue)

**Severity:** 🔴 Critical  
**Affected:** `src/lib/auth.ts`, `src/app/api/auth/logout/route.ts`

**Description:**  
Logout only clears the cookie on the client side. The JWT itself remains valid until its 7-day expiration. If an attacker captures a JWT (via XSS, network sniffing, or cookie theft), it remains usable even after the user logs out.

**Steps to Reproduce:**
```bash
# 1. Login and capture the JWT cookie value
# 2. Call logout
curl -X POST "https://...app/api/auth/logout" -b cookies.txt
# 3. Use the old JWT value — it still works!
curl "https://...app/api/auth/me" -H "Cookie: mayasura-session=OLD_JWT_VALUE"
# Returns user data — NOT rejected
```

**Recommendation:**  
Implement a token revocation list (Redis/DB) or switch to short-lived tokens + refresh tokens:

```typescript
// Option 1: Token blacklist in DB
CREATE TABLE IF NOT EXISTS revoked_tokens (
  token_hash TEXT PRIMARY KEY,
  revoked_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

// In verifyToken, check blacklist first
// In logout, add token hash to blacklist

// Option 2: Short-lived tokens (15 min) + refresh tokens (7 days)
// Refresh token stored in DB, revocable on logout
```

---

## 🟠 High Findings

### H1: All Brands Visible to Anonymous Users via API

**Severity:** 🟠 High  
**Affected:** `src/app/api/brands/route.ts` GET handler, `src/lib/db.ts` getAllBrands()

**Description:**  
When no session exists, `getAllBrands()` is called without a userId filter, returning ALL brands in the database (32 brands in testing). This exposes every user's brand data including descriptions, voice settings, channel configurations, and user IDs.

**Steps to Reproduce:**
```bash
curl "https://...app/api/brands"
# Returns ALL 32 brands from all users
```

**Recommendation:**
```typescript
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const brands = getAllBrands(session.userId);
  return NextResponse.json({ brands });
}
```

---

### H2: Stored XSS via Brand Name and Description

**Severity:** 🟠 High  
**Affected:** All API routes that accept text input, all frontend rendering

**Description:**  
No input sanitization is performed on any user input. Brand names, descriptions, product names, etc. accept and store arbitrary HTML/JavaScript. If these values are rendered without escaping on the frontend, this leads to stored XSS.

**Steps to Reproduce:**
```bash
curl -X POST "https://...app/api/brands" \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(\"XSS\")</script>","description":"<img src=x onerror=alert(1)>"}'
# Returns 201 — stored as-is
```

**Note:** React's JSX auto-escapes by default with `{}` interpolation, which provides some protection. However, if `dangerouslySetInnerHTML` is used anywhere (e.g., for rich content or markdown rendering), this becomes exploitable.

**Recommendation:**
1. Sanitize input on the server side using a library like `sanitize-html` or `DOMPurify` (for server-side)
2. Add input length validation
3. Audit all frontend rendering for `dangerouslySetInnerHTML` usage

```typescript
import sanitizeHtml from 'sanitize-html';

function sanitize(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
}
```

---

### H3: SQL Injection Risk in updateBrand/updateProduct Dynamic Column Names

**Severity:** 🟠 High  
**Affected:** `src/lib/db.ts` — `updateBrand()`, `updateProduct()`, `updateBlogPost()`, `updateChatbotFaq()`

**Description:**  
The `updateBrand` function builds SQL dynamically using object keys from user-controlled input:

```typescript
const fields = Object.keys(updates)
  .filter(k => updates[k] !== undefined)
  .map(k => `${k} = @${k}`)  // ← Column name from user input!
  .join(', ');
const stmt = db.prepare(`UPDATE brands SET ${fields}, ...`);
```

While the *values* use parameterized queries (`@key`), the *column names* are interpolated directly from the request body keys. An attacker could craft a request with a key like `"name = 'hacked', description"` to manipulate the SQL structure.

**Steps to Reproduce:**
This is a code-level vulnerability. The `better-sqlite3` library may have some protections, but relying on it is unsafe.

**Recommendation:**
Whitelist allowed column names:

```typescript
const ALLOWED_BRAND_FIELDS = new Set([
  'name', 'tagline', 'description', 'industry', 'logo_url',
  'primary_color', 'secondary_color', 'accent_color',
  'font_heading', 'font_body', 'brand_voice', 'channels', 'status'
]);

export function updateBrand(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_BRAND_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  // ... use safeUpdates instead of updates
}
```

---

### H4: Hardcoded JWT Secret Fallback

**Severity:** 🟠 High  
**Affected:** `src/lib/auth.ts`, `src/middleware.ts`

**Description:**  
Both files contain:
```typescript
const secret = process.env.JWT_SECRET || 'mayasura-default-secret-change-in-production';
```

If `JWT_SECRET` is not set in the production environment, a hardcoded default is used. This secret is in the public source code, meaning anyone could forge valid JWTs.

**Recommendation:**
1. Verify `JWT_SECRET` is set in Railway production environment
2. Remove the fallback — crash on startup if missing:

```typescript
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new Uint8Array(Buffer.from(secret, 'utf-8'));
}
```

---

### H5: No Security Headers

**Severity:** 🟠 High  
**Affected:** All responses

**Description:**  
The application returns no security headers:
- ❌ `X-Frame-Options` — vulnerable to clickjacking
- ❌ `X-Content-Type-Options` — MIME type sniffing
- ❌ `Content-Security-Policy` — no CSP
- ❌ `Strict-Transport-Security` — no HSTS
- ❌ `Referrer-Policy` — default referrer behavior
- ❌ `Permissions-Policy` — no feature restrictions

Only `x-powered-by: Next.js` is present (which itself is an information leak).

**Recommendation:**  
Add security headers in `next.config.ts`:

```typescript
const nextConfig = {
  poweredByHeader: false,
  headers: async () => [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;" },
    ],
  }],
};
```

---

## 🟡 Medium Findings

### M1: Weak Password Policy

**Severity:** 🟡 Medium  
**Affected:** `src/app/api/auth/signup/route.ts`

**Description:**  
The only password requirement is minimum 6 characters. Passwords like `123456`, `aaaaaa`, or `password` are accepted. No requirements for:
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters

**Steps to Reproduce:**
```bash
curl -X POST "https://...app/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Weak"}'
# Returns 201 — accepted
```

**Recommendation:**
```typescript
function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return null;
}
```

---

### M2: No Email Format Validation

**Severity:** 🟡 Medium  
**Affected:** `src/app/api/auth/signup/route.ts`

**Description:**  
The signup endpoint accepts any string as an email, including `"not-an-email"`. No format validation is performed.

**Steps to Reproduce:**
```bash
curl -X POST "https://...app/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"ValidPass!","name":"Test"}'
# Returns 201 — accepted
```

**Recommendation:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
}
```

---

### M3: No Rate Limiting on Authentication Endpoints

**Severity:** 🟡 Medium  
**Affected:** `/api/auth/login`, `/api/auth/signup`

**Description:**  
There is no rate limiting on login or signup endpoints. An attacker can perform unlimited brute-force login attempts or create unlimited accounts.

**Steps to Reproduce:**
5 rapid failed login attempts all returned 401 with no throttling or lockout.

**Recommendation:**  
Implement rate limiting using a middleware or external service. For Next.js:
```typescript
// Use a simple in-memory rate limiter or Redis-based solution
// npm install rate-limiter-flexible
import { RateLimiterMemory } from 'rate-limiter-flexible';

const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 15, // per 15 minutes
});
```

---

### M4: No Input Length Validation

**Severity:** 🟡 Medium  
**Affected:** All API endpoints accepting text input

**Description:**  
Brand names of 10,000+ characters are accepted without any validation. This could lead to:
- Database bloat
- UI rendering issues
- Potential DoS via large payloads

**Steps to Reproduce:**
```bash
# 10,000 character brand name accepted
curl -X POST "https://...app/api/brands" \
  -H "Content-Type: application/json" \
  -d '{"name":"AAAA...10000 chars...AAAA","industry":"test"}'
# Returns 201
```

**Recommendation:**  
Add length limits to all text fields:
```typescript
if (body.name.length > 200) {
  return NextResponse.json({ error: 'Brand name must be under 200 characters' }, { status: 400 });
}
if (body.description && body.description.length > 5000) {
  return NextResponse.json({ error: 'Description must be under 5000 characters' }, { status: 400 });
}
```

---

### M5: JWT Contains PII (Email and Name)

**Severity:** 🟡 Medium  
**Affected:** `src/lib/auth.ts`

**Description:**  
The JWT payload includes the user's email and name:
```json
{
  "userId": "q72D4nA-ua46",
  "email": "user@example.com",
  "name": "Security Auditor",
  "iat": 1773488546,
  "exp": 1774093346
}
```

JWTs are base64-encoded (NOT encrypted). Anyone with access to the cookie value can decode the payload and see the user's email and name. While the cookie is HttpOnly (preventing JS access), it's still visible in network logs, proxy logs, etc.

**Recommendation:**  
Only store the `userId` in the JWT. Look up email/name from the database when needed:
```typescript
export async function createToken(payload: { userId: string }): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}
```

---

## 🟢 Low Findings

### L1: X-Powered-By Header Exposes Technology

**Severity:** 🟢 Low  
**Affected:** All responses

**Description:**  
Response header `x-powered-by: Next.js` reveals the framework, making targeted attacks easier.

**Recommendation:**  
In `next.config.ts`:
```typescript
const nextConfig = { poweredByHeader: false };
```

---

### L2: Middleware Only Protects Page Routes, Not API Routes

**Severity:** 🟢 Low (systemic, but addressed by C1)  
**Affected:** `src/middleware.ts`

**Description:**  
The Next.js middleware only matches `/dashboard/:path*` and `/create/:path*`. It does NOT protect any `/api/*` routes. This means the middleware provides a false sense of security — pages redirect unauthenticated users, but the underlying API endpoints are completely open.

**Recommendation:**  
Either extend the middleware matcher to include API routes, or ensure each API route handler checks auth independently (preferred for API routes).

---

### L3: 7-Day Token Expiration is Long

**Severity:** 🟢 Low  
**Affected:** `src/lib/auth.ts`

**Description:**  
JWT tokens expire after 7 days. Combined with C4 (no token revocation), this means a compromised token is usable for up to a week.

**Recommendation:**  
Reduce to 15-60 minutes with a refresh token mechanism, or implement token revocation (see C4).

---

## ✅ What's Working Well

| Area | Status | Notes |
|------|--------|-------|
| Password hashing | ✅ Good | bcrypt with cost factor 12 |
| Cookie security flags | ✅ Good | HttpOnly, Secure, SameSite=lax, Path=/ |
| JWT signature verification | ✅ Good | Tampered JWTs are rejected |
| Duplicate email prevention | ✅ Good | Returns 409 Conflict |
| Login error messages | ✅ Good | Generic "Invalid email or password" (no user enumeration) |
| Page-level auth redirects | ✅ Good | /dashboard → /login, /create → /signup |
| Logout cookie clearing | ✅ Partial | Cookie cleared, but JWT still valid (see C4) |
| Brand isolation on listing | ✅ Good | `getAllBrands(userId)` filters by user for authenticated users |
| SQL parameterized values | ✅ Good | Values use `@param` binding (column names still risky, see H3) |
| HTTPS enforcement | ✅ Good | Railway enforces HTTPS |

---

## Priority Fix Order

1. **🔴 C1 + C2 + C3:** Add authentication + authorization to ALL API routes (this is the single biggest issue — the app has auth but doesn't enforce it)
2. **🟠 H4:** Verify JWT_SECRET is set in production; remove fallback
3. **🟠 H3:** Whitelist allowed columns in update functions
4. **🟠 H5:** Add security headers
5. **🟠 H2:** Add input sanitization
6. **🔴 C4:** Implement token revocation or short-lived tokens
7. **🟡 M1-M4:** Add input validation (password strength, email format, length limits)
8. **🟡 M5 + 🟢 L1-L3:** Clean up JWT payload, headers, expiration

---

## Recommended Architecture Change

The root cause of most findings is that auth was added to pages but not to API routes. The recommended fix is a centralized API auth layer:

```
src/
  lib/
    api-auth.ts          ← NEW: requireAuth(), requireBrandOwner()
  app/
    api/
      brands/
        route.ts         ← Add requireAuth() to POST
        [id]/
          route.ts       ← Add requireBrandOwner() to GET/PUT/DELETE
          products/
            route.ts     ← Add requireBrandOwner() to all methods
          ...            ← Same for ALL sub-routes
```

This is roughly **~1-2 hours of work** and would resolve C1, C2, C3 (the three critical findings) in one sweep.

---

*Report generated: 2026-03-14 12:44 CET*
