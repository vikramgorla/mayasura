# Feature Specification: Email/Newsletter Channel

**Feature Branch**: `009-email-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — subscriber API routes, newsletter components, consumer site footer/popup

## User Scenarios & Testing

### User Story 1 — Consumer Subscribes to Newsletter (Priority: P1)

A consumer subscribes to a brand's newsletter via the footer form or popup on the consumer site. Their email is stored as a subscriber.

**Why this priority**: Email list building is the most valuable owned-audience channel.

**Independent Test**: Visit consumer site, enter email in footer form, verify subscriber is created in database.

**Acceptance Scenarios**:

1. **Given** consumer site footer, **When** user enters email and clicks Subscribe, **Then** POST /api/public/brand/[slug]/newsletter is called, success message shows
2. **Given** newsletter popup (30s delay), **When** popup appears, **Then** it shows subscribe form with brand styling and dismiss option
3. **Given** successful subscription, **When** footer form submits, **Then** success text "✓ Subscribed. Thank you." replaces the form (or "✨ Subscribed!" for playful template)
4. **Given** already subscribed email, **When** user resubscribes, **Then** graceful handling (no error, idempotent)
5. **Given** "bold" template footer, **When** subscribe button renders, **Then** it's uppercase with 0.06em letter-spacing

---

### User Story 2 — Admin Manages Subscribers (Priority: P1)

Brand owner views and manages their subscriber list from the dashboard, including CSV export and subscriber count.

**Why this priority**: Subscriber management is essential for email marketing operations.

**Independent Test**: View subscriber list in dashboard, export CSV, verify subscriber data is accurate.

**Acceptance Scenarios**:

1. **Given** dashboard subscriber section, **When** it loads, **Then** subscriber list shows email, subscription date, and status
2. **Given** subscribers exist, **When** admin clicks "Export CSV", **Then** CSV file downloads with all subscriber emails and metadata
3. **Given** subscriber list, **When** admin views it, **Then** subscriber count matches the analytics dashboard count
4. **Given** no subscribers, **When** section loads, **Then** empty state with guidance to share the brand URL

---

### User Story 3 — Unsubscribe (Priority: P2)

A subscriber can unsubscribe from the newsletter.

**Why this priority**: Required for email compliance (CAN-SPAM, GDPR).

**Independent Test**: Trigger unsubscribe, verify subscriber is marked as unsubscribed.

**Acceptance Scenarios**:

1. **Given** a subscribed user, **When** they trigger unsubscribe, **Then** their status is updated to unsubscribed
2. **Given** an unsubscribed user, **When** consumer site loads, **Then** newsletter popup does not appear for them

---

### Edge Cases

- What happens when invalid email is entered? → Browser native validation + form `required` attribute
- What happens when newsletter API fails? → Silent fail on consumer side, error toast on admin
- What happens when CSV export has no subscribers? → Empty CSV with headers only

## Requirements

### Functional Requirements

- **FR-001**: Consumer site footer MUST include email subscription form
- **FR-002**: Newsletter popup MUST appear after 30 seconds on first visit (dismissible)
- **FR-003**: Subscription MUST be stored via POST /api/public/brand/[slug]/newsletter
- **FR-004**: Admin MUST be able to view subscriber list with email and date
- **FR-005**: Admin MUST be able to export subscribers as CSV
- **FR-006**: Subscriber count MUST be reflected in analytics dashboard
- **FR-007**: Unsubscribe functionality MUST be available
- **FR-008**: Subscribe form MUST be template-styled (border-radius, button style, colors)

### Key Entities

- **Subscriber**: id, brand_id, email, subscribed_at, status (active/unsubscribed)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Newsletter form submission completes in under 1 second
- **SC-002**: CSV export includes all subscribers with correct data
- **SC-003**: Newsletter popup appears exactly at 30-second mark
- **SC-004**: Subscribe form is accessible (label, required, email validation)
