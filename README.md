# Social Media Analytics Dashboard

A full-stack analytics dashboard built with Next.js 15, TypeScript, Supabase, and modern React patterns.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth with RLS |
| UI | shadcn/ui + Tailwind CSS |
| State | Zustand (UI) + TanStack Query (server) |
| Tables | TanStack Table |
| Charts | Visx (D3-based) |
| Animations | Framer Motion |
| Testing | Jest |
| Icons | Lucide React |

## 🚀 Quick Start (For Reviewers)

### Live Demo
**URL:** [Your Vercel URL here]

### Test Credentials

| User | Email | Password | Data |
|------|-------|----------|------|
| User A | `usera@test.com` | `password123` | 15 posts, 30 days metrics |
| User B | `userb@test.com` | `password123` | 15 posts, 30 days metrics |

> **Note:** Each user can only see their own data (RLS enforced). Try logging in with both accounts to verify data isolation.

---

## Setup Instructions (Local Development)

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/akositacky/analytics-challenge-.git
cd analytics-challenge-
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migrations in order:
   - `supabase/migrations/00001_initial_schema.sql` - Creates tables and RLS policies
   - `supabase/migrations/00002_add_get_user_summary_function.sql` - Creates helper function
3. (Optional) Run `supabase/seed.sql` to populate sample data

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project under **Settings > API**.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Test Users

1. Navigate to `/auth/signup` to create accounts
2. Or create users via the Supabase Dashboard under **Authentication > Users**

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## Architecture Decisions and Trade-offs

### 1. Where to Aggregate Metrics: Database vs Server vs Client

**Decision:** Database-level aggregation using PostgreSQL functions (`get_user_summary`)

**Why:**
- **Performance** - Calculations happen where data lives, minimizing data transfer
- **Scalability** - As posts grow, we don't fetch thousands of rows to the API
- **Single round-trip** - One RPC call returns all aggregated metrics

**Trade-offs:**
- More complex debugging (SQL vs JavaScript)
- Requires PostgreSQL knowledge for maintenance
- Migrations needed for function changes

**Alternative considered:** Client-side aggregation was rejected because it would require fetching all posts to calculate totals, creating performance issues at scale.

---

### 2. State Management: Zustand vs TanStack Query

**Decision:** Hybrid approach - Zustand for UI state, TanStack Query for server state

| State Type | Tool | Examples |
|------------|------|----------|
| **UI State** | Zustand | Filters, sorting, modal open/close, chart view type |
| **Server State** | TanStack Query | Posts, metrics, analytics summary |

**Why:**
- **Clear separation of concerns** - UI state is synchronous and local; server state is async and cached
- **Built-in caching** - TanStack Query handles cache invalidation, refetching, and stale data
- **Optimistic updates ready** - Easy to add optimistic UI later
- **DevTools** - Both have excellent debugging tools

**Trade-offs:**
- Two state libraries to learn
- Need to coordinate cache clearing on auth changes (we clear cache on login/logout)

---

### 3. Empty State Handling

**Decision:** Graceful degradation with informative empty states at each level

**Implementation:**
- **API level** - Returns valid response with zeroed data instead of errors
- **Component level** - Each component handles its own empty state with helpful messaging
- **Animated feedback** - Framer Motion adds polish to empty states

```typescript
// API returns valid structure even with no data
if (!firstRow || firstRow.posts_count === 0) {
  return { data: { totalEngagement: 0, postsCount: 0, ... } }
}
```

**Why:**
- New users see a working dashboard, not error screens
- Clear call-to-action ("Create your first post")
- Consistent UX across all data states

---

### 4. Trend Calculation Approach

**Decision:** Compare rolling 7-day windows (current week vs previous week)

**Formula:**
```
trend_percentage = ((recent_7_days - prior_7_days) / prior_7_days) * 100
```

**Edge cases handled:**
- No prior data → Show 100% (all growth is new)
- No recent data → Show 0% neutral
- No data at all → Show 0% neutral

**Why:**
- 7-day window smooths daily fluctuations
- Week-over-week comparison is industry standard
- Easy to understand for non-technical users

---

### 5. Row Level Security (RLS) Strategy

**Decision:** Strict user isolation - users can only access their own data

**Policies:**
```sql
-- Users can only see their own posts
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);
```

**Why:**
- **Security by default** - Even if API has bugs, database enforces access
- **Multi-tenant ready** - Each user's data is completely isolated
- **Audit-friendly** - Policies are declarative and reviewable

**Trade-off:** Admin dashboards would need service role key to bypass RLS.

---

### 6. Chart Library: Visx over Recharts

**Decision:** Visx (D3-based primitives) instead of higher-level charting libraries

**Why:**
- **Full control** - Build exactly the visualization needed
- **Smaller bundle** - Import only what you use
- **Learning value** - Demonstrates D3/SVG understanding
- **Accessibility** - Can add ARIA attributes directly to SVG elements

**Trade-off:** More code to write compared to declarative chart libraries, but more flexibility.

---

## What I'd Improve With More Time

### High Priority
- **Real-time updates** - Use Supabase Realtime to push live updates when new posts are added, eliminating the need for manual refresh
- **Pagination** - Implement cursor-based pagination for the posts table; currently fetches all posts which won't scale well with large datasets
- **Date range picker** - Allow users to select custom date ranges for charts instead of the fixed 30-day window
- **E2E testing** - Add Playwright tests for critical flows like authentication, filtering, and data display

### Medium Priority
- **Optimistic updates** - Show immediate UI feedback when users perform actions, then sync with server in the background
- **Export functionality** - Let users download their analytics data as CSV or generate PDF reports
- **Dark mode toggle** - Add a manual theme switcher (currently follows system preference only)
- **Mobile improvements** - Enhance touch interactions for charts and improve table scrolling on smaller screens

### Nice to Have
- **Performance monitoring** - Integrate Vercel Analytics to track Core Web Vitals and identify bottlenecks
- **Accessibility audit** - Conduct screen reader testing and add proper ARIA labels, especially for the Visx charts
- **Internationalization** - Add multi-language support for global users using next-intl or similar
- **Redis rate limiting** - Move rate limiting from in-memory to Redis for persistence across server restarts

---

## Time Spent

**Total: ~6 hours** (spread throughout the day)

| Task | Time |
|------|------|
| Project setup & Supabase configuration | 0.5 hr |
| Database schema & RLS policies | 0.5 hr |
| Authentication flow (login/signup) | 0.5 hr |
| API routes & data fetching hooks | 1 hr |
| Dashboard UI (summary cards, chart, table) | 1.5 hr |
| State management (Zustand + TanStack Query) | 0.5 hr |
| Bonus features (Visx, tests, rate limiting) | 1 hr |
| Documentation & polish | 0.5 hr |

### Tools Used

- **Cursor** - AI-powered code editor
- **Claude (Agent)** - AI pair programming assistant

### Note

The challenge was sent on Monday, but due to some unexpected commitments earlier in the week, I was only able to start on Wednesday. Thanks for your patience and understanding! 🙏
