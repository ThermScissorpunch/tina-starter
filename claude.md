# WSNL Blog — TinaCMS + Next.js

## Project Overview

Dutch fashion/luxury lifestyle blog (WSNL) for Winkelstraat.nl, built with Next.js 14 (App Router) and TinaCMS as headless CMS. Content is managed via TinaCMS Cloud and stored as markdown files in `content/`.

**Live URL:** https://www.winkelstraat.nl/features
All blog posts are served under `https://www.winkelstraat.nl/features/{slug}`.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **CMS:** TinaCMS (cloud-hosted, markdown-based)
- **Styling:** Tailwind CSS 3 + `@tailwindcss/typography` + `class-variance-authority` + `tailwind-merge`
- **Fonts:** Inter (sans), Nunito, Lato via `next/font/google`
- **Icons:** `react-icons`
- **Theme:** Dark/light mode via `next-themes` (class-based)
- **Package Manager:** pnpm

## Project Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout (fonts, theme, global query)
  [...filename]/        # Dynamic page routes (CMS pages)
  posts/                # Blog post routes
    [...filename]/      # Dynamic post routes
components/
  blocks/               # Page builder blocks (hero, content, features, testimonial)
  layout/               # Layout components (container, section)
  nav/                  # Navigation (header, footer)
content/
  posts/                # Blog post markdown files
  authors/              # Author data
  global/               # Global site config (nav, footer, theme)
  pages/                # CMS-managed pages
tina/
  config.tsx            # TinaCMS configuration
  collection/           # Collection schemas (post, page, author, global)
  __generated__/        # Auto-generated TinaCMS client & types
public/uploads/         # Media uploads (images)
```

## Key Commands

```bash
pnpm dev               # Start dev server with TinaCMS (tinacms dev -c "next dev")
pnpm build             # Production build (tinacms build && next build)
pnpm build-local       # Local build without cloud (--local --skip-indexing)
pnpm lint              # ESLint
```

## Content Model

### Blog Posts (`tina/collection/post.ts`)
- Fields: category, manufacturerCodes, categoryCodes, title, slug, heroImg, productListImg, excerpt, description (meta), lastUpdated, author (reference), date, body (rich-text)
- Categories: Blogs, Editorials, Collaborations, Interviews, Podcasts, New Drops, News
- Stored as `.md` files in `content/posts/`
- Live URL: `https://www.winkelstraat.nl/features/{slug}`
- Internal app route: `/posts/{slug}` (mapped to `/features/` on the live site)

### Pages (`tina/collection/page.ts`)
- Block-based pages with components: hero, content, features, testimonial
- Routes via `app/[...filename]/`

## Conventions

- Content is in Dutch (nl)
- Blog posts use markdown with TinaCMS rich-text templates (DateTime, BlockQuote)
- **Internal links in content must use `/features/{slug}`, not `/posts/{slug}`** — the live site serves all posts under `/features/`
- Canonical URLs and schema markup use `https://www.winkelstraat.nl/features/{slug}`
- **No external links** — blog content must never link to external websites. The only exceptions are our own social accounts (Instagram, YouTube, TikTok)
- Images go in `public/uploads/` and are referenced in frontmatter
- The `/` route rewrites to `/home` (see `next.config.js`)
- The `/admin` route serves the TinaCMS admin panel
- Remote images allowed from `assets.tina.io`
- The `tina/__generated__/` directory is auto-generated — do not edit manually

## Environment Variables

- `NEXT_PUBLIC_TINA_CLIENT_ID` — TinaCMS client ID
- `NEXT_PUBLIC_TINA_BRANCH` — Git branch override
- `TINA_TOKEN` — TinaCMS API token
