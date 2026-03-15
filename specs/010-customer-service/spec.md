# Feature Specification: Customer Service

**Feature Branch**: `010-customer-service`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/dashboard/[brandId]/support/page.tsx, tickets API, contact form

## User Scenarios & Testing

### User Story 1 — Consumer Submits Contact Form (Priority: P1)

A consumer fills out the contact form at /site/[slug]/contact. The submission creates a support ticket visible in the brand's dashboard.

**Why this priority**: Contact forms are the primary inbound customer communication channel.

**Independent Test**: Fill contact form on consumer site, submit, verify ticket appears in admin support dashboard.

**Acceptance Scenarios**:

1. **Given** consumer at /site/[slug]/contact, **When** they fill name, email, and message, **Then** form submits via POST /api/public/brand/[slug]/contact
2. **Given** successful submission, **When** API responds, **Then** success message appears on the contact page
3. **Given** form submission, **When** ticket is created, **Then** it appears in admin dashboard with status "open"
4. **Given** contact form, **When** required fields are empty, **Then** browser validation prevents submission

---

### User Story 2 — Admin Manages Support Tickets (Priority: P1)

Brand owner manages support tickets at /dashboard/[brandId]/support — viewing ticket list, reading submissions, updating status, and replying.

**Why this priority**: Without ticket management, customer messages go unanswered.

**Independent Test**: View ticket list, open a ticket, change status, verify changes persist.

**Acceptance Scenarios**:

1. **Given** support dashboard, **When** it loads, **Then** ticket list shows all tickets with subject/name, status (open/in-progress/resolved), and creation date
2. **Given** a ticket, **When** admin clicks it, **Then** ticket detail shows customer name, email, message, and reply thread
3. **Given** an open ticket, **When** admin changes status to "resolved", **Then** status is updated via API and reflected in the list
4. **Given** a ticket, **When** admin writes a reply, **Then** reply is stored and associated with the ticket
5. **Given** ticket stats, **When** dashboard loads, **Then** total tickets, open count, resolved count, and satisfaction score are shown
6. **Given** no tickets, **When** support page loads, **Then** empty state shows "No tickets yet" with guidance

---

### User Story 3 — Ticket Statistics on Overview Dashboard (Priority: P2)

Dashboard overview page shows ticket statistics as part of the brand health overview.

**Why this priority**: Quick glance at support load helps prioritize response.

**Independent Test**: Verify overview dashboard shows open ticket count from support stats.

**Acceptance Scenarios**:

1. **Given** overview dashboard, **When** it loads, **Then** support quick access card shows "{N} open tickets"
2. **Given** more than 3 open tickets, **When** AI insights render, **Then** suggestion mentions "quick responses improve retention by 40%"

---

### Edge Cases

- What happens when contact form is submitted without JavaScript? → Server-side form action handles submission
- What happens when ticket API fails? → Error toast on admin, silent fail on consumer
- What happens when reply is empty? → Submit button is disabled

## Requirements

### Functional Requirements

- **FR-001**: Consumer contact form MUST submit to POST /api/public/brand/[slug]/contact
- **FR-002**: Contact submission MUST create a ticket in the database with status "open"
- **FR-003**: Admin support dashboard MUST list all tickets with status, name, and date
- **FR-004**: Admin MUST be able to view ticket details including customer message
- **FR-005**: Admin MUST be able to change ticket status (open, in-progress, resolved)
- **FR-006**: Admin MUST be able to reply to tickets
- **FR-007**: Ticket statistics (total, open, resolved, satisfaction) MUST be available via API
- **FR-008**: Dashboard overview MUST display ticket stats in Quick Access section

### Key Entities

- **Ticket**: id, brand_id, customer_name, customer_email, subject, message, status (open/in-progress/resolved), created_at
- **TicketReply**: id, ticket_id, content, author (admin/customer), created_at
- **TicketStats**: total, open, resolved, satisfaction

## Success Criteria

### Measurable Outcomes

- **SC-001**: Contact form submission creates ticket within 1 second
- **SC-002**: Admin can view and respond to a ticket in under 30 seconds
- **SC-003**: Ticket status changes are reflected immediately in the list
- **SC-004**: Ticket statistics are accurate and match actual ticket counts
