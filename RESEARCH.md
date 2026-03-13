# RESEARCH.md — Landscape Analysis

## Market Overview

The brand digital ecosystem space sits at the intersection of website builders, CRM platforms, e-commerce solutions, and AI content tools. No single platform today offers **one-click instantiation** of a brand's complete digital communication stack.

## Competitor Analysis

### Website Builders
| Platform | Strengths | Gaps |
|----------|-----------|------|
| **Shopify** | E-commerce leader, app ecosystem | Not brand-first; config-heavy |
| **Squarespace** | Design quality, templates | No AI content generation; manual setup |
| **Wix** | Ease of use, ADI (AI Design Intelligence) | Walled garden; limited API |
| **Framer** | Design-to-code, modern stack | Website-only; no ecosystem |
| **Webflow** | Visual development, CMS | Steep learning curve; expensive |

### All-in-One Platforms
| Platform | Strengths | Gaps |
|----------|-----------|------|
| **HubSpot** | CRM + marketing + content | Enterprise pricing; complex setup |
| **Salesforce** | Enterprise CRM leader | Not for small brands; massive overhead |
| **Zoho One** | 45+ apps, affordable | Integration friction; dated UI |
| **GoHighLevel** | Agency-focused all-in-one | White-label focus; not open source |

### AI Content & Brand Tools
| Platform | Strengths | Gaps |
|----------|-----------|------|
| **Jasper** | AI content generation | Content-only; no infrastructure |
| **Copy.ai** | Workflows, templates | No deployment; just text output |
| **Looka** | AI logo + brand kit | Logo-only; no digital ecosystem |
| **Brandmark** | AI branding | Static assets only |

### Open Source Alternatives
| Project | What It Does | Gaps |
|---------|-------------|------|
| **Medusa.js** | Open-source Shopify alternative | E-commerce only |
| **Strapi** | Headless CMS | Content-only; needs custom frontend |
| **Chatwoot** | Open-source customer engagement | Chat-only |
| **Cal.com** | Scheduling infrastructure | Single-purpose |

## Key Insight

**No open-source framework exists that lets a brand go from zero to a complete digital presence in minutes.** Every existing solution requires:
- Manual configuration across multiple tools
- Integration work between platforms
- Separate content creation workflows
- Technical expertise for deployment

## Protocols Evaluated

### MCP (Model Context Protocol) — Anthropic
- Standard for AI model ↔ tool integration
- Enables AI agents to use external tools via structured protocol
- Relevant for: Chatbot tool use, content generation pipelines

### A2A (Agent-to-Agent) — Google
- Inter-agent communication protocol
- Relevant for: Multi-agent orchestration (content agent, design agent, deployment agent)
- Still early; spec evolving

### UCP (Unified Communication Protocol)
- Emerging concept for unified messaging across channels
- Relevant for: Omnichannel brand communication

## Technology Decisions

### Why Next.js 15 with App Router
- Server Components reduce client bundle size
- API routes colocated with frontend
- React Server Actions for form handling
- Excellent TypeScript support
- Vercel/Railway deployment friendly

### Why SQLite (better-sqlite3)
- Zero infrastructure overhead
- Single-file database — portable, backable
- Synchronous API — simpler than async ORMs
- Perfect for MVP/single-instance deployments
- Railway persistent volumes support it

### Why Tailwind + shadcn/ui
- Utility-first CSS = rapid iteration
- shadcn/ui = accessible, composable components
- Swiss-style design achievable with systematic spacing/typography
- Tree-shakeable — small bundles

### Why Anthropic Claude for AI
- Best-in-class for creative writing and brand content
- Structured output support (JSON mode)
- Reliable for multi-turn content generation
- Good at maintaining brand voice consistency

## Open Questions (Resolved)

- ✅ **Minimal brand stack**: Website + Chatbot + Products + Content + CRM dashboard
- ✅ **Commoditized vs differentiable**: Website generation is commoditized; AI-powered brand voice is differentiable
- ✅ **Agent value-add**: Content generation, brand consistency, chatbot intelligence
