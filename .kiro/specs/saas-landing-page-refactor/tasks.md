# Implementation Plan: SaaS Landing Page Refactor

## Overview

Incrementally migrate the Atlas Detailing Next.js 16 app from its current BEM + plain-CSS visual language into the premium dark SaaS aesthetic. All live functionality (booking calendar, GSAP process animation, Sentry, PostHog) must be preserved throughout. Tailwind v4 is layered alongside existing globals.css — not a replacement. Every blue accent from the Figma prototype becomes `#4caf50` (green).

**Important Next.js 16 notes:**
- Turbopack is the default build/dev tool — no `webpack` config should be added.
- Tailwind v4 uses `@tailwindcss/postcss` plugin + `@import 'tailwindcss'` directive in `globals.css`. There is no `tailwind.config.js` in v4; theme tokens go in a `@theme {}` block in CSS.
- All `motion/react` components must be in `'use client'` files.
- `postcss.config.mjs` must export `{ plugins: { '@tailwindcss/postcss': {} } }`.

---

## Tasks

- [ ] 1. Install dependencies and configure Tailwind CSS v4
  - [ ] 1.1 Install Tailwind CSS v4 and the motion/react and lucide-react packages
    - Run `npm install -D tailwindcss @tailwindcss/postcss` and `npm install motion lucide-react`
    - Verify installed versions: `tailwindcss` v4+, `motion` v12+, `lucide-react` latest
    - _Requirements: 2.1, 3.1, 3.2_

  - [ ] 1.2 Update `postcss.config.mjs` for Tailwind v4
    - Replace existing postcss config content with `export default { plugins: { '@tailwindcss/postcss': {} } }`
    - This is the only required plugin; do NOT add `autoprefixer` (not needed for Tailwind v4)
    - _Requirements: 2.1_

  - [ ] 1.3 Update `app/globals.css` — Tailwind import, `@theme` block, and `--bg` token
    - Prepend `@import 'tailwindcss';` as the very first line of `globals.css`
    - Immediately after the `@import`, add an `@theme` block registering `--color-green: #4caf50;`
    - Change `--bg` in the `:root` block from `#111111` to `#06060C`
    - Update the `.nav` rule's `background` from `rgba(17,17,17,0.92)` to `transparent` (SiteNav scroll state will manage this in task 3.1)
    - Preserve all existing custom properties and BEM rules; Tailwind base styles are prepended, not a replacement
    - _Requirements: 1.1, 1.7, 2.2, 2.3, 4.1_

- [ ] 2. Create shared utilities: `FadeUpWhenVisible` and `useCountUp`
  - [ ] 2.1 Create `components/FadeUpWhenVisible.tsx`
    - `'use client'` component using `useInView` from `motion/react` with `{ once: true, margin: '-60px' }`
    - Animate from `{ opacity: 0, y: 22 }` to `{ opacity: 1, y: 0 }` with `duration: 0.58` and `ease: [0.21, 0.47, 0.32, 0.98]`
    - Detect `prefers-reduced-motion` via `window.matchMedia`; set `duration: 0` when reduced motion is preferred
    - Props: `children: React.ReactNode`, `delay?: number` (default `0`), `className?: string`
    - _Requirements: 7.5, 9.6, 10.4, 16.8_

  - [ ] 2.2 Create `hooks/useCountUp.ts`
    - Pure hook: `useCountUp(target: number, duration?: number, active?: boolean): number`
    - Uses `requestAnimationFrame` with cubic ease-out: `easing(p) = 1 - (1 - p)^3`
    - Returns `0` when `active` is `false`; returns `target` immediately when `target === 0`
    - Cancels the animation frame on cleanup
    - _Requirements: 8.2_

- [ ] 3. Refactor `SiteNav` — transparent-to-frosted-glass scroll transition
  - [ ] 3.1 Add scroll-based state and conditional classes to `SiteNav.tsx`
    - Add `scrolled` boolean state; attach a `scroll` listener on `window` in a `useEffect`, set `scrolled = true` when `window.scrollY > 20`, false otherwise; clean up listener on unmount
    - When `scrolled` is `false`: nav element classes `bg-transparent border-transparent`
    - When `scrolled` is `true`: nav element classes `bg-[#06060C]/90 backdrop-blur-xl border-b border-white/6`
    - Keep the `.nav` CSS class on the element so existing height/positioning rules still apply
    - Update `.nav-link` inline style or className to use `text-white/45 hover:text-white` per Req 4.6
    - Preserve all existing links, CTA button, logo, and mobile hamburger menu logic without change
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 4. Refactor `HeroSection` — full-viewport SaaS layout with entrance animations
  - [ ] 4.1 Restructure `HeroSection.tsx` layout and visual elements
    - Add `'use client'` (already present); wrap section in `min-h-screen` with centered content
    - Add two `pointer-events-none` decorative divs: radial glow background and grid texture overlay (both as inline-style divs inside the section)
    - Add announcement badge: mono pill `"Now serving the Atlanta metro area"` with an animated green pulse dot (a span with `animate-pulse` and `bg-[#4caf50]` rounded-full)
    - Restyle headline to `text-5xl lg:text-[80px] font-extrabold tracking-tight` with a green accent on key phrase; wrap headline text in `motion.span` elements for stagger
    - Add two CTAs: primary "Book now →" with green fill + `box-shadow: 0 0 24px rgba(76,175,80,0.35)`, secondary "View services" ghost button
    - Preserve existing trust chips (star rating, insured, mobile service) in their `chip-row` wrapper
    - Preserve `HeroCalendarWidget` — only restyle its outer wrapper card to match SaaS card style (`rounded-2xl border border-white/8 bg-[#0D0D1A]`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.8_

  - [ ] 4.2 Add `motion/react` entrance animations and parallax scroll to `HeroSection.tsx`
    - Import `motion`, `useScroll`, `useTransform` from `motion/react`
    - Wrap badge, headline spans, subtitle, CTAs, and trust chips in `motion.div` / `motion.span` with staggered `fadeUp` variants (`hidden: { opacity: 0, y: 22 }`, `show: { opacity: 1, y: 0 }`)
    - Wrap `HeroCalendarWidget` in a `motion.div` using `useScroll`/`useTransform` for `translateY` parallax: translate from `0` to `60px` as the section scrolls out
    - All motion components stay in this single `'use client'` file
    - _Requirements: 5.5, 5.7_

- [ ] 5. Create `WorkflowSection` — sticky scroll with step mockups
  - [ ] 5.1 Create step mockup sub-components inside `components/WorkflowSection.tsx`
    - `BookingMockup`: form card showing Service, Date, Time fields; green accent on button/badge; green `#4caf50` replaces all `blue-600` / `blue-400` references from the prototype
    - `CalendarMockup`: week calendar card with a new booking highlighted in green; green replaces blue
    - `LocationMockup`: map/location card with address and ETA; green accent
    - `ResultMockup`: before/after placeholder card with "Photos included" badge in green
    - All mockup cards use `rounded-2xl border border-white/8 bg-[#0D0D1A]` wrapper
    - _Requirements: 6.5, 1.4_

  - [ ] 5.2 Build the `WorkflowSection` sticky scroll layout
    - `'use client'` component; import `useScroll`, `useEffect`, `useState`, `motion` from `motion/react`
    - Section total height: `4 * 100vh` (`style={{ height: '400vh' }}`); inner container: `position: sticky; top: 0; height: 100vh`
    - Read step content from `STEPS` in `lib/content.ts` (titles, descriptions); pair each with its mockup component
    - Track `activeStep` (0–3) via `scrollYProgress.on('change', ...)` using `useScroll` targeted at the section container
    - Active step row: `bg-white/4 border-white/10` card highlight; inactive rows: opacity fade
    - Render active step description with `motion.div` `height: auto` animation
    - Render `WorkflowProgressBar` sub-component with 4 bars; filled bars use `bg-[#4caf50]`, empty use `bg-white/10`; add `data-bar` attribute to each bar element
    - Right panel: display the mockup for `activeStep` with a cross-fade transition
    - On mobile (`< 768px`): collapse to single-column stacked list, hide sticky scroll behavior
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 16.2_

  - [ ] 5.3 Create `WorkflowSectionStatic` fallback and loader
    - `WorkflowSectionStatic`: a server-compatible component (no client hooks) that renders all four steps expanded, first step visually active; same content from `STEPS`
    - Create `components/WorkflowSectionLoader.tsx` mirroring the `ProcessSectionLoader` pattern: use `next/dynamic` with `ssr: false` and `loading: () => <WorkflowSectionStatic />`
    - _Requirements: 6.7_

- [ ] 6. Create `FeaturesGrid` section
  - [ ] 6.1 Create `components/FeaturesGrid.tsx`
    - `'use client'` component (needed for `FadeUpWhenVisible`)
    - Six Atlas feature cards with `lucide-react` icons: Mobile Service (`Car`, col-span-2), Fully Insured (`Shield`, col-span-1), Online Booking (`Calendar`, col-span-1), Instant Confirmation (`Bell`, col-span-1), Before & After Photos (`Camera`, col-span-1), 5-Star Rated (`Star`, col-span-2)
    - Grid: `grid grid-cols-3` on desktop, `grid-cols-1` on mobile
    - Each card: `rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4 transition-all relative overflow-hidden`
    - Hover radial gradient overlay: `pointer-events-none` absolute div with `radial-gradient(circle at 50% 0%, #4caf5008, transparent 70%)`; toggle visibility on mouse enter/leave
    - Wrap each card in `<FadeUpWhenVisible delay={i * 0.06}>`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 16.4_

- [ ] 7. Create `StatsBar` section
  - [ ] 7.1 Create `components/StatsBar.tsx`
    - `'use client'` component
    - Three stats: `{ target: 47, format: v => \`\${v}+\`, label: 'Google reviews', sub: '5.0 average rating' }`, `{ target: 50, format: v => \`\${(v / 10).toFixed(1)}★\`, label: 'Star rating', sub: 'Across all reviews' }`, `{ target: 0, format: () => 'Atlanta metro', label: 'Service area', sub: 'Mobile — we come to you' }` (note: third stat is non-numeric, render statically)
    - Use `useInView({ once: true, margin: '-80px' })` from `motion/react` to trigger count-up; pass `active` to `useCountUp`
    - Layout: `border-y border-white/6`, `grid grid-cols-1 md:grid-cols-3`, `divide-y md:divide-y-0 md:divide-x divide-white/6`
    - Stat value: `font-mono text-4xl font-bold text-white`; sub-label: `text-sm text-white/40`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 16.5_

- [ ] 8. Restyle `ServicesSection` — preserve all data logic, update card styles
  - [ ] 8.1 Add a thin `ServiceCardAnimated` client wrapper and restyle service cards
    - Create `components/ServiceCardAnimated.tsx` as a `'use client'` component that wraps children in `<FadeUpWhenVisible>`
    - In `ServicesSection.tsx` (which remains an async RSC), import `ServiceCardAnimated` and wrap each `<article>` in it
    - Update `<article>` className to `rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4 transition-all` (keep existing `service-card` class for structural CSS that still applies)
    - Update section eyebrow to match pattern: `font-mono text-[10px] uppercase tracking-[0.2em] text-[#4caf50]`
    - Update section heading to `text-4xl lg:text-5xl font-bold tracking-tight`
    - Preserve `fetchPackages`, fallback to `FALLBACK_SERVICES`, `ServicesFallbackNotice`, `barFill` bar, "Most popular" badge, all button links — no changes to server logic
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 9. Restyle `ProcessSection` — CSS-only, GSAP untouched
  - [ ] 9.1 Update process step card styles in `globals.css`
    - Scope all changes to `.process-section` rules only
    - Update `.process-section .process-step` to add `background: rgba(255,255,255,0.02)`, `border: 0.5px solid rgba(255,255,255,0.06)`, `border-radius: 16px`, `padding: 16px`
    - Update section eyebrow and headline pattern: add utility classes to the eyebrow `<p>` in `ProcessSection.tsx` for `font-mono text-[10px] uppercase tracking-[0.2em]`
    - Do NOT modify any GSAP logic, refs, scroll trigger setup, or the car/pin animation in `ProcessSection.tsx`
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 10. Restyle `ReviewsSection` — lucide-react stars and FadeUpWhenVisible
  - [ ] 10.1 Update `ReviewsSection.tsx` with new card styles, star icons, and entrance animations
    - Add `'use client'` directive (required for `FadeUpWhenVisible`)
    - Replace `★★★★★` text with five `<Star size={12} className="fill-[#4caf50] text-[#4caf50]" />` from `lucide-react`; set `aria-label="5 out of 5 stars"` on the wrapper span
    - Update `<article>` className to `rounded-2xl border border-white/6 bg-white/2 p-6`
    - Wrap each `<article>` in `<FadeUpWhenVisible delay={i * 0.1}>`
    - Restyle section eyebrow and heading to match SaaS heading pattern
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 11. Restyle `CtaBanner` — rounded card, radial glow, badge, green button glow
  - [ ] 11.1 Update `CtaBanner.tsx` with SaaS card layout
    - The `<div className="cta-banner">` wrapper: replace with `rounded-3xl border border-white/8 relative overflow-hidden`
    - Add a `pointer-events-none` absolute div as a radial glow: `background: radial-gradient(ellipse at 50% 0%, rgba(76,175,80,0.18), transparent 60%)`
    - Add a `pointer-events-none` absolute div as a grid texture overlay
    - Add inline badge above headline: mono pill `"Available 7 days a week · Atlanta metro"` with green pulse dot
    - Headline: `text-4xl lg:text-6xl font-bold tracking-tight`
    - Primary button: add `style={{ boxShadow: '0 0 24px rgba(76,175,80,0.4)' }}`
    - Preserve "Book now" and "Get in touch" button hrefs and all existing logic
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 12. Restyle `SiteFooter` — multi-column grid layout
  - [ ] 12.1 Update `SiteFooter.tsx` with multi-column grid
    - Change `.footer .container` layout to `grid grid-cols-2 md:grid-cols-[1fr_auto_auto] gap-12`
    - Brand column: `BusinessLogo` + business name + tagline `"Premium mobile car detailing · Atlanta, GA"` in `text-xs text-white/30`
    - Nav links column: existing `NAV_LINKS`
    - Social/legal column: Instagram handle + personal site attribution
    - Bottom row: copyright in `font-mono text-white/20`
    - Top divider: keep existing `border-t` but update to `border-t border-white/6`
    - Preserve all data from `lib/content.ts`; no logic changes
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 13. Restyle Contact and Services sub-pages
  - [ ] 13.1 Update `app/contact/page.tsx` card panel styles
    - Replace `.card-raised` className on the contact panel div with `rounded-2xl border border-white/6 bg-white/2 p-6`
    - Restyle eyebrow and heading using SaaS heading pattern (same as other sections)
    - Preserve `export const dynamic = 'force-dynamic'`, all `fetchBusinessInfo()` logic, conditional phone/email display, and fallback messaging
    - _Requirements: 14.1, 14.3_

  - [ ] 13.2 Update `app/services/page.tsx` card grid styles
    - Update `<article>` className to `rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4`
    - Restyle eyebrow and heading to match SaaS heading pattern
    - Preserve `export const dynamic = 'force-dynamic'`, all `fetchPackages()` logic, error banner, fallback notice, and `barFill`-less catalog layout
    - _Requirements: 14.2, 14.3_

- [ ] 14. Update `app/page.tsx` — add new sections in correct order
  - [ ] 14.1 Wire new sections into homepage
    - Import `WorkflowSectionLoader` from `@/components/WorkflowSectionLoader`
    - Import `FeaturesGrid` from `@/components/FeaturesGrid`
    - Import `StatsBar` from `@/components/StatsBar`
    - Update `HomePage` render order to: `HeroSection` → `WorkflowSectionLoader` → `FeaturesGrid` → `StatsBar` → `ServicesSection` → `ProcessSectionLoader` → `ReviewsSection` → `CtaBanner`
    - Remove `GallerySection` import and usage (it's not part of the new section order per the design)
    - _Requirements: 6.1, 7.1, 8.1_

- [ ] 15. Checkpoint — verify build passes
  - Run `next build` (uses Turbopack by default in Next.js 16); fix any TypeScript errors or import issues before proceeding to tests.
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Install fast-check and write property-based tests
  - [ ] 16.1 Install fast-check
    - Run `npm install -D fast-check`
    - Create `__tests__/` directory at the project root if it doesn't exist
    - _Requirements: (test infrastructure)_

  - [ ]* 16.2 Write property test for booking URL round-trip (Property 1)
    - File: `__tests__/booking-url.property.test.ts`
    - Import `bookingPageUrl` from `@/lib/api`; use `fc.string` generators filtered to valid ISO date (`YYYY-MM-DD`) and time (`HH:MM`) shapes
    - Assert: for any valid `(date, time)`, parsing the resulting URL's `searchParams` returns the original `date` and `time` unchanged
    - Run minimum 100 iterations (`numRuns: 100`)
    - **Property 1: Booking URL parameters are round-tripped correctly**
    - **Validates: Requirements 5.6 (bookingPageUrl param preservation)**
    - _Requirements: 15.1_

  - [ ]* 16.3 Write property test for WorkflowSection content from STEPS (Property 2)
    - File: `__tests__/workflow-section.property.test.ts`
    - For any `stepIndex` in [0, 3]: render `WorkflowSection` with an `activeStepOverride` prop exposed for testing; assert that `STEPS[stepIndex].title` and `STEPS[stepIndex].desc` are present in rendered output
    - Add `activeStepOverride?: number` prop to `WorkflowSection` (used only when defined; bypasses scroll-driven active step)
    - Run minimum 100 iterations
    - **Property 2: Workflow section renders content from STEPS array**
    - **Validates: Requirements 6.3**

  - [ ]* 16.4 Write property test for progress bar monotonicity (Property 3)
    - File: `__tests__/workflow-progress.property.test.ts`
    - Export `WorkflowProgressBar` as a named export from `WorkflowSection.tsx`
    - For any `activeStep` in [0, 3]: render `<WorkflowProgressBar activeStep={activeStep} totalSteps={4} />`; query all `[data-bar]` elements; assert that bar at index `j` has class `bg-[#4caf50]` when `j <= activeStep` and does not when `j > activeStep`
    - Run minimum 100 iterations
    - **Property 3: Progress indicator fill is monotonically correct**
    - **Validates: Requirements 6.6**

  - [ ]* 16.5 Write property test for count-up interpolation bounds (Property 4)
    - File: `__tests__/count-up.property.test.ts`
    - Extract the easing function `(p: number) => 1 - Math.pow(1 - p, 3)` into a testable export in `hooks/useCountUp.ts` (e.g. `export const easeOut = ...`)
    - For any `target >= 0` and any two progress ratios `p1 <= p2` in [0, 1]: assert `0 <= v1 <= v2 <= target` where `v = Math.round(easeOut(p) * target)`
    - Run minimum 100 iterations
    - **Property 4: Count-up interpolation stays in bounds and is non-decreasing**
    - **Validates: Requirements 8.2**

- [ ] 17. Final checkpoint — full build and test run
  - Run `next build` and confirm zero TypeScript errors and zero build warnings related to this feature.
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery.
- Tailwind v4 uses a CSS-first config — there is no `tailwind.config.js`. All theme tokens go in `@theme {}` inside `globals.css`.
- GSAP logic in `ProcessSection.tsx` must not be modified; CSS-only restyle in task 9.1.
- `WorkflowSectionLoader` follows the same `next/dynamic` + `ssr: false` pattern as `ProcessSectionLoader`.
- All `motion/react` components must have `'use client'` at the top; RSC files (`ServicesSection`, `SiteFooter`, sub-pages) stay server components.
- Property tests (16.2–16.5) require a test runner with TypeScript support (Jest or Vitest); set up whichever matches the project's toolchain.
- `GallerySection` (currently in `CtaBanner.tsx`) is removed from the homepage per the new section order in the design doc. Its code can remain in `CtaBanner.tsx` but should not be imported in `page.tsx`.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2"] },
    { "id": 3, "tasks": ["3.1", "4.1"] },
    { "id": 4, "tasks": ["4.2", "5.1", "6.1", "7.1"] },
    { "id": 5, "tasks": ["5.2", "8.1", "9.1", "10.1", "11.1", "12.1"] },
    { "id": 6, "tasks": ["5.3", "13.1", "13.2"] },
    { "id": 7, "tasks": ["14.1"] },
    { "id": 8, "tasks": ["16.1"] },
    { "id": 9, "tasks": ["16.2", "16.3", "16.4", "16.5"] }
  ]
}
```
