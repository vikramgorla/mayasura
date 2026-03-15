# Feature Specification: Onboarding Wizard

**Feature Branch**: `002-onboarding-wizard`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/create/page.tsx, src/components/wizard/Step*.tsx

## User Scenarios & Testing

### User Story 1 — Complete Wizard from Scratch (Priority: P1)

A new user navigates to /create and completes the 6-step brand creation wizard: Basics → Identity → Products → Content → Channels → Review & Launch. AI assists at each step. At the end, a brand is created with live consumer pages.

**Why this priority**: This is the core value proposition. Without the wizard, no brands exist.

**Independent Test**: Navigate to /create, fill all 6 steps, click Launch, verify brand exists at /site/[slug] with real content and products.

**Acceptance Scenarios**:

1. **Given** a user at /create, **When** the page loads, **Then** Step 1 (Brand Basics) is shown with name, tagline, industry, and description fields
2. **Given** Step 1, **When** user enters brand name "Sunrise Café", **Then** a live slug preview shows "sunrise-cafe" with availability check
3. **Given** Step 1, **When** user clicks "AI Suggest" with industry "Coffee", **Then** 5 relevant brand name suggestions appear
4. **Given** Step 2 (Visual Identity), **When** user clicks "AI Generate Palette", **Then** a cohesive primary/secondary/accent color palette is generated
5. **Given** Step 2, **When** user selects template "editorial" and font "Playfair Display", **Then** the preview updates in real-time
6. **Given** Step 3 (Products), **When** user adds a product with name and price, **Then** it appears in the product list
7. **Given** Step 4 (Content & Tone), **When** user selects tone keywords, **Then** brand voice description updates
8. **Given** Step 5 (Channels), **When** user toggles channels (website, chatbot, ecommerce, blog), **Then** selected channels are stored and reflected in Review
9. **Given** Step 6 (Review), **When** user views the SitePreview, **Then** it renders a realistic preview matching template, colors, fonts, and products
10. **Given** Step 6, **When** user clicks "Launch Brand", **Then** brand is created via POST /api/brands, products are created, AI content generation begins, and confetti celebration plays
11. **Given** a successful launch, **When** the celebration screen appears, **Then** it shows links to Dashboard, Consumer Site, and "Create another brand"

---

### User Story 2 — Draft Auto-Save & Restore (Priority: P2)

A user partially completes the wizard, leaves the page, and returns later. Their progress is automatically restored from localStorage.

**Why this priority**: Users may not complete the wizard in one session. Losing progress is frustrating.

**Independent Test**: Fill steps 1–3, close tab, return to /create, verify all data and current step are restored.

**Acceptance Scenarios**:

1. **Given** a user has entered data in Steps 1–3, **When** data or step changes, **Then** both are auto-saved to localStorage (keys: `mayasura-wizard-draft`, `mayasura-wizard-step`)
2. **Given** saved draft exists, **When** user returns to /create, **Then** data is restored and step is set to the saved position with toast "Draft restored"
3. **Given** a user on any step, **When** they click "Clear draft" (bottom-left), **Then** after confirmation, localStorage is cleared, form resets to Step 1, toast confirms "Draft cleared"
4. **Given** no saved draft, **When** /create loads, **Then** wizard starts fresh at Step 1 with empty initial data

---

### User Story 3 — Template Pre-Fill (Priority: P2)

A user arrives at /create?template=editorial from the template gallery. The wizard pre-fills identity settings from the chosen template.

**Why this priority**: Reduces friction — users who browse templates first get a head start.

**Independent Test**: Navigate to /create?template=editorial, verify colors, fonts, and template are pre-filled.

**Acceptance Scenarios**:

1. **Given** URL has `?template=editorial`, **When** page loads, **Then** template data is applied (colors, fonts, template ID) and toast shows "Template loaded"
2. **Given** template pre-fill, **When** user reaches Step 2, **Then** color pickers show editorial palette, font selectors show Playfair Display/Inter
3. **Given** template parameter, **When** draft also exists in localStorage, **Then** template takes precedence (draft is not loaded)

---

### User Story 4 — Post-Launch Navigation (Priority: P3)

After launching a brand, the celebration screen provides clear next steps and shows AI content generation progress.

**Why this priority**: Smooth post-launch experience prevents user confusion about what to do next.

**Independent Test**: After launch, verify celebration screen shows progress indicators and all links work.

**Acceptance Scenarios**:

1. **Given** brand launched successfully, **When** celebration screen renders, **Then** it shows brand name, tagline, color palette, font pair, and product count
2. **Given** celebration screen, **When** "Go to Dashboard" is clicked, **Then** user navigates to /dashboard/[brandId]
3. **Given** celebration screen, **When** "View Consumer Site" is clicked, **Then** a new tab opens to /shop/[slug]
4. **Given** celebration screen, **When** progress items show, **Then** "AI generating website content" and "Landing page being built" show as complete, "Chatbot learning" and "Dashboard ready" show as in-progress

---

### Edge Cases

- What happens when localStorage quota is exceeded? → Draft save fails silently
- What happens when the brand name slug conflicts? → API returns unique slug (e.g., "my-coffee-2")
- What happens when user enters reserved slug ("admin", "dashboard")? → API rejects with error
- What happens when AI suggestion API fails? → Error is caught silently, user can proceed manually
- What happens when launch API fails? → Toast error message, isLaunching resets, user can retry

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a 6-step wizard: Basics, Identity, Products, Content, Channels, Review
- **FR-002**: Each step MUST animate transitions with directional slide + blur (Framer Motion)
- **FR-003**: System MUST auto-save draft to localStorage on every data/step change
- **FR-004**: System MUST restore drafts on page load (with toast notification)
- **FR-005**: System MUST support template pre-fill via `?template=` query parameter
- **FR-006**: Slug preview MUST show real-time availability with the slug-check API
- **FR-007**: AI suggestion endpoints MUST be available at each relevant step
- **FR-008**: Review step MUST show SitePreview matching the chosen template and brand data
- **FR-009**: Launch MUST create brand, products (batched), trigger AI content generation (non-blocking), and save template settings
- **FR-010**: Launch success MUST trigger confetti celebration (canvas-confetti, 4 bursts)
- **FR-011**: Step progress bar MUST show animated gradient with glow effect

### Key Entities

- **BrandData**: name, tagline, industry, description, colors (primary/secondary/accent), fonts (heading/body), products[], brandVoice, toneKeywords[], channels[], status, websiteTemplate
- **Product**: name, description, price, currency, category, image_url

## Success Criteria

### Measurable Outcomes

- **SC-001**: User can complete wizard and launch brand in under 3 minutes with AI assist
- **SC-002**: Draft restore works after page reload with 100% data fidelity
- **SC-003**: Template pre-fill populates all identity fields correctly
- **SC-004**: All step transitions complete in under 300ms
- **SC-005**: Post-launch celebration screen renders within 500ms of successful API response
