# Implementation Plan: Divya Gyan — Mythological AI Life Consultant Website

## Task Type
- [x] Frontend (Next.js App Router, Tailwind, Shadcn/UI)
- [x] Backend (Next.js API Routes, PostgreSQL, Pinecone RAG)
- [x] Fullstack (Monolithic Next.js deployment)

---

## Technical Solution

### Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Full-stack, SSR, streaming support for LLM responses |
| Language | TypeScript | Type safety across frontend + backend |
| Styling | Tailwind CSS + Shadcn/UI | Customizable, accessible, minimal bundle |
| Database | PostgreSQL (Prisma ORM) | ACID, JSONB for conversations, full-text search |
| Vector DB | Pinecone | Serverless RAG for scripture retrieval |
| LLM | Claude API (Anthropic) | Best instruction-following for 4-layer responses |
| Cache | Redis (Upstash) | Sessions, rate limiting |
| Auth | NextAuth.js v5 | JWT, OAuth (Google), email/password |
| State Mgmt | TanStack Query + Zustand | Server state + client state separation |
| Streaming | Server-Sent Events (SSE) | Real-time LLM response streaming |
| Testing | Vitest + RTL + Playwright | Unit, integration, E2E |
| Deployment | Vercel | Auto-scaling, CDN, Edge Functions |

### Design Theme: "Sacred Minimalism"

| Element | Value |
|---------|-------|
| Primary | Deep Saffron/Gold (#D4A574) |
| Secondary | Cream/Parchment (#F5F1E8) |
| Accent | Deep Indigo (#3A366B) |
| Light BG | Off-white (#FEFDF7) |
| Dark BG | Near-black (#0F0F0A) |
| Display Font | Crimson Text (serif — classical wisdom) |
| Body Font | Inter (sans-serif — modern readability) |

---

## Implementation Steps

### Phase 1A: Project Foundation (Step 1-5)

**Step 1** — Initialize Next.js project with TypeScript, Tailwind, Shadcn/UI
- `npx create-next-app@latest` with App Router
- Install: tailwindcss, shadcn/ui, lucide-react icons
- Configure design tokens (colors, fonts, spacing)
- Set up `globals.css` with Sacred Minimalism theme
- **Deliverable**: Running Next.js app with themed base styles

**Step 2** — Set up PostgreSQL database with Prisma ORM
- Define Prisma schema with all core tables:
  - `users` (id, email, name, age, cultural_background, preferred_tradition)
  - `user_preferences` (tone, notifications, daily_wisdom, language)
  - `sessions` (conversation context, topic_category)
  - `consultations` (user_query, ai_response, response_json, citations)
  - `safety_flags` (flag_type, confidence, action_taken)
  - `subscriptions` (plan_type, status, consultation_limit, consultations_used)
  - `scriptures` (title, tradition, description, author)
  - `verses` (scripture_id, verse_number, text, themes, tags, embedding_id)
  - `themes` (slug, name, description, emotion_keywords)
  - `usage_logs` (user_id, action, metadata)
- Run `prisma migrate dev`
- **Deliverable**: Migrated database with all tables and indexes

**Step 3** — Set up authentication with NextAuth.js v5
- Email/password registration + login
- Google OAuth provider
- JWT session tokens (httpOnly cookies)
- Auth middleware for protected routes
- **Deliverable**: Working auth flow (register, login, logout, session)

**Step 4** — Create base layouts and navigation
- Root layout with providers (Auth, QueryClient, Theme, Toast)
- `MainLayout` with Header, collapsible Sidebar, Footer
- Header: Logo, user menu (profile, settings, logout)
- Sidebar: New Chat, consultation history, Scripture Explorer, Daily Wisdom, Profile
- Mobile responsive (hamburger menu on sm breakpoints)
- **Deliverable**: Navigable app shell with responsive sidebar

**Step 5** — Build onboarding flow
- 3-step wizard: Signup -> Profile Setup -> Welcome Guide
- Profile form: name, age, cultural background, preferred tradition (Hindu/Buddhist/Greek/Universal), tone preference (casual/devotional/philosophical/practical)
- Welcome guide: How to ask questions, what to expect, example topics
- **Deliverable**: Complete onboarding for new users

### Phase 1B: Core Chat Engine (Step 6-11)

**Step 6** — Build chat UI components
- `ChatContainer` — main chat area with message list + input
- `MessageList` — scrollable message history with auto-scroll
- `UserMessage` — right-aligned user message bubble
- `InputBox` — multiline text input with send button, character count
- `WelcomeState` — shown when no active consultation (greeting, suggested topics)
- `LoadingState` — pulsing typing indicator (calming, not frantic)
- **Deliverable**: Chat interface rendering static messages

**Step 7** — Build 4-Layer Response rendering
- `ResponseLayers` container component
- `AcknowledgmentLayer` — heart icon, empathetic text
- `MythologicalLayer` — book icon, story text, scripture citation links
- `PracticalLayer` — compass icon, numbered action steps
- `LessonLayer` — light icon, affirmation text
- Each layer visually distinct (border, background tint, icon, typography)
- **Deliverable**: 4-layer response rendering with mock data

**Step 8** — Set up Pinecone RAG pipeline and seed ALL Phase 1 scripture sources
- Seed scripture database with **all Phase 1 sources** (Hindu + Buddhist per PRD §5.1, §5.2):
  - **Bhagavad Gita** (~700 verses) — duty, dharma, action without attachment
  - **Mahabharata** excerpts (~300 curated) — moral dilemmas, leadership, family
  - **Ramayana** excerpts (~300 curated) — virtue, sacrifice, loyalty, righteousness
  - **Upanishads** selections (~200 curated) — self-knowledge, consciousness, inner truth
  - **Arthashastra (Kautilya)** selections (~150 curated) — strategy, governance, practical wisdom
  - **Panchatantra** stories (~100 curated) — everyday life wisdom through storytelling
  - **Dhammapada** (~423 verses) — mind, ethics, path to liberation
  - **Jataka Tales** selections (~150 curated) — moral parables on compassion and wisdom
  - **Jain Agamas** selections (~100 curated) — non-violence, truth, detachment
- Total seed corpus: ~2,400-2,500 verses/passages for MVP
- Script to generate embeddings (OpenAI `text-embedding-3-small`)
- Store vectors in Pinecone with metadata (scripture_id, verse_number, themes, tradition, emotion_tags)
- RAG query function: embed user query -> similarity search -> return top 5 verses filtered by tradition
- Diversity boost: ensure results span multiple scriptures (avoid over-reliance on one text)
- **Deliverable**: Working RAG retrieval with complete Phase 1 knowledge base

**Step 9** — Build consultation API endpoint
- `POST /api/consultations` endpoint:
  1. Authenticate user
  2. Load session context (conversation history)
  3. Check rate limit (free: 5/month, premium: unlimited)
  4. Run content moderation on user input (reject harmful/offensive/abusive inputs before LLM call)
  5. Query Pinecone RAG for relevant verses
  6. Build structured prompt with 4-layer framework + user preferences + retrieved verses
  7. **Clarifying question logic**: If user query is vague or ambiguous, AI asks 1-2 clarifying questions before giving full 4-layer response (per PRD §6.1: "AI listens, empathises, and asks clarifying questions before responding")
  8. Call Claude API with streaming enabled
  9. Parse structured response (empathy, mythology, guidance, lesson)
  10. Run safety check (crisis detection)
  11. Validate citations against verse database (reject hallucinated quotes)
  12. Save consultation to database
  13. Stream response back via SSE
- **Deliverable**: End-to-end consultation API with streaming, clarifying questions, and content moderation

**Step 10** — Integrate streaming into chat UI
- `StreamingMessage` component receives SSE chunks
- Progressive rendering: each 4-layer section appears as it streams
- `useChat` hook manages message state, streaming lifecycle, error handling
- Optimistic UI: user message appears immediately, AI response streams in
- **Deliverable**: Real-time streaming chat with 4-layer responses

**Step 11** — Session management and conversation history
- `GET /api/sessions/:id` — fetch session with all messages
- `POST /api/sessions` — create new session
- Sidebar shows list of past sessions (title, date, topic)
- Click session to reload conversation history
- Context carried across messages within session (LLM receives last N messages)
- **Deliverable**: Persistent conversations with session switching

### Phase 1C: Features (Step 12-16)

**Step 12** — Scripture Explorer
- `GET /api/scriptures` — list all scripture sources
- `GET /api/verses/search?q=&tradition=&theme=` — full-text + vector search
- `GET /api/verses/:id` — single verse with AI explanation
- `GET /api/themes` — list all themes
- UI: Search bar with tradition/theme filters, grid of scripture cards, detail view with AI explanation
- **Deliverable**: Browsable, searchable scripture library

**Step 13** — Daily Wisdom
- `GET /api/daily-wisdom` — curated daily quote (rotates by day)
- Dashboard card: quote, source scripture, tradition icon
- Link to full verse in Scripture Explorer
- **Deliverable**: Daily wisdom feature on dashboard

**Step 14** — Quota management and billing
- `GET /api/billing/usage` — current month usage (used/limit/resetDate)
- `GET /api/billing/plans` — list all pricing plans
- `QuotaIndicator` component (progress bar: X/5 used)
- `QuotaUpgradeModal` when limit reached or < 2 remaining
- Disable chat input when quota exhausted (free tier)
- Redis-based rate limiting with monthly reset
- Stripe integration for all subscription tiers (per PRD §10):
  - **Free Tier**: 5 consultations/month, basic scripture access
  - **Premium Monthly**: ₹499/mo or $9.99/mo — unlimited consultations, all traditions, guided journeys
  - **Premium Annual**: ₹3,999/yr or $79/yr — all premium features, discounted
- Stripe webhook handler for subscription lifecycle (created, updated, cancelled, expired)
- Billing cycle tracking with automatic monthly reset of consultation count
- **Deliverable**: Working free/premium tier with monthly + annual billing

**Step 15** — Safety guardrails, content moderation, and crisis detection
- **Content moderation layer** (per PRD §8.3: "Content moderation layer for harmful or offensive inputs"):
  - Input validation: reject SQL injection, XSS, prompt injection attempts
  - Toxicity detection: flag/reject hateful, abusive, or sexually explicit inputs
  - Rate-based abuse detection: block users sending excessive requests
- **Crisis detection** (multi-layer, per PRD §8.3):
  1. Client-side keyword pattern matching (suicide, self-harm, abuse keywords)
  2. LLM-based crisis detection in system prompt (returns crisis_detected flag + confidence)
  3. Confidence thresholding (>0.8 = auto-escalate, 0.5-0.8 = flag for review)
- `CrisisResourceModal` with hotline numbers (988 US, AASRA India, iCall India, etc.)
- `safety_flags` table logging for audit trail
- **Refusal guardrails** (per PRD §8.3): no medical, legal, or financial advice — always recommend professionals
- **User over-reliance warning** (per PRD §13): periodic reminder that AI supplements, not replaces, human support
- **Deliverable**: Content moderation + crisis detection with professional referral system

**Step 16** — User profile and preferences
- `GET/PUT /api/users/profile` — view and edit profile
- `GET/PUT /api/users/preferences` — tone, tradition, notifications
- Profile page: edit name, age, cultural background, tradition, tone
- Preferences reflected in AI responses (prompt customization)
- **Deliverable**: Editable user profile affecting AI behavior

### Phase 1C-Extended: Guided Journeys & Compliance (Step 17-18)

**Step 17** — Guided Reflection Journeys (per PRD §6.6)
- Database tables:
  - `journeys` (id, title, slug, description, duration_days, theme, tradition, is_premium)
  - `journey_days` (id, journey_id, day_number, scripture_verse_id, reflection_prompt, guidance_notes)
  - `user_journeys` (id, user_id, journey_id, current_day, started_at, completed_at, status)
- Seed 2-3 MVP journeys:
  - "Overcoming Fear" (7 days) — Bhagavad Gita + Dhammapada selections
  - "Finding Purpose" (7 days) — Upanishads + Gita selections
  - "Inner Peace" (21 days) — cross-tradition selections
- Each day includes: scripture reading, reflection prompt, AI guidance session
- `GET /api/journeys` — list available journeys
- `POST /api/journeys/:id/start` — begin a journey
- `GET /api/journeys/:id/day/:dayNumber` — fetch day's content
- `POST /api/journeys/:id/day/:dayNumber/reflect` — submit reflection, get AI guidance
- UI: Journey catalog page, daily journey view with progress tracker
- Premium-only journeys gated behind subscription check
- **Deliverable**: Working 7-day and 21-day guided reflection programmes

**Step 18** — Bias control and tradition balance (per PRD §7)
- **Balanced tradition representation** testing:
  - Verify RAG results don't disproportionately favor one tradition over others
  - Test with diverse queries across all situation categories
  - Ensure "Universal" tradition preference draws from all sources equally
- **No religious supremacy** in responses:
  - System prompt explicitly instructs: "Never claim one tradition is superior to another"
  - Present teachings as complementary perspectives, not competing truths
- **Bias audit script**: automated test that sends 50+ sample queries and checks tradition distribution in citations
- **Deliverable**: Bias-tested RAG pipeline with balanced tradition representation

### Phase 1D: Polish & Launch (Step 19-24)

**Step 19** — Responsive design and mobile optimization
- Mobile-first breakpoints (Tailwind sm/md/lg/xl)
- Collapsible sidebar with hamburger menu on mobile
- Full-width chat on mobile, sticky input at bottom
- Touch targets 48px minimum
- iOS safe area handling
- Test on iPhone 12+, Android, iPad
- **Deliverable**: Fully responsive across all devices

**Step 20** — Accessibility (WCAG 2.1 AA)
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators visible
- Color contrast 4.5:1 for text, 3:1 for UI elements
- Screen reader testing
- **Deliverable**: WCAG 2.1 AA compliant

**Step 21** — GDPR & DPDP compliance implementation (per PRD §7)
- `GET /api/users/export` — export all user data as JSON (GDPR right of access)
- `DELETE /api/users/account` — soft-delete account + schedule 30-day purge (right to be forgotten)
- Consent management: explicit opt-in checkbox during signup for data processing
- Privacy policy page with clear data usage disclosure
- Cookie consent banner
- Soft delete implementation across all user-related tables (deleted_at column)
- Automated purge job: permanently delete soft-deleted records after 30 days
- No sale of personal data (enforce in Stripe + analytics config)
- **Deliverable**: GDPR + DPDP (India) compliant data handling

**Step 22** — Testing
- Unit tests (Vitest + RTL): 80%+ coverage
  - 4-layer response rendering
  - Chat streaming hook
  - Crisis detection logic
  - Content moderation logic
  - Quota management
  - Clarifying question flow
  - API client functions
  - Guided journey progression
- Integration tests: Full chat flow, auth flow, scripture search, journey flow, billing flow
- E2E tests (Playwright):
  - Fresh user: signup -> onboarding -> first consultation
  - Returning user: login -> open session -> follow-up
  - Scripture explorer: search -> filter -> view detail
  - Crisis escalation: trigger keywords -> modal appears
  - Quota exceeded: hit limit -> upgrade modal
  - Guided journey: start journey -> complete day 1 -> progress tracked
  - Billing: subscribe to premium -> quota unlimited -> cancel
  - Content moderation: send abusive input -> rejected gracefully
  - Data export: request export -> download JSON
- **Deliverable**: Comprehensive test suite, 80%+ coverage

**Step 23** — Load testing and scalability validation (per PRD §7: 100K+ concurrent users)
- Set up load testing with k6 or Artillery
- Test scenarios:
  - 1,000 concurrent chat sessions with streaming responses
  - 10,000 concurrent scripture search queries
  - 100 concurrent RAG + LLM consultation requests
- Validate response time SLAs under load:
  - < 4 seconds for standard queries (p95)
  - < 8 seconds for complex multi-layered responses (p95)
- Identify bottlenecks (database connections, LLM API rate limits, Pinecone throughput)
- Implement connection pooling, query optimization, and caching based on results
- Document scaling strategy for 100K+ users (read replicas, Redis clustering, CDN)
- **Deliverable**: Load test report with scaling recommendations

**Step 24** — Performance optimization and deployment
- Lighthouse score >90 (desktop), >80 (mobile)
- Bundle analysis and code splitting
- Image optimization (Next.js Image component)
- API response caching (Redis for frequent queries, daily wisdom, scripture metadata)
- Rate limiting at Edge (Vercel Edge Functions)
- Environment variables for all secrets (no hardcoded keys)
- Vercel deployment with preview environments
- Sentry error tracking + alerting
- PostHog analytics for KPI tracking (per PRD §12: MAU, session duration, CSAT, NPS)
- Uptime monitoring for 99.5% SLA (per PRD §7)
- **Deliverable**: Production-ready deployment with monitoring

---

## Key Files

| File | Operation | Description |
|------|-----------|-------------|
| `package.json` | Create | Dependencies, scripts |
| `next.config.ts` | Create | Next.js configuration |
| `tailwind.config.ts` | Create | Sacred Minimalism theme tokens |
| `prisma/schema.prisma` | Create | Full database schema (13 tables incl. journeys) |
| `app/layout.tsx` | Create | Root layout with providers |
| `app/(auth)/login/page.tsx` | Create | Login page |
| `app/(auth)/onboarding/page.tsx` | Create | Onboarding wizard |
| `app/(dashboard)/page.tsx` | Create | Chat dashboard (main experience) |
| `app/(dashboard)/scripture/page.tsx` | Create | Scripture Explorer |
| `app/(dashboard)/wisdom/page.tsx` | Create | Daily Wisdom |
| `app/(dashboard)/journeys/page.tsx` | Create | Guided Reflection Journeys catalog |
| `app/(dashboard)/journeys/[id]/page.tsx` | Create | Active journey daily view |
| `app/(dashboard)/profile/page.tsx` | Create | User profile |
| `app/(dashboard)/settings/page.tsx` | Create | Account settings + billing |
| `app/(dashboard)/help/page.tsx` | Create | FAQ + crisis resources |
| `app/privacy/page.tsx` | Create | Privacy policy page |
| `app/terms/page.tsx` | Create | Terms of service page |
| `app/api/auth/[...nextauth]/route.ts` | Create | NextAuth configuration |
| `app/api/consultations/route.ts` | Create | Consultation API (POST with streaming) |
| `app/api/sessions/[id]/route.ts` | Create | Session management |
| `app/api/verses/search/route.ts` | Create | Scripture search |
| `app/api/daily-wisdom/route.ts` | Create | Daily wisdom endpoint |
| `app/api/journeys/route.ts` | Create | List journeys |
| `app/api/journeys/[id]/start/route.ts` | Create | Start a journey |
| `app/api/journeys/[id]/day/[day]/route.ts` | Create | Get/submit journey day |
| `app/api/billing/plans/route.ts` | Create | List pricing plans |
| `app/api/billing/subscribe/route.ts` | Create | Stripe subscription creation |
| `app/api/billing/usage/route.ts` | Create | Usage tracking |
| `app/api/billing/webhook/route.ts` | Create | Stripe webhook handler |
| `app/api/users/export/route.ts` | Create | GDPR data export |
| `app/api/users/account/route.ts` | Create | Account deletion (GDPR) |
| `components/chat/ChatContainer.tsx` | Create | Main chat area |
| `components/chat/MessageList.tsx` | Create | Scrollable messages |
| `components/chat/ResponseLayers.tsx` | Create | 4-layer response rendering |
| `components/chat/ClarifyingQuestion.tsx` | Create | AI clarifying question UI |
| `components/chat/InputBox.tsx` | Create | Chat input with send |
| `components/chat/StreamingMessage.tsx` | Create | SSE streaming renderer |
| `components/layout/Header.tsx` | Create | Top navigation |
| `components/layout/Sidebar.tsx` | Create | Side navigation |
| `components/scripture/ScriptureSearch.tsx` | Create | Search + filters |
| `components/journeys/JourneyCatalog.tsx` | Create | Journey listing cards |
| `components/journeys/JourneyDayView.tsx` | Create | Daily journey content |
| `components/journeys/ProgressTracker.tsx` | Create | Journey progress bar |
| `components/modals/CrisisResourceModal.tsx` | Create | Safety escalation modal |
| `components/modals/QuotaUpgradeModal.tsx` | Create | Upgrade prompt |
| `components/modals/CookieConsentBanner.tsx` | Create | GDPR cookie consent |
| `components/modals/OverRelianceReminder.tsx` | Create | AI supplement reminder |
| `lib/llm.ts` | Create | Claude API wrapper with 4-layer prompt |
| `lib/rag.ts` | Create | Pinecone RAG pipeline |
| `lib/safety.ts` | Create | Crisis detection logic |
| `lib/moderation.ts` | Create | Content moderation (toxicity, abuse) |
| `lib/redis.ts` | Create | Rate limiting + session cache |
| `lib/hooks/useChat.ts` | Create | Chat session + streaming hook |
| `lib/hooks/useJourney.ts` | Create | Journey progress hook |
| `lib/stores/chatStore.ts` | Create | Zustand message state |
| `lib/stores/authStore.ts` | Create | Zustand auth state |
| `scripts/seed-verses.ts` | Create | Seed ALL Phase 1 scriptures (9 sources) |
| `scripts/seed-journeys.ts` | Create | Seed guided reflection journeys |
| `scripts/embed-verses.ts` | Create | Generate Pinecone embeddings |
| `scripts/bias-audit.ts` | Create | Test tradition balance in RAG results |
| `scripts/load-test.ts` | Create | k6/Artillery load test scenarios |

---

## Database Schema Summary

```
users ──< user_preferences (1:1)
users ──< sessions ──< consultations ──< safety_flags
users ──< subscriptions (1:1)
users ──< usage_logs
users ──< user_journeys ──> journeys ──< journey_days ──> verses
scriptures ──< verses
themes (standalone, referenced via JSONB in verses)
```

**13 tables**: users, user_preferences, sessions, consultations, safety_flags, subscriptions, usage_logs, scriptures, verses, themes, journeys, journey_days, user_journeys

---

## AI Prompt Architecture

**System prompt structure:**
1. Persona: "You are Divya Gyan, an ancient and compassionate sage trained in world mythologies and philosophies..."
2. **Clarifying question instruction**: "If the user's situation is vague or could be interpreted multiple ways, ask 1-2 empathetic clarifying questions before providing your full response. Always listen first."
3. 4-Layer framework instructions with format requirements
4. User preferences: tone={casual|devotional|philosophical|practical}, tradition={hindu|buddhist|greek|universal}
5. Retrieved RAG verses (top 5) as citation context
6. **Bias control instruction**: "Never claim one tradition is superior to another. Present teachings as complementary perspectives. Draw from multiple traditions when the user selects 'Universal'."
7. Safety guardrails: crisis detection, no medical/legal/financial advice, recommend professionals
8. **Over-reliance disclaimer**: Periodically remind users that AI supplements, not replaces, professional human support
9. Session context: last N messages for continuity

**Response modes:**
- **Clarifying mode**: When query is ambiguous → ask questions, show empathy (no 4-layer yet)
- **Full response mode**: When situation is clear → structured JSON with empathetic_acknowledgment, mythological_parallel (story + lesson + citations), practical_guidance (action steps), life_lesson fields
- **Crisis mode**: When crisis detected → empathy + professional resources + hotlines (skip 4-layer)

---

## Risks and Mitigation

All risks from PRD §13 + additional technical risks:

| Risk | Impact | Mitigation | PRD Ref |
|------|--------|------------|---------|
| Misinterpretation of sacred texts | High | Expert panel review; multiple scholarly validations; community feedback | §13 |
| Religious / cultural sensitivity | High | Universal, non-denominational framing; optional tradition preference; bias audit script | §13 |
| AI hallucination of fake quotes | High | RAG pipeline ensures citations from real verse database; citation validation step | §13 |
| Crisis situations mishandled | Critical | Multi-layer detection (client + LLM + regex); mandatory professional referral; 100% detection target | §13 |
| User over-reliance on AI | Medium | Periodic in-app reminders that AI supplements, not replaces, human support | §13 |
| Competitive imitation | Medium | Proprietary curated dataset; deep community moat; unique 4-layer UX | §13 |
| Response time exceeds 4s SLA | High | Streaming (perceived speed); Redis caching; prompt optimization; load testing | §7 |
| 4-layer responses feel formulaic/robotic | High | Varied prompt templates; clarifying questions; A/B test with users | §6.2 |
| Tradition bias in RAG results | Medium | Bias audit script; diversity boost in retrieval; balanced seed data | §7 |
| Free tier abuse (API cost) | Medium | Redis rate limiting; IP-based fallback; usage monitoring; content moderation | §10 |
| Harmful/offensive user inputs | Medium | Content moderation layer; toxicity detection; input validation | §8.3 |
| Mobile chat UX issues | Medium | Extensive device testing; sticky input; safe-area handling | §7 |
| GDPR/DPDP non-compliance | High | Soft deletes; data export API; encryption at rest/transit; consent management; 30-day purge | §7 |
| Scalability bottleneck at 100K users | Medium | Load testing with k6; connection pooling; Redis clustering; CDN; scaling plan | §7 |

---

## Cost Estimate (MVP, 10K users)

| Component | Monthly Cost |
|-----------|-------------|
| Claude API (~100K consultations) | $300-500 |
| Pinecone (10K vectors) | $70 |
| PostgreSQL (Supabase) | $25 |
| Redis (Upstash) | $15 |
| Vercel (Pro) | $20 |
| Sentry (free tier) | $0 |
| **Total** | **~$430-630/mo** |

---

---

## PRD Traceability Matrix — Full Coverage Verification

Every requirement from the PRD mapped to its implementation step:

### §5 Knowledge Base Sources (Phase 1: Hindu + Buddhist)

| Source | Step | Status |
|--------|------|--------|
| Bhagavad Gita (~700 verses) | Step 8 | Covered |
| Mahabharata (curated excerpts) | Step 8 | Covered |
| Ramayana (curated excerpts) | Step 8 | Covered |
| Upanishads (selections) | Step 8 | Covered |
| Arthashastra (selections) | Step 8 | Covered |
| Panchatantra (stories) | Step 8 | Covered |
| Dhammapada (~423 verses) | Step 8 | Covered |
| Jataka Tales (selections) | Step 8 | Covered |
| Jain Agamas (selections) | Step 8 | Covered |
| Greek/Stoic texts | Phase 2 | Deferred per PRD §9 roadmap |
| Tao Te Ching, Bible, Rumi | Phase 2+ | Deferred per PRD §9 roadmap |

### §6 Core Features

| Feature | Step | Status |
|---------|------|--------|
| §6.1 Natural language chat interface | Step 6 | Covered |
| §6.1 AI asks clarifying questions | Step 9 | Covered |
| §6.1 Multi-layered responses | Step 7, 9, 10 | Covered |
| §6.1 Context memory within session | Step 11 | Covered |
| §6.2 4-Layer Response Model | Step 7 | Covered |
| §6.3 All 8 situation categories | Step 2 (themes table) | Covered |
| §6.4 User profile (name, age, culture, tradition) | Step 5, 16 | Covered |
| §6.4 Cross-session memory | Phase 3 | Deferred per PRD §9 |
| §6.4 Adaptive tone | Step 16 | Covered |
| §6.5 Scripture Explorer (browse/search) | Step 12 | Covered |
| §6.5 AI explains verse in plain language | Step 12 | Covered |
| §6.5 Daily wisdom | Step 13 | Covered |
| §6.6 Guided Reflection Journeys (7/21-day) | Step 17 | Covered |

### §7 Non-Functional Requirements

| NFR | Step | Status |
|-----|------|--------|
| Response time < 4s / < 8s | Step 9-10, 23, 24 | Covered |
| 99.5% uptime | Step 24 | Covered |
| English at launch | All | Covered |
| Hindi/Sanskrit (Phase 2) | Phase 2 | Deferred per PRD §9 |
| 100K+ concurrent users | Step 23 | Covered |
| Safety & crisis detection | Step 15 | Covered |
| GDPR & DPDP compliance | Step 21 | Covered |
| Bias control / balanced traditions | Step 18 | Covered |
| Content moderation | Step 9, 15 | Covered |

### §8 AI Architecture

| Requirement | Step | Status |
|-------------|------|--------|
| RAG for scripture citation | Step 8 | Covered |
| 4-layer prompt engineering | Step 9, AI Prompt Architecture | Covered |
| Thematic tagging | Step 8 (themes, tags in verses) | Covered |
| Safety guardrails | Step 15 | Covered |
| Content moderation layer | Step 9, 15 | Covered |
| Crisis detection → professional referral | Step 15 | Covered |
| Refuse medical/legal/financial advice | Step 15 | Covered |

### §10 Business Model

| Revenue Stream | Step | Status |
|----------------|------|--------|
| Free Tier (5/month) | Step 14 | Covered |
| Premium Monthly (₹499/$9.99) | Step 14 | Covered |
| Premium Annual (₹3,999/$79) | Step 14 | Covered |
| Institutional B2B | Phase 4 | Deferred per PRD §9 |
| API Access | Phase 4 | Deferred per PRD §9 |

### §13 Risks

| Risk | Step | Status |
|------|------|--------|
| Misinterpretation of sacred texts | Step 18 (bias audit) | Covered |
| Religious/cultural sensitivity | Step 18 | Covered |
| AI hallucination of fake quotes | Step 8, 9 (citation validation) | Covered |
| Crisis situations mishandled | Step 15 | Covered |
| User over-reliance on AI | Step 15 (reminder) | Covered |
| Competitive imitation | Design + dataset moat | Covered |

### Deferred to Phase 2-4 (per PRD §9 Roadmap)

| Feature | PRD Phase | Notes |
|---------|-----------|-------|
| Greek & Taoist sources | Phase 2 (Month 4-6) | Add to scripture seed scripts |
| Mobile app (iOS/Android) | Phase 2 (Month 4-6) | React Native or Flutter |
| Cross-session memory | Phase 3 (Month 7-9) | Extend sessions table |
| Multilingual (Hindi) | Phase 3 (Month 7-9) | i18n + translated UI |
| Voice mode | Phase 3 (Month 7-9) | Speech-to-text + TTS |
| B2B licensing | Phase 4 (Month 10-12) | Custom plans + admin portal |
| Community features | Phase 4 (Month 10-12) | Forums, shared wisdom |
| API for third-party integration | Phase 4 (Month 10-12) | Public API + docs |

**Result: 0 gaps. All Phase 1 PRD requirements are covered. All Phase 2-4 items are explicitly deferred per PRD roadmap.**

---

## SESSION_ID (for /ccg:execute use)
- CODEX_SESSION: N/A (codeagent-wrapper not available)
- GEMINI_SESSION: N/A (codeagent-wrapper not available)
