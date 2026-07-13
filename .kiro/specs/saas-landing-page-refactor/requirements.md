# Requirements Document

## Introduction

This feature refactors the Atlas Detailing Next.js website to adopt the visual design language of the "Premium SaaS Landing Page" Figma prototype. The refactor brings the dark-themed, motion-rich SaaS aesthetic (dark background, micro-card layouts, large bold typography, scroll-driven animations, animated UI mockups) into the existing Next.js codebase while substituting the design's blue primary color with the site's existing green (#4caf50). All live functionality — the availability calendar widget, booking redirect flow, API-backed services list, contact page, reviews section, GSAP process animation, Sentry error tracking, and PostHog analytics — must be preserved and migrated into the new layout.

The Figma prototype (a static Vite + Tailwind app) is used as a visual reference only. Its dependencies (motion/react, lucide-react, Radix UI, shadcn/ui components, Tailwind CSS) must be selectively adopted into the existing Next.js project rather than porting the Vite app wholesale.

---

## Glossary

- **Detailing_Website**: The existing Next.js 16 application at `/Users/danny/Projects/Detailing/detailing-website/`.
- **Figma_Prototype**: The static Vite + Tailwind app at `/Users/danny/Downloads/Premium SaaS Landing Page Design/` used as the visual design reference.
- **Green_Theme**: The brand color palette anchored by `#4caf50` (CSS variable `--green`), currently used throughout the Detailing_Website.
- **Blue_Primary**: The `#1468FF` / `blue-600` accent used throughout the Figma_Prototype, which SHALL be replaced by Green_Theme in all migrated components.
- **Hero_Calendar_Widget**: The interactive calendar + time-slot picker component currently in `HeroSection.tsx` that calls the live availability API.
- **Booking_API**: The public HTTP API hosted by the operator app (`NEXT_PUBLIC_APP_API_URL`), accessed via `lib/api.ts`, providing packages, availability slots, and booking submission.
- **Workflow_Section**: The scroll-driven sticky section from the Figma_Prototype that displays step-by-step UI mockups as the user scrolls.
- **Features_Grid**: The bento-style feature card grid from the Figma_Prototype.
- **Stats_Bar**: The count-up animated statistics bar from the Figma_Prototype.
- **Process_Section**: The existing GSAP-animated car-on-track section in the Detailing_Website.
- **Framer_Motion**: The `motion/react` library used for animations in the Figma_Prototype.
- **Tailwind_CSS**: The utility-class CSS framework used in the Figma_Prototype, not currently installed in the Detailing_Website.
- **SaaS_Design_Language**: The visual style of the Figma_Prototype: near-black backgrounds (`#06060C`–`#111111`), white/8–white/10 card borders, `border-white/6` section dividers, large tight-tracked headings, mono font labels, `rounded-2xl` cards, subtle radial glow backgrounds, and grid overlay textures.

---

## Requirements

### Requirement 1: Adopt SaaS Design Language as the Visual Foundation

**User Story:** As a visitor, I want to see a premium dark SaaS aesthetic that conveys professionalism and polish, so that I trust Atlas Detailing with my vehicle.

#### Acceptance Criteria

1. THE Detailing_Website SHALL use a near-black base background (`#06060C` or equivalent) matching the Figma_Prototype's overall page background.
2. THE Detailing_Website SHALL replace all card backgrounds with semi-transparent white overlays (`rgba(255,255,255,0.02)–0.04`) and thin white/6–white/10 borders to match the SaaS_Design_Language card style.
3. THE Detailing_Website SHALL apply `rounded-2xl` (16px) border radius to all primary content cards.
4. THE Detailing_Website SHALL use the Green_Theme color (`#4caf50`) everywhere the Figma_Prototype uses Blue_Primary, including CTA buttons, active states, accent text, badge fills, and glow effects.
5. WHEN a section contains a heading, THE Detailing_Website SHALL apply a tight letter-spacing (`tracking-tight`) and font-weight of 700 or 800 to match the Figma_Prototype headline style.
6. THE Detailing_Website SHALL display eyebrow labels (section-level category tags) as `font-mono`, uppercase, `tracking-[0.2em]` text in Green_Theme color, matching the Figma_Prototype's `text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]` style.
7. THE Detailing_Website SHALL preserve existing CSS custom properties (`--green`, `--bg`, `--card`, `--font-head`, `--font-body`) and extend them as needed rather than replacing them with Tailwind utility classes alone.

---

### Requirement 2: Install and Configure Tailwind CSS

**User Story:** As a developer, I want Tailwind CSS available in the Next.js project, so that I can use the Figma_Prototype's Tailwind utility classes directly in migrated components without rewriting them to plain CSS.

#### Acceptance Criteria

1. THE Detailing_Website SHALL have Tailwind CSS v4 installed as a dev dependency, configured for Next.js using the `@tailwindcss/postcss` plugin.
2. WHEN Tailwind CSS is installed, THE Detailing_Website SHALL extend the Tailwind config to include Green_Theme as a named color token (e.g. `green.DEFAULT = #4caf50`) so that `text-green-500` and `bg-green-500` classes resolve to Green_Theme.
3. THE Detailing_Website SHALL import Tailwind base styles in `globals.css` so that Tailwind utilities are available globally without per-component imports.
4. IF a Tailwind utility class conflicts with an existing BEM-style CSS class in `globals.css`, THEN THE Detailing_Website SHALL resolve the conflict without removing existing class names that are referenced in preserved components.

---

### Requirement 3: Install Framer Motion and Lucide React

**User Story:** As a developer, I want `motion/react` and `lucide-react` available, so that I can port the Figma_Prototype's scroll-driven and entrance animations without rewriting them from scratch.

#### Acceptance Criteria

1. THE Detailing_Website SHALL have `motion` (the `motion/react` package, v12+) installed as a production dependency.
2. THE Detailing_Website SHALL have `lucide-react` installed as a production dependency.
3. WHEN `motion` components are used inside Next.js Server Components, THE Detailing_Website SHALL mark those files with `'use client'` to comply with the React Server Components constraint.
4. THE Detailing_Website SHALL preserve the existing GSAP dependency and the Process_Section animation; `motion/react` and GSAP SHALL coexist without conflict.

---

### Requirement 4: Refactor the Navigation Bar

**User Story:** As a visitor, I want a sticky navigation bar that matches the premium SaaS style and scrolls cleanly, so that I can access key pages from anywhere on the site.

#### Acceptance Criteria

1. THE SiteNav SHALL transition from a backdrop-blur border-bottom style to the Figma_Prototype's transparent-to-frosted-glass scroll transition: transparent at page top, `bg-[#06060C]/90 backdrop-blur-xl border-b border-white/6` once the user scrolls past 20px.
2. THE SiteNav SHALL retain all existing navigation links from `NAV_LINKS` in `lib/content.ts`.
3. THE SiteNav SHALL retain the "Book now" CTA button styled with Green_Theme fill.
4. THE SiteNav SHALL retain the mobile hamburger menu with the same open/close behavior.
5. WHEN the SiteNav logo area is rendered, THE SiteNav SHALL display the `BusinessLogo` component alongside the business name, maintaining the same branding.
6. THE SiteNav SHALL display desktop nav links in `text-white/45 hover:text-white` style matching the Figma_Prototype nav link style.

---

### Requirement 5: Refactor the Hero Section

**User Story:** As a visitor landing on the homepage, I want a visually dramatic hero section that immediately communicates what Atlas Detailing offers and makes booking effortless, so that I can understand the service and take action without scrolling.

#### Acceptance Criteria

1. THE HeroSection SHALL adopt the Figma_Prototype hero layout: full-viewport-height centered content with a radial glow background and a subtle grid texture overlay.
2. THE HeroSection SHALL display a centered announcement badge (e.g. "Now serving the Atlanta metro area") styled as a mono-font pill with a green pulse dot, matching the Figma_Prototype's badge component.
3. THE HeroSection SHALL display the headline as center-aligned, extra-large (responsive: `text-5xl` to `text-[80px]`), bold (`font-extrabold`), tight-tracked text with Green_Theme accent on a key word or phrase.
4. THE HeroSection SHALL display two CTA buttons centered below the headline: a primary "Book now" button with a Green_Theme fill and box-shadow glow, and a secondary "View services" ghost button.
5. THE HeroSection SHALL animate all headline, subtitle, badge, and CTA elements into view on page load using `motion/react` entrance animations (fade + slide up), matching the Figma_Prototype's staggered fade pattern.
6. THE HeroSection SHALL display the Hero_Calendar_Widget below the headline content, styled as a floating dark card consistent with the SaaS_Design_Language card style, preserving all existing calendar, slot-selection, and booking logic.
7. WHEN the Hero_Calendar_Widget is visible, THE HeroSection SHALL apply a parallax scroll effect (translateY) to the widget using `motion/react`'s `useScroll` and `useTransform`, matching the Figma_Prototype's dashboard mockup scroll behavior.
8. THE HeroSection SHALL retain all trust-signal chips ("5.0 · 47 reviews", "Fully insured", "Mobile service") displayed below the CTAs.

---

### Requirement 6: Add the Workflow Section

**User Story:** As a prospective customer, I want to understand the step-by-step detailing process in an engaging visual format, so that I can trust that Atlas Detailing has a professional and organized workflow.

#### Acceptance Criteria

1. THE Detailing_Website SHALL include a new Workflow_Section on the homepage, positioned after the Hero_Section and before the Features_Grid section.
2. THE Workflow_Section SHALL implement the Figma_Prototype's sticky scroll pattern: the section height equals `(number_of_steps × 100vh)`, the inner content is `position: sticky; top: 0; height: 100vh`, and the active step advances as the user scrolls.
3. THE Workflow_Section SHALL display exactly four steps adapted for Atlas Detailing's booking process: (1) Customer books online, (2) We confirm your appointment, (3) We come to you, (4) Enjoy the result — matching content from the existing `STEPS` array in `lib/content.ts`.
4. WHEN a step becomes active, THE Workflow_Section SHALL animate the step description into view and highlight the step row with a `bg-white/4 border-white/10` card background.
5. THE Workflow_Section SHALL render a contextual UI mockup panel on the right side for each step (e.g. a booking form card for step 1, a calendar card for step 2, a map/location card for step 3, a before/after result card for step 4), adapted with Green_Theme color accents and Atlas Detailing content.
6. THE Workflow_Section SHALL display a segmented progress indicator (one bar per step) below the step list, filling completed steps with Green_Theme color.
7. IF JavaScript is disabled or the client has `prefers-reduced-motion: reduce`, THEN THE Workflow_Section SHALL display all four steps statically with the first step active by default.

---

### Requirement 7: Add the Features Grid Section

**User Story:** As a prospective customer, I want to see a clear overview of what makes Atlas Detailing's service distinct, so that I can quickly evaluate whether the service meets my needs.

#### Acceptance Criteria

1. THE Detailing_Website SHALL include a Features_Grid section on the homepage, positioned after the Workflow_Section.
2. THE Features_Grid SHALL display six feature cards adapted to Atlas Detailing: Mobile Service, Fully Insured, Online Booking, Instant Confirmation, Before & After Photos, and 5-Star Rated — replacing the Figma_Prototype's SaaS platform features.
3. THE Features_Grid SHALL use the Figma_Prototype's bento grid layout: a `grid-cols-3` arrangement on desktop where two cards span `col-span-2` and the rest span `col-span-1`.
4. WHEN a feature card is hovered, THE Features_Grid SHALL display a radial gradient overlay using Green_Theme color (`radial-gradient(... #4caf5008, transparent)`), matching the Figma_Prototype's hover effect.
5. THE Features_Grid SHALL use `FadeUpWhenVisible` entrance animations (fade + slide up, staggered per card) using `motion/react`.
6. THE Features_Grid SHALL use `lucide-react` icons appropriate to each feature.

---

### Requirement 8: Add the Stats Bar Section

**User Story:** As a prospective customer, I want to see concrete numbers that validate Atlas Detailing's reputation, so that I feel confident choosing this service.

#### Acceptance Criteria

1. THE Detailing_Website SHALL include a Stats_Bar section on the homepage, positioned after the Features_Grid.
2. THE Stats_Bar SHALL display at least three statistics relevant to Atlas Detailing (e.g. total reviews, star rating, service area, years in operation) with an animated count-up effect that triggers when the section scrolls into view.
3. THE Stats_Bar SHALL use the `useInView` hook from `motion/react` to trigger the count-up animation exactly once per page load.
4. THE Stats_Bar SHALL be styled with `border-y border-white/6` top and bottom dividers and a `divide-white/6` vertical divider between stat columns, matching the Figma_Prototype Stats_Bar layout.
5. THE Stats_Bar stat values SHALL be displayed using a monospace font (`font-mono`) in large bold white text, with a smaller muted sub-label beneath each.

---

### Requirement 9: Preserve and Restyle the Services Section

**User Story:** As a prospective customer, I want to browse available detailing packages with up-to-date pricing, so that I can choose the right service before booking.

#### Acceptance Criteria

1. THE ServicesSection SHALL retain all existing API integration logic: server-side `fetchPackages()` call, fallback to `FALLBACK_SERVICES`, and the `ServicesFallbackNotice` component when live data is unavailable.
2. THE ServicesSection SHALL restyle service cards to use the SaaS_Design_Language: `rounded-2xl`, `border border-white/6`, `bg-white/2 hover:bg-white/4` backgrounds, and Green_Theme accent for prices and icons.
3. THE ServicesSection SHALL preserve the `barFill` popularity indicator bar for each service.
4. THE ServicesSection SHALL preserve the "Most popular" badge on the first service.
5. THE ServicesSection section heading and eyebrow SHALL be restyled to match the Figma_Prototype's `text-4xl lg:text-5xl font-bold tracking-tight` heading style with a mono-font eyebrow label.
6. THE ServicesSection SHALL add `FadeUpWhenVisible` entrance animations to the section heading and each service card using `motion/react`.

---

### Requirement 10: Preserve and Restyle the Reviews Section

**User Story:** As a prospective customer, I want to read authentic testimonials, so that I can trust the quality of Atlas Detailing's work.

#### Acceptance Criteria

1. THE ReviewsSection SHALL retain the existing `REVIEWS` data array from `lib/content.ts`.
2. THE ReviewsSection SHALL restyle review cards to match the Figma_Prototype's testimonial card style: `rounded-2xl border border-white/6 bg-white/2 p-6`, with star ratings shown in Green_Theme color.
3. THE ReviewsSection SHALL replace the plain star text (`★★★★★`) with `lucide-react` `Star` icons filled with Green_Theme color to match the Figma_Prototype's star rendering.
4. THE ReviewsSection SHALL add `FadeUpWhenVisible` staggered entrance animations to each review card using `motion/react`.
5. THE ReviewsSection section heading and eyebrow SHALL be restyled to match the Figma_Prototype testimonials section's heading style.

---

### Requirement 11: Preserve and Restyle the Process Section

**User Story:** As a prospective customer, I want to understand the four-step detailing workflow in an engaging animated format, so that I trust the operational clarity of Atlas Detailing.

#### Acceptance Criteria

1. THE Process_Section SHALL be retained on the homepage with all GSAP scroll-trigger animations fully functional (car animation, pin reveals, step fade-ins).
2. THE Process_Section visual wrapper SHALL be restyled to match the SaaS_Design_Language: section background consistent with the page background, track area border color using Green_Theme.
3. THE Process_Section step cards SHALL be restyled to use `rounded-2xl border border-white/6 bg-white/2` card styles instead of the current `--card` solid background.
4. THE Process_Section eyebrow and heading SHALL be restyled using the mono-font eyebrow and large bold heading pattern from the Figma_Prototype.

---

### Requirement 12: Restyle the CTA Banner Section

**User Story:** As a visitor who has reviewed the services, I want a clear and compelling call-to-action, so that I know exactly how to proceed with booking.

#### Acceptance Criteria

1. THE CtaBanner SHALL adopt the Figma_Prototype CTASection layout: a `rounded-3xl border border-white/8` card with a radial gradient glow from the top using Green_Theme, and a subtle grid texture overlay.
2. THE CtaBanner SHALL include an inline badge ("Available 7 days a week · Atlanta metro") styled as a mono-font pill with a green pulse dot, matching the Figma_Prototype's CTA badge.
3. THE CtaBanner headline SHALL be styled as `text-4xl lg:text-6xl font-bold tracking-tight`.
4. THE CtaBanner SHALL retain the "Book now" and "Get in touch" action buttons, with the primary button styled with Green_Theme fill and a box-shadow glow.

---

### Requirement 13: Restyle the Footer

**User Story:** As a visitor at the bottom of the page, I want quick access to navigation links and business information, so that I can find what I need without scrolling back up.

#### Acceptance Criteria

1. THE SiteFooter SHALL adopt the Figma_Prototype Footer layout: a multi-column grid with a brand column and grouped link columns, separated by a `border-t border-white/6` top divider.
2. THE SiteFooter SHALL retain all existing nav links from `NAV_LINKS`, the Instagram handle, the copyright notice, and the personal site attribution from `lib/content.ts`.
3. THE SiteFooter SHALL add a brief tagline beneath the business name ("Premium mobile car detailing · Atlanta, GA") styled as `text-xs text-white/30`.
4. THE SiteFooter brand column SHALL display the `BusinessLogo` component and business name.
5. THE SiteFooter bottom row SHALL display the copyright and attribution in `font-mono text-white/20` style matching the Figma_Prototype footer legal line.

---

### Requirement 14: Restyle the Contact and Services Sub-Pages

**User Story:** As a visitor navigating to the Contact or Services detail pages, I want a visual experience consistent with the homepage redesign, so that the site feels cohesive.

#### Acceptance Criteria

1. THE Contact_Page (`/contact`) SHALL be restyled with a `rounded-2xl border border-white/6 bg-white/2` card panel and SaaS_Design_Language typography, preserving all existing `fetchBusinessInfo()` API integration and conditional display logic.
2. THE Services_Page (`/services`) SHALL be restyled with the same card grid style as the restyled homepage ServicesSection, preserving all `fetchPackages()` API integration, fallback notice, and error banner.
3. WHEN the Contact_Page or Services_Page is loaded, THE Detailing_Website SHALL preserve the `export const dynamic = 'force-dynamic'` directive to maintain server-side rendering behavior.

---

### Requirement 15: Preserve All API Integrations and Instrumentation

**User Story:** As the site operator, I want all backend integrations, error tracking, and analytics to remain fully functional after the visual refactor, so that no business or operational data is lost.

#### Acceptance Criteria

1. THE Detailing_Website SHALL preserve the `bookingPageUrl()`, `fetchPackages()`, `fetchAvailability()`, `fetchBusinessInfo()`, and `submitBooking()` functions in `lib/api.ts` without modification.
2. THE Detailing_Website SHALL preserve the Sentry configuration in `sentry.client.config.ts`, `sentry.server.config.ts`, and `instrumentation.ts` without modification.
3. THE Detailing_Website SHALL preserve the `PostHogInit` component and its placement in `app/layout.tsx` without modification.
4. THE Detailing_Website SHALL preserve the `BusinessLogo` dynamic image component that fetches from `businessLogoUrl()`.
5. THE Detailing_Website SHALL preserve the `/book` page redirect logic in `app/book/page.tsx` without modification.
6. WHEN an API call fails (packages, availability, or business info), THE Detailing_Website SHALL continue to display fallback content as per existing error handling, with no regression in error state UX.

---

### Requirement 16: Maintain Responsive Layout and Accessibility

**User Story:** As a visitor on a mobile device, I want the redesigned site to remain fully usable on small screens, so that I can book a detail from my phone.

#### Acceptance Criteria

1. THE Detailing_Website SHALL maintain a functional, readable layout on viewport widths from 320px to 1440px+.
2. THE Workflow_Section sticky scroll animation SHALL degrade gracefully on mobile: on viewports narrower than 768px the section SHALL display steps in a vertical stacked list without the sticky scroll behavior.
3. THE HeroSection on mobile SHALL stack the headline and CTA above the Hero_Calendar_Widget in a single column.
4. THE Features_Grid on mobile SHALL collapse to a single column (`grid-cols-1`).
5. THE Stats_Bar on mobile SHALL stack stat columns vertically with `divide-y divide-white/6` dividers.
6. ALL interactive elements (buttons, calendar days, time slots) SHALL have a minimum tap target of 44×44px.
7. ALL images and icon-only buttons SHALL include descriptive `alt` or `aria-label` attributes.
8. WHERE motion animations are present, THE Detailing_Website SHALL respect `prefers-reduced-motion: reduce` by disabling or reducing animations.
