# Feature Specification: E-Commerce Channel

**Feature Branch**: `004-ecommerce-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/shop/[slug]/*.tsx

## User Scenarios & Testing

### User Story 1 — Browse & Filter Products (Priority: P1)

A consumer visits /shop/[slug] and browses the product catalog with category filtering, template-styled product cards, and quick-add to cart.

**Why this priority**: Product browsing is the entry point of the e-commerce funnel.

**Independent Test**: Visit /shop/[slug], verify products render with correct template styling, filter by category, add to cart.

**Acceptance Scenarios**:

1. **Given** a brand with products, **When** consumer visits /shop/[slug], **Then** all products display in a responsive grid (1–4 columns based on viewport)
2. **Given** products with categories, **When** filter buttons appear, **Then** clicking a category filters products with AnimatePresence exit/enter animations
3. **Given** any product card, **When** user hovers, **Then** image zooms (scale 1.1, 700ms), overlay appears with "Quick Add" button
4. **Given** "bold" template, **When** products render, **Then** cards have 2px borders, 0 radius, uppercase text, and accentColor category labels
5. **Given** "playful" template, **When** products render, **Then** cards have 20px radius, white background, shadow, and "Add to Cart 🛒" button text
6. **Given** product with badge eligible, **When** card renders, **Then** "Best Seller", "New", or "Sale" badge appears (top-left, template-styled)
7. **Given** a brand with no products, **When** shop loads, **Then** empty state renders with template-appropriate icon and "Check back soon" message

---

### User Story 2 — Product Detail Page (Priority: P1)

Consumer clicks a product and sees detailed information at /shop/[slug]/product/[productId] with images, description, price, reviews, and add-to-cart.

**Why this priority**: Product detail is where purchase decisions happen.

**Independent Test**: Navigate to a product detail page, verify all information renders, add-to-cart works.

**Acceptance Scenarios**:

1. **Given** a product page, **When** it loads, **Then** product name, description, price, currency, image, and category are displayed
2. **Given** a product with reviews, **When** page loads, **Then** average rating, review count, and individual reviews are shown
3. **Given** a product page, **When** user clicks "Add to Cart", **Then** product is added to cart with quantity 1, toast confirms
4. **Given** a product page, **When** user submits a review (name, rating, text), **Then** POST /api/public/brand/[slug]/products/[id]/reviews is called

---

### User Story 3 — Cart Management (Priority: P1)

Consumer manages their cart at /shop/[slug]/cart with quantity adjustment, item removal, and subtotal calculation.

**Why this priority**: Cart is the bridge between browsing and checkout.

**Independent Test**: Add items, adjust quantities, remove items, verify subtotal updates.

**Acceptance Scenarios**:

1. **Given** items in cart, **When** /shop/[slug]/cart loads, **Then** all items shown with name, price, quantity controls, and line totals
2. **Given** an item in cart, **When** quantity is increased, **Then** line total and subtotal update immediately
3. **Given** an item in cart, **When** "Remove" is clicked, **Then** item is removed with exit animation, subtotal updates
4. **Given** cart with items, **When** "Proceed to Checkout" is clicked, **Then** user navigates to /shop/[slug]/checkout
5. **Given** an empty cart, **When** cart page loads, **Then** empty state with "Continue Shopping" link is shown

---

### User Story 4 — Checkout & Order Confirmation (Priority: P1)

Consumer completes a 3-step checkout: Shipping → Payment → Review, then receives order confirmation at /shop/[slug]/order/[orderId].

**Why this priority**: Checkout completion is the revenue event.

**Independent Test**: Complete full checkout flow, verify order is created in DB, confirmation page shows order details.

**Acceptance Scenarios**:

1. **Given** checkout page, **When** Step 1 (Shipping) loads, **Then** form shows name, email, address, city, zip, country fields with validation
2. **Given** invalid shipping form, **When** user tries to advance, **Then** field-level errors appear with animated FieldError components
3. **Given** Step 2 (Payment), **When** it loads, **Then** card number, expiry, and CVC fields are shown (demo mode)
4. **Given** Step 3 (Review), **When** it loads, **Then** order summary shows all items, shipping info, discount (if applied), and total
5. **Given** a valid discount code, **When** user enters it, **Then** discount is validated via /api/brands/[id]/discounts and applied to total
6. **Given** review step, **When** user clicks "Place Order", **Then** POST /api/public/brand/[slug]/orders creates order, confirmation page loads
7. **Given** order confirmation, **When** page loads at /shop/[slug]/order/[orderId], **Then** order number, items, total, and shipping info are displayed
8. **Given** checkout, **When** step indicator renders, **Then** it shows Shipping → Payment → Review with completed/active/upcoming states

---

### User Story 5 — Discount Codes (Priority: P3)

Admin creates discount codes in the dashboard. Consumers apply them at checkout for percentage or fixed-amount discounts.

**Why this priority**: Promotional tool, not core to basic commerce.

**Independent Test**: Create discount in dashboard, apply at checkout, verify price reduction.

**Acceptance Scenarios**:

1. **Given** admin at /dashboard/[brandId]/discounts, **When** they create a discount, **Then** code, type (percentage/fixed), value, and expiry are stored
2. **Given** checkout with discount field, **When** consumer enters valid code, **Then** discount is applied and total recalculated
3. **Given** expired or invalid code, **When** consumer enters it, **Then** error message appears

---

### Edge Cases

- What happens when product has price 0 or null? → Shows "Free" instead of price
- What happens when cart is accessed with no items? → Empty state with link to shop
- What happens when order creation fails? → Toast error, user can retry
- What happens when product image is missing? → SVG cube placeholder renders
- What happens when brand has no products? → Empty state on shop page

## Requirements

### Functional Requirements

- **FR-001**: Shop MUST render at /shop/[slug] with template-styled product grid
- **FR-002**: Products MUST be filterable by category with animated transitions
- **FR-003**: Product cards MUST show image (with zoom hover), name, category, price, and quick-add button
- **FR-004**: Product detail page MUST show full product info, reviews, and add-to-cart
- **FR-005**: Cart MUST persist in client state with quantity adjustment and removal
- **FR-006**: Checkout MUST follow 3-step flow: Shipping → Payment → Review
- **FR-007**: Checkout form MUST validate all fields with inline error display
- **FR-008**: Discount codes MUST be validated via API before applying
- **FR-009**: Order creation MUST persist to database via POST /api/public/brand/[slug]/orders
- **FR-010**: Order confirmation page MUST display at /shop/[slug]/order/[orderId]
- **FR-011**: Shop layout MUST include its own nav, cart indicator, and brand styling
- **FR-012**: SEO MUST include ShopMeta and BreadcrumbMeta structured data

### Key Entities

- **Product**: id, name, description, price, currency, image_url, category, created_at
- **CartItem**: productId, name, price, currency, image_url, quantity
- **Order**: id, brand_id, customer info, items, subtotal, discount, total, status
- **Discount**: id, code, type (percentage/fixed), value, expiry, usage limits

## Success Criteria

### Measurable Outcomes

- **SC-001**: Consumer can browse, add to cart, and complete checkout in under 3 minutes
- **SC-002**: Product grid renders correctly across all 16 templates
- **SC-003**: Cart state persists across page navigation within the shop
- **SC-004**: Checkout validation catches all required field errors before submission
- **SC-005**: Order confirmation page loads within 1 second of order placement
