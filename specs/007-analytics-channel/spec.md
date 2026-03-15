# Feature Specification: Analytics Channel

**Feature Branch**: `007-analytics-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/dashboard/[brandId]/analytics/page.tsx, tracking API routes

## User Scenarios & Testing

### User Story 1 — View Analytics Dashboard (Priority: P1)

Brand owner views comprehensive analytics at /dashboard/[brandId]/analytics showing page views, unique visitors, device breakdown, referrers, revenue, conversion rate, and engagement metrics — all from real data.

**Why this priority**: Analytics inform every business decision. Without real metrics, brands can't optimize.

**Independent Test**: Visit analytics page for a brand with tracked page views, verify all charts render with real data.

**Acceptance Scenarios**:

1. **Given** analytics dashboard, **When** it loads, **Then** key metric cards show: Page Views (with trend), Unique Visitors (with trend), Revenue (with trend), Conversion Rate (with trend)
2. **Given** metric cards, **When** data is present, **Then** each card shows animated counter, sparkline chart, and trend badge (↑ green / ↓ red with percentage)
3. **Given** page view data, **When** area chart renders, **Then** it shows traffic over time with gradient fill and responsive tooltips
4. **Given** device data, **When** pie chart renders, **Then** it shows mobile/tablet/desktop breakdown with color-coded segments
5. **Given** referrer data, **When** referrer table renders, **Then** top referrers are listed with visit counts, sorted by count descending
6. **Given** page-level data, **When** top pages table renders, **Then** most-visited pages are listed with view counts
7. **Given** no analytics data, **When** dashboard loads, **Then** empty state shows "No data yet" with guidance to share the brand URL
8. **Given** analytics page, **When** date range filter is available, **Then** user can select different time periods

---

### User Story 2 — E-Commerce Analytics (Priority: P2)

Analytics dashboard shows e-commerce specific metrics: orders, revenue, conversion funnel, and revenue trends.

**Why this priority**: Revenue analytics are critical for brands with e-commerce enabled.

**Independent Test**: Create orders for a brand, verify revenue chart and conversion metrics appear.

**Acceptance Scenarios**:

1. **Given** orders exist, **When** analytics loads, **Then** revenue card shows current period total with trend vs previous period
2. **Given** orders and page views, **When** conversion rate renders, **Then** it's calculated as (orders / unique visitors) × 100
3. **Given** revenue data, **When** revenue chart renders, **Then** area chart shows revenue over time with emerald gradient

---

### User Story 3 — Content & Engagement Metrics (Priority: P3)

Analytics shows blog post count, published posts, subscriber count, and contact/support metrics.

**Why this priority**: Content metrics help brands understand their audience growth.

**Independent Test**: Verify blog post counts, subscriber count, and contact metrics are displayed.

**Acceptance Scenarios**:

1. **Given** blog posts exist, **When** analytics loads, **Then** blog metrics show total posts and published count
2. **Given** subscribers exist, **When** analytics loads, **Then** subscriber count is displayed
3. **Given** contacts exist, **When** analytics loads, **Then** contact count and new contacts are shown

---

### User Story 4 — Tracking Pixel (Priority: P1)

Every consumer site page automatically tracks visits via the tracking API on page load.

**Why this priority**: Without tracking, analytics has no data.

**Independent Test**: Visit a consumer site page, verify POST /api/public/brand/[slug]/track is called.

**Acceptance Scenarios**:

1. **Given** consumer visits any page, **When** page loads, **Then** POST /api/public/brand/[slug]/track fires with page path and referrer
2. **Given** tracking request, **When** it includes referrer, **Then** referrer is stored for referrer analytics
3. **Given** tracking request, **When** user-agent is parsed, **Then** device type (mobile/tablet/desktop) is recorded

---

### Edge Cases

- What happens when analytics API fails? → Error state with retry option
- What happens when brand has zero page views? → Empty state, no charts rendered
- What happens when previous period data is zero? → Trend badge shows "—" instead of Infinity%

## Requirements

### Functional Requirements

- **FR-001**: Analytics dashboard MUST display page views, unique visitors, revenue, and conversion rate as metric cards
- **FR-002**: Each metric card MUST include animated counter, sparkline, and trend indicator
- **FR-003**: System MUST render area chart for traffic/revenue over time (Recharts)
- **FR-004**: System MUST render pie chart for device breakdown
- **FR-005**: System MUST render tables for top referrers and top pages
- **FR-006**: Consumer site layout MUST fire tracking pixel on every page load
- **FR-007**: Tracking endpoint MUST record page path, referrer, device type, and timestamp
- **FR-008**: All metrics MUST compare current period vs previous period for trend calculation
- **FR-009**: System MUST show appropriate empty states when no data exists

### Key Entities

- **PageView**: id, brand_id, page, referrer, device_type, created_at
- **AnalyticsSummary**: pageViews (total, prevTotal, byPage, byDay), uniqueVisitors, devices, referrers, revenue, conversionRate

## Success Criteria

### Measurable Outcomes

- **SC-001**: Analytics dashboard loads in under 2 seconds with chart rendering
- **SC-002**: Tracking pixel fires on 100% of consumer site page loads
- **SC-003**: Trend calculations are accurate within ±1%
- **SC-004**: Device detection correctly categorizes mobile, tablet, and desktop
- **SC-005**: All charts are responsive and readable on mobile viewports
