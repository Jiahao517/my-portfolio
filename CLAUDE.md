# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js, localhost:3000)
npm run build        # Production build (outputs standalone)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run check        # lint + typecheck + build (run before committing)
```

Node ≥ 24 required (see `.nvmrc`).

## Environment Variables

```
OPENAI_API_KEY   # Required for ContactAI chat to use GPT-4.1; without it the API returns a demo fallback
```

## Architecture

Single-page portfolio with a fixed sidebar (desktop) and mobile header. Content flows as a vertical stack of full-width sections inside `<main class="content">`.

**Routing:**
- `/` — main portfolio (all sections on one page)
- `/workflow` and `/faq` — stub pages linked from the footer, not yet content-filled
- `/api/chat` — POST endpoint powering the ContactAI chat widget; streams SSE from OpenAI with in-memory rate limiting (10 req / 5 min / IP)

**Section structure (`src/app/page.tsx`):**
```
MobileHeader / Sidebar (navigation chrome)
HeroVideo → HeroBio → SocialProof → CaseStudies
Experience → CtaBlock → About → ContactAI → ArtFooter
RevealController (no DOM output, attaches IntersectionObserver)
```

**Data layer (`src/data/`):**
All portfolio content is plain TypeScript files — no CMS or database. Edit these to update content:
- `persona.ts` — name, bio, highlights, expertise; also exports `buildSystemPrompt()` used by `/api/chat`
- `case-studies.ts`, `experience.ts`, `publications.ts`, `testimonials.ts`

**Types (`src/types/portfolio.ts`):** shared types for all data objects (`CaseStudy`, `ExperienceRow`, `Testimonial`, etc.).

## Styling

All layout and design tokens live in `src/app/globals.css` using raw CSS (not Tailwind utility classes for the site's own styles). Tailwind v4 is used only for shadcn/ui components in `src/components/ui/`.

Key CSS variables to know:
- `--accent` / `--accent-hover` — primary brand red (`#E0465C` / `#B43145`)
- `--sidebar-width: 192px`, `--topnav-height: 64px`, `--content-max: 1080px`
- Easing curves: `--ease-out-spring`, `--ease-out-back`, `--ease-out-quart` (defined in `:root`)

**Scroll reveal pattern:** Add class `reveal-scroll` to any element; `RevealController` adds `reveal-scroll--visible` when it enters the viewport. Load animations use `reveal-load` / `reveal-load--active`.

**Fonts:**
- `--font-inter` (body/UI), `--font-manrope` (headings), `--font-cormorant` (display/serif accents)
- All loaded via `next/font/google` in `layout.tsx`

## shadcn/ui

Config in `components.json`. Style: `base-nova`, base color: `neutral`, CSS variables enabled. Add new components with:
```bash
npx shadcn add <component>
```
Components land in `src/components/ui/`.
