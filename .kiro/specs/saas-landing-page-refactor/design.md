# Design Document

## SaaS Landing Page Refactor — Atlas Detailing

---

## Overview

This refactor transforms the Atlas Detailing Next.js website from its current BEM + plain-CSS visual language into the premium dark SaaS aesthetic of the "Premium SaaS Landing Page" Figma prototype. The approach is a selective, incremental migration: adopt the Figma prototype's design tokens, animation patterns, and new section components into the existing Next.js app, rather than rewriting it wholesale.

The three guiding constraints are:

1. **Preserve all live functionality** — the booking calendar, availability API, GSAP process animation, Sentry, and PostHog must not regress.
2. **Replace blue with green** — every `blue-600` / `#1468FF` occurrence in migrated code becomes `#4caf50` / `var(--green)`.
3. **Add, don't remove** — existing CSS custom properties and BEM class names are kept and Tailwind is layered on top, not a replacement.

---

## Architecture

### Technology Stack (post-refactor)

| Concern | Library | Notes |
|---|---|---|
| Framework | Next.js 16 (React 19) | App Router, RSC |
| Animations (new) | `motion` v12 (motion/react) | Entrance, scroll, parallax |
| Animations (existing) | GSAP 3.15 + ScrollTrigger | ProcessSection only |
| CSS utilities | Tailwind CSS v4 | Layered alongside BEM globals.css |
| Icons | `lucide-react` | New components only |
| Error tracking | @sentry/nextjs | Unchanged |
| Analytics | posthog-js | Unchanged |
| Fonts | Syne (heading), DM Sans (body) | Unchanged, loaded via Google Fonts CDN + next/font |

### CSS Architecture

Tailwind v4 is installed as a dev dependency with `@tailwindcss/postcss`. The single `@import 'tailwindcss'` directive is prepended to `globals.css`, placing Tailwind base styles before all existing rules. Existing BEM class definitions override Tailwind resets where class names coincide, but since Tailwind v4 uses a `@layer` architecture internally, specificity conflicts are minimal.

Green theme token registration in Tailwind uses a CSS-first config (v4 style):

```css
/* In globals.css, after @import 'tailwindcss' */
@theme {
  --color-green: #4caf50;
  --color-green-DEFAULT: #4caf50;
}
```

This makes `text-green-DEFAULT`, `bg-green-DEFAULT`, and `border-green-DEFAULT` resolve to `#4caf50`.

### Background color update

`--bg` is updated from `#111111` to `#06060C`. All other custom properties remain unchanged. The `nav` background in globals.css is updated from `rgba(17,17,17,0.92)` to a transparent default managed by the new SiteNav scroll-state logic.

### Animation coexistence

`motion/react` (entrance, parallax, sticky scroll) and GSAP (ProcessSection ScrollTrigger) coexist because they operate on different DOM subtrees. The only interaction risk is that both read `window.scrollY`; this is safe since neither writes to a shared state object. All `motion` components are in `'use client'` files.

### Section order (post-refactor)

```
SiteNav (sticky)
└─ HeroSection
└─ WorkflowSection      ← NEW
└─ FeaturesGrid         ← NEW
└─ StatsBar             ← NEW
└─ ServicesSection      (restyled)
└─ ProcessSection       (restyled)
└─ ReviewsSection       (restyled)
└─ CtaBanner            (restyled)
SiteFooter              (restyled)
```

---

## Components and Interfaces

### Shared: `FadeUpWhenVisible`

Client component. Accepts `children`, `delay`, `className`. Uses `useInView` with `{ once: true, margin: '-60px' }` and animates `{ opacity: 0, y: 22 }` → `{ opacity: 1, y: 0 }`. Honors `prefers-reduced-motion` by using `duration: 0` when the media query matches.

```ts
interface FadeUpWhenVisibleProps {
  children: React.ReactNode
  delay?: number      // seconds, default 0
  className?: string
}
```

### `SiteNav` (refactored)

Client component. Adds a `scrolled` boolean state toggled by a `scroll` listener (threshold: 20px). When `scrolled` is false: `bg-transparent border-transparent`. When `scrolled` is true: `bg-[#06060C]/90 backdrop-blur-xl border-b border-white/6`. All existing links, CTA, logo, and mobile menu logic are preserved.

### `HeroSection` (refactored)

Client component (required for `useScroll`, `useTransform`, state). Structure:

- Full-viewport section (`min-h-screen`) with radial glow background and grid texture overlay (both `pointer-events-none` divs with inline styles).
- Announcement badge: mono pill with animated green pulse dot.
- Headline: staggered `motion.span` lines using `fadeUp` variants.
- Subtitle + CTAs: `motion.div` with fade-up.
- Trust chips: preserved, wrapped in `motion.div`.
- `HeroCalendarWidget`: unchanged logic, restyled card wrapper. Wrapped in `motion.div` with `useScroll`/`useTransform` for translateY parallax (0 → 60px as user scrolls).

### `WorkflowSection` (new)

Client component. File: `components/WorkflowSection.tsx`.

```ts
// Derived from existing lib/content.ts STEPS array
interface WorkflowStep {
  num: string
  title: string
  desc: string
  mockup: React.ReactNode  // step-specific UI card
}
```

Four steps, content sourced from `STEPS` in `lib/content.ts`. Inner layout: 2-col grid (step list left, mockup panel right). Section total height: `4 * 100vh`. Inner container: `position: sticky; top: 0; height: 100vh`. Active step tracked via `scrollYProgress.on('change', ...)` from `useScroll`. Step mockups are Atlas-content versions of the Figma prototype mockups:

| Step | Mockup |
|---|---|
| 1 · Customer books online | `BookingMockup` — form card showing service, date, time fields |
| 2 · We confirm your appointment | `CalendarMockup` — week calendar with new booking highlighted |
| 3 · We come to you | `LocationMockup` — map/location card with address and ETA |
| 4 · Enjoy the result | `ResultMockup` — before/after placeholder + "Photos included" badge |

All mockup accent colors use `var(--green)` / `#4caf50` instead of `blue-600`.

**Reduced motion / no-JS**: a `WorkflowSectionStatic` component (no client hooks) renders all four steps expanded with the first step highlighted. `ProcessSectionLoader`-style pattern: a server-side `Suspense` boundary falls back to `WorkflowSectionStatic`.

### `FeaturesGrid` (new)

Client component. File: `components/FeaturesGrid.tsx`.

Six Atlas-specific feature cards:

| # | Title | Icon | col-span |
|---|---|---|---|
| 1 | Mobile Service | `Car` | col-span-2 |
| 2 | Fully Insured | `Shield` | col-span-1 |
| 3 | Online Booking | `Calendar` | col-span-1 |
| 4 | Instant Confirmation | `Bell` | col-span-1 |
| 5 | Before & After Photos | `Camera` | col-span-1 |
| 6 | 5-Star Rated | `Star` | col-span-2 |

Each card: `rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4 transition-all`. Hover radial gradient overlay using `#4caf5008`. Each wrapped in `FadeUpWhenVisible` with staggered `delay={i * 0.06}`.

### `StatsBar` (new)

Client component. File: `components/StatsBar.tsx`.

```ts
interface Stat {
  target: number
  format: (v: number) => string   // e.g. v => `${v}+`
  label: string
  sub: string
}
```

Uses `useInView({ once: true, margin: '-80px' })` to trigger count-up. The `useCountUp` hook is a pure function of `(target, duration, active)` that uses `requestAnimationFrame` with an ease-out cubic interpolation.

Stats:

| Value | Label | Sub |
|---|---|---|
| 47+ | Google reviews | 5.0 average rating |
| 5.0★ | star rating | Across all reviews |
| Atlanta metro | service area | Mobile — we come to you |

Layout: `border-y border-white/6`, `grid-cols-1 md:grid-cols-3`, `divide-y md:divide-y-0 md:divide-x divide-white/6`.

### `ServicesSection` (restyled)

Async RSC — no change to server-side logic (`fetchPackages`, fallback, `ServicesFallbackNotice`). Service cards restyled: `rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4`. Price and icon in `var(--green)`. Section heading and eyebrow restyled. Each card wrapped in a `FadeUpWhenVisible` client wrapper via a thin `ServiceCardAnimated` client component.

### `ProcessSection` (restyled)

Existing GSAP logic is untouched. CSS-only changes: step card `background` updated to `rgba(255,255,255,0.02)`, `border-color` updated to `rgba(255,255,255,0.06)`, `border-radius` updated to 16px. Section background matches page background. Eyebrow and headline restyled to mono-font eyebrow pattern.

### `ReviewsSection` (restyled)

Client component (needed for `FadeUpWhenVisible`). Data from `REVIEWS` array, unchanged. Review cards: `rounded-2xl border border-white/6 bg-white/2 p-6`. Stars replaced from `★★★★★` text to five `<Star size={12} className="fill-[#4caf50] text-[#4caf50]" />` icons from `lucide-react`. Staggered `FadeUpWhenVisible` per card.

### `CtaBanner` (restyled)

Stays as a client component shell for the `FadeUpWhenVisible` wrapper. Visual changes: `rounded-3xl border border-white/8`, radial gradient glow from top using green (`rgba(76,175,80,0.18)`), grid texture overlay. Inline badge with green pulse dot. Headline: `text-4xl lg:text-6xl font-bold tracking-tight`. Buttons: primary with `var(--green)` fill and green box-shadow glow; secondary ghost.

### `SiteFooter` (restyled)

Server component. Layout changes to multi-column grid (`grid-cols-2 md:grid-cols-[1fr_auto_auto]`): brand column (logo + name + tagline) and two link columns (nav links, social/legal). Tagline: `"Premium mobile car detailing · Atlanta, GA"`. Copyright in `font-mono text-white/20`. Top divider: `border-t border-white/6`. All existing data from `lib/content.ts` preserved.

### Sub-pages: Contact and Services

Visual-only updates (card panel restyle). No changes to API logic, `force-dynamic`, or error handling.

---

## Data Models

No new data models are introduced. All data flows through existing interfaces:

- `ServiceDisplay` (lib/content.ts) — unchanged
- `AvailabilitySlot` (lib/api.ts) — unchanged
- `PublicPackage`, `PublicBusinessInfo`, `BookingResult` (lib/api.ts) — unchanged

New components draw on existing content:

- `WorkflowSection` reads from `STEPS` in `lib/content.ts`
- `StatsBar` uses hardcoded stat values (no API)
- `FeaturesGrid` uses hardcoded feature card definitions (no API)

### `useCountUp` hook interface

```ts
function useCountUp(target: number, duration?: number, active?: boolean): number
// Returns current animated value in range [0, target]
// Uses requestAnimationFrame + cubic ease-out: easing(p) = 1 - (1-p)^3
// Returns 0 immediately when active is false
// Returns target immediately when target === 0
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This feature is primarily a visual refactor. Most acceptance criteria are snapshot-level checks (CSS values, class presence, component rendering). However, several areas involve pure functions or stateful logic with meaningful input variation, which are suitable for property-based testing.

**PBT library**: `fast-check` — available for TypeScript/React, mature, well-maintained.

---

### Property 1: Booking URL parameters are round-tripped correctly

*For any* valid date string (YYYY-MM-DD) and time string (HH:MM), constructing a booking URL via `bookingPageUrl({ date, time })` and then parsing the resulting URL's query parameters must yield back the original date and time values unchanged.

**Validates: Requirements 5.6**

---

### Property 2: Workflow section renders content from STEPS array

*For any* step index `i` in the range [0, 3], the rendered `WorkflowSection` at active step `i` must display a title and description that exactly match `STEPS[i].title` and `STEPS[i].desc` from `lib/content.ts`.

**Validates: Requirements 6.3**

---

### Property 3: Progress indicator fill is monotonically correct

*For any* active step index `i` in [0, 3] and any bar index `j` in [0, 3], the progress bar at position `j` must be filled (green) when `j <= i` and unfilled when `j > i`.

**Validates: Requirements 6.6**

---

### Property 4: Count-up interpolation stays in bounds and is non-decreasing

*For any* target value `T >= 0` and any two progress ratios `p1, p2` where `0 <= p1 <= p2 <= 1`, the count-up interpolation function must produce values `v1, v2` satisfying: `0 <= v1 <= v2 <= T`.

**Validates: Requirements 8.2**

---

## Error Handling

### API errors (existing, preserved)

All API calls in `lib/api.ts` are unchanged. Existing `try/catch` in `ServicesSection` falls back to `FALLBACK_SERVICES`. `HeroCalendarWidget` falls back to an empty slot array. `fetchBusinessInfo` errors in Contact and Services pages are handled by existing conditional rendering.

### New component failures

- **WorkflowSection**: The sticky scroll approach uses pure CSS + a scroll event listener. If `scrollYProgress` fails to mount (SSR), the `activeStep` defaults to `0`, rendering the first step highlighted — a safe, informative fallback.
- **StatsBar count-up**: If `requestAnimationFrame` is unavailable (rare), the hook's `useEffect` simply never fires, leaving values at `0`. The stat values are thus always in a valid range (`[0, target]`).
- **FeaturesGrid**: Pure static render — no async dependencies. Cannot fail at runtime beyond the entire React tree failing.

### Motion/React errors

All `motion` components are in `'use client'` files. If the `motion` library fails to hydrate, components degrade to their `initial` state (hidden). The `prefers-reduced-motion` guard sets `duration: 0` on all transitions, preventing invisible stuck states.

---

## Testing Strategy

This feature is primarily UI/CSS. The testing approach is:

### Unit tests (example-based)

Focused on the few stateful/logic pieces:

- `useCountUp` hook: test with `active=false` (returns 0), `active=true` advancing over time, and `target=0` (returns 0 immediately).
- `bookingPageUrl` URL construction: test with and without params, verify URL encoding.
- `SiteNav` scroll state: test that `scrolled` becomes true at >20px and false at ≤20px.
- `WorkflowSection` active step selection: given a `scrollYProgress` value, verify the correct step index is selected.
- `StatsBar` stat display: verify formatted stat strings appear in rendered output.

### Property-based tests (fast-check)

Each test must run a minimum of 100 iterations. Each test references its design property.

**Feature: saas-landing-page-refactor, Property 1: Booking URL parameters are round-tripped correctly**

```ts
fc.assert(fc.property(
  fc.string({ minLength: 10, maxLength: 10 }).filter(isValidISODate),
  fc.string({ minLength: 5, maxLength: 5 }).filter(isValidTimeString),
  (date, time) => {
    const url = bookingPageUrl({ date, time })
    const params = new URL(url).searchParams
    return params.get('date') === date && params.get('time') === time
  }
), { numRuns: 100 })
```

**Feature: saas-landing-page-refactor, Property 2: Workflow section renders content from STEPS array**

```ts
fc.assert(fc.property(
  fc.integer({ min: 0, max: 3 }),
  (stepIndex) => {
    const { getByText } = render(<WorkflowSection activeStepOverride={stepIndex} />)
    return (
      getByText(STEPS[stepIndex].title) !== null &&
      getByText(STEPS[stepIndex].desc) !== null
    )
  }
), { numRuns: 100 })
```

**Feature: saas-landing-page-refactor, Property 3: Progress indicator fill is monotonically correct**

```ts
fc.assert(fc.property(
  fc.integer({ min: 0, max: 3 }),
  (activeStep) => {
    const { container } = render(<WorkflowProgressBar activeStep={activeStep} totalSteps={4} />)
    const bars = container.querySelectorAll('[data-bar]')
    return Array.from(bars).every((bar, j) => {
      const filled = bar.classList.contains('bg-green-DEFAULT')
      return j <= activeStep ? filled : !filled
    })
  }
), { numRuns: 100 })
```

**Feature: saas-landing-page-refactor, Property 4: Count-up interpolation stays in bounds and is non-decreasing**

```ts
fc.assert(fc.property(
  fc.nat({ max: 10000 }),
  fc.tuple(fc.float({ min: 0, max: 1 }), fc.float({ min: 0, max: 1 })).map(
    ([a, b]) => [Math.min(a, b), Math.max(a, b)] as [number, number]
  ),
  (target, [p1, p2]) => {
    const ease = (p: number) => 1 - Math.pow(1 - p, 3)
    const v1 = Math.round(ease(p1) * target)
    const v2 = Math.round(ease(p2) * target)
    return v1 >= 0 && v2 <= target && v1 <= v2
  }
), { numRuns: 100 })
```

### Accessibility tests (example-based)

- Render each new section component and verify all `<img>` elements have non-empty `alt` attributes.
- Verify all icon-only buttons have non-empty `aria-label` attributes.
- Verify that with `window.matchMedia('(prefers-reduced-motion: reduce)')` mocked to `true`, `FadeUpWhenVisible` uses `duration: 0`.
- Verify all interactive elements (calendar day buttons, time slot buttons) have a rendered size ≥ 44px on both axes.

### Integration tests

- Build smoke test: `next build` succeeds with no TypeScript errors.
- API integration: `fetchPackages` and `fetchAvailability` are called during SSR/ISR and the components render with live or fallback data.
- GSAP + motion/react coexistence: `ProcessSection` and `WorkflowSection` render on the same page without throwing.

### Visual regression

Not mandated by requirements, but recommended: capture screenshot snapshots of each restyled section at 375px, 768px, and 1280px widths to catch regressions on subsequent changes.
