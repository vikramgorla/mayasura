# Feature Specification: Social Media Channel

**Feature Branch**: `008-social-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/dashboard/[brandId]/social/page.tsx

## User Scenarios & Testing

### User Story 1 — Preview Social Media Cards (Priority: P1)

Brand owner views platform-specific social media preview cards at /dashboard/[brandId]/social for Twitter/X, Instagram, LinkedIn, and Google SERP — showing exactly how their brand will appear when shared.

**Why this priority**: Social sharing is a primary discovery channel. Accurate previews help brands optimize their presence.

**Independent Test**: Visit social preview page, verify all 4 platform previews render with correct brand data.

**Acceptance Scenarios**:

1. **Given** social preview page, **When** it loads, **Then** 4 preview cards render: Twitter/X, Instagram, LinkedIn, Google SERP
2. **Given** Twitter/X preview, **When** it renders, **Then** it shows brand card with name, description, URL, and OG image in Twitter card format
3. **Given** Instagram preview, **When** it renders, **Then** it shows profile-style card with brand avatar, name, tagline, and grid preview
4. **Given** LinkedIn preview, **When** it renders, **Then** it shows article-share format with headline, description, and brand image
5. **Given** Google SERP preview, **When** it renders, **Then** it shows search result format with title (≤60 chars), URL, and meta description (≤160 chars)
6. **Given** any preview, **When** brand data changes, **Then** previews update to reflect current brand name, tagline, description, and colors

---

### User Story 2 — AI Social Post Generation (Priority: P2)

Brand owner uses AI to generate social media posts for different platforms, optimized for each platform's format and tone.

**Why this priority**: Consistent, platform-optimized social content drives engagement.

**Independent Test**: Generate a social post, verify it matches platform constraints and brand voice.

**Acceptance Scenarios**:

1. **Given** social page, **When** admin clicks "Generate Post", **Then** AI generates platform-specific content (Twitter: ≤280 chars, LinkedIn: professional tone, Instagram: with hashtags)
2. **Given** generated posts, **When** they render, **Then** each shows character count and platform-specific formatting
3. **Given** a generated post, **When** admin clicks "Copy", **Then** text is copied to clipboard

---

### Edge Cases

- What happens when brand has no description? → Previews show brand name only with placeholder text
- What happens when AI generation fails? → Error toast, user can retry

## Requirements

### Functional Requirements

- **FR-001**: Social preview page MUST show platform-specific cards for Twitter/X, Instagram, LinkedIn, and Google SERP
- **FR-002**: Each preview MUST use real brand data (name, tagline, description, colors, logo)
- **FR-003**: Google SERP preview MUST show character count indicators for title and description
- **FR-004**: AI post generation MUST produce platform-optimized content respecting character limits
- **FR-005**: Generated posts MUST include copy-to-clipboard functionality

### Key Entities

- **SocialPreview**: platform, title, description, imageUrl, brandColors
- **SocialPost**: platform, content, characterCount, hashtags

## Success Criteria

### Measurable Outcomes

- **SC-001**: All 4 platform previews render accurately with brand data
- **SC-002**: AI-generated posts respect platform character limits
- **SC-003**: Google SERP preview matches actual search appearance within 95% fidelity
