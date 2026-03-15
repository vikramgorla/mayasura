# Feature Specification: Blog Channel

**Feature Branch**: `005-blog-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/blog/[slug]/*.tsx, src/app/dashboard/[brandId]/blog/page.tsx

## User Scenarios & Testing

### User Story 1 — Consumer Reads Blog (Priority: P1)

A consumer visits /blog/[slug] and sees published blog posts. They can browse by category, read individual posts at /blog/[slug]/[postSlug] with table of contents, share buttons, and reading time.

**Why this priority**: Blog is the primary content/SEO channel driving organic traffic.

**Independent Test**: Visit /blog/[slug], verify post listing, click a post, verify full post renders with TOC and share buttons.

**Acceptance Scenarios**:

1. **Given** a brand with published blog posts, **When** consumer visits /blog/[slug], **Then** posts are listed with title, excerpt, category, published date, and reading time
2. **Given** posts with categories, **When** category filter is available, **Then** clicking a category filters the post list
3. **Given** a published post, **When** consumer visits /blog/[slug]/[postSlug], **Then** full post renders with heading hierarchy, inline formatting, and images
4. **Given** a post page, **When** it loads, **Then** table of contents (auto-generated from headings), reading time, and share buttons are displayed
5. **Given** a post page, **When** user clicks share button, **Then** platform-specific share URL is generated (Twitter, LinkedIn, Copy link)
6. **Given** blog listing, **When** Open Graph is checked, **Then** each post has opengraph-image route for social preview cards
7. **Given** a brand with no published posts, **When** blog listing loads, **Then** empty state with appropriate message is shown

---

### User Story 2 — Admin Manages Blog Posts (Priority: P1)

Brand owner manages blog posts from /dashboard/[brandId]/blog — creating, editing, publishing, scheduling, and deleting posts. Includes status filtering and search.

**Why this priority**: Content management is essential for ongoing brand operation.

**Independent Test**: Create a post, edit it, publish it, verify it appears on consumer blog.

**Acceptance Scenarios**:

1. **Given** blog dashboard, **When** it loads, **Then** all posts are listed with title, status (draft/published/scheduled), category, reading time, and published date
2. **Given** blog dashboard, **When** admin clicks "New Post", **Then** a create/edit panel opens with title, content (markdown), category, excerpt, SEO title, SEO description fields
3. **Given** editing a post, **When** content is entered, **Then** live markdown preview renders alongside the editor
4. **Given** editing a post, **When** slug field is empty, **Then** slug auto-generates from title via `slugify()`
5. **Given** a draft post, **When** admin clicks "Publish", **Then** post status changes to published and appears on consumer blog
6. **Given** a published post, **When** admin clicks "Unpublish", **Then** post returns to draft status and is hidden from consumer blog
7. **Given** blog dashboard, **When** admin uses status filter (All/Draft/Published/Scheduled), **Then** list filters accordingly
8. **Given** blog dashboard, **When** admin searches by title, **Then** posts are filtered in real-time
9. **Given** a post, **When** admin clicks delete, **Then** confirmation prompt appears, post is deleted on confirm
10. **Given** SEO preview panel, **When** title and excerpt are entered, **Then** Google SERP preview shows with character counts (title: /60, desc: /160) and green/amber indicators

---

### User Story 3 — AI Blog Writer (Priority: P2)

Admin uses the 4-step AI blog writer to generate complete blog posts: Topic → Outline → Article → SEO optimization.

**Why this priority**: AI writing removes the biggest barrier to consistent content creation.

**Independent Test**: Open AI writer, provide topic, generate outline, generate article, optimize SEO, verify complete post is created.

**Acceptance Scenarios**:

1. **Given** blog dashboard, **When** admin clicks AI Writer button, **Then** 4-step AI writing drawer/panel opens
2. **Given** AI Writer Step 1 (Topic), **When** admin enters a topic and clicks Generate, **Then** AI generates a structured outline
3. **Given** AI Writer Step 2 (Outline), **When** outline is reviewed and confirmed, **Then** AI generates the full article in markdown
4. **Given** AI Writer Step 3 (Article), **When** article is generated, **Then** admin can review, edit, and proceed
5. **Given** AI Writer Step 4 (SEO), **When** SEO step loads, **Then** AI generates SEO title, meta description, and suggested tags
6. **Given** completed AI Writer flow, **When** admin confirms, **Then** post is created as draft with all generated content

---

### Edge Cases

- What happens when a post slug conflicts? → System appends a number suffix
- What happens when markdown contains unsupported syntax? → Basic HTML conversion handles common markdown
- What happens when AI writer API fails? → Error message, user can retry or write manually
- What happens when consumer visits a non-existent post slug? → 404 page

## Requirements

### Functional Requirements

- **FR-001**: Consumer blog MUST render at /blog/[slug] with post listing and category filtering
- **FR-002**: Individual posts MUST render at /blog/[slug]/[postSlug] with full markdown content
- **FR-003**: Post pages MUST include auto-generated table of contents, reading time, and share buttons
- **FR-004**: Blog MUST have per-post Open Graph image generation route
- **FR-005**: Dashboard blog MUST support CRUD operations for posts (create, read, update, delete)
- **FR-006**: Posts MUST support statuses: draft, published, scheduled
- **FR-007**: Dashboard MUST provide status filtering and title search
- **FR-008**: Dashboard MUST include live markdown preview for content editing
- **FR-009**: AI Blog Writer MUST provide 4-step flow: Topic → Outline → Article → SEO
- **FR-010**: SEO preview MUST show Google SERP preview with character count indicators
- **FR-011**: Reading time MUST be calculated at ~200 words per minute

### Key Entities

- **BlogPost**: id, brand_id, title, slug, content (markdown), excerpt, category, seo_title, seo_description, status (draft/published/scheduled), published_at, created_at

## Success Criteria

### Measurable Outcomes

- **SC-001**: Blog post listing renders with correct template styling and categories
- **SC-002**: AI Blog Writer generates a complete, publish-ready post in under 60 seconds
- **SC-003**: SEO preview accurately reflects how the post would appear in Google search
- **SC-004**: Reading time calculation is accurate within ±10%
- **SC-005**: Admin can create, publish, and see a post on the consumer blog in under 2 minutes
