# Feature Specification: Chatbot Channel

**Feature Branch**: `006-chatbot-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/chat/[slug]/page.tsx, src/app/dashboard/[brandId]/chatbot/page.tsx

## User Scenarios & Testing

### User Story 1 — Consumer Chats with Brand AI (Priority: P1)

A consumer visits /chat/[slug] and interacts with an AI chatbot trained on the brand's voice, products, and FAQs. The interface is template-styled with typing indicators, suggestion chips, and message history.

**Why this priority**: AI chatbot is the 24/7 customer engagement channel — one of Mayasura's key differentiators.

**Independent Test**: Visit /chat/[slug], send messages, verify AI responds with brand-relevant content, suggestion chips work, typing indicator appears.

**Acceptance Scenarios**:

1. **Given** a launched brand, **When** consumer visits /chat/[slug], **Then** chat interface loads with brand styling (fonts, colors, template-specific radii)
2. **Given** chat page loads, **When** no messages exist, **Then** welcome screen shows brand logo/initial, greeting text, and 4 suggestion chips
3. **Given** suggestion chips, **When** consumer clicks "What products do you offer?", **Then** message is sent and AI responds with product info
4. **Given** user sends a message, **When** AI is processing, **Then** typing indicator shows 3 animated dots with accent color
5. **Given** AI response arrives, **When** message renders, **Then** assistant bubble includes brand avatar (first letter), text with line breaks
6. **Given** "bold" template, **When** chat renders, **Then** bubbles have 0 border-radius, send button is uppercase with letter-spacing
7. **Given** "playful" template, **When** chat renders, **Then** bubbles have asymmetric radius (24px/4px), emoji in send button
8. **Given** multiple messages, **When** new message appears, **Then** chat auto-scrolls to bottom smoothly
9. **Given** a chat session, **When** session continues, **Then** sessionId is maintained for conversation context

---

### User Story 2 — Admin Configures Chatbot (Priority: P2)

Brand owner configures the chatbot from /dashboard/[brandId]/chatbot — setting tone, managing FAQs, viewing chat statistics, and testing the bot.

**Why this priority**: Admins need control over chatbot behavior and context.

**Independent Test**: Configure chatbot tone, add FAQs, verify changes affect consumer chat responses.

**Acceptance Scenarios**:

1. **Given** chatbot dashboard, **When** it loads, **Then** it shows chatbot configuration, FAQ management, and statistics
2. **Given** tone settings, **When** admin adjusts tone (formal/casual/friendly/professional), **Then** setting is saved via PUT /api/brands/[id]/settings/chatbot-tone
3. **Given** FAQ management, **When** admin adds a question/answer pair, **Then** it's stored via POST /api/brands/[id]/chatbot-faqs
4. **Given** chatbot stats, **When** dashboard loads, **Then** conversation count, average messages per session, and satisfaction metrics are displayed
5. **Given** chatbot dashboard, **When** admin clicks "Test Chat", **Then** embedded chat preview opens for testing

---

### Edge Cases

- What happens when AI API fails? → Error message: "I'm having trouble right now. Please try again in a moment."
- What happens when brand doesn't exist? → 404 with "Chatbot not found" and back link
- What happens when brand has no products? → AI responds based on brand description and FAQs only
- What happens when message is empty? → Send button is disabled

## Requirements

### Functional Requirements

- **FR-001**: Chat interface MUST render at /chat/[slug] with brand-specific styling
- **FR-002**: Welcome screen MUST show brand avatar, greeting, and 4 suggestion chips
- **FR-003**: Typing indicator MUST appear during AI processing with 3 animated dots
- **FR-004**: Messages MUST have template-specific bubble radius and styling
- **FR-005**: Chat MUST auto-scroll to latest message on new message
- **FR-006**: Session ID MUST be maintained across messages for conversation context
- **FR-007**: Chat API MUST be at POST /api/public/brand/[slug]/chat
- **FR-008**: Admin MUST be able to configure chatbot tone and FAQs
- **FR-009**: Admin MUST be able to view chat statistics
- **FR-010**: Chat interface MUST load brand fonts dynamically and apply Design Studio CSS vars

### Key Entities

- **Message**: role (user/assistant), content, id
- **ChatSession**: sessionId, messages, brand context
- **ChatbotFAQ**: id, brand_id, question, answer
- **ChatbotSettings**: tone (formal/casual/friendly/professional)

## Success Criteria

### Measurable Outcomes

- **SC-001**: AI response time under 3 seconds for typical questions
- **SC-002**: Chat interface is fully responsive and usable on mobile
- **SC-003**: Suggestion chips reduce time-to-first-message to under 2 seconds
- **SC-004**: Admin tone changes are reflected in subsequent consumer conversations
- **SC-005**: Template-specific styling matches the brand's website design
