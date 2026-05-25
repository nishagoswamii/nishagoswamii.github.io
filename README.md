
# Portfolio Website (Astro)

Personal portfolio built with Astro, React, and Tailwind CSS.

- Live site: https://www.nishagoswami.com
- Local dev URL: http://localhost:4321

## Tech stack

- Astro 4
- React 18
- Tailwind CSS
- Radix UI components + shadcn/ui-style primitives

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```sh
git clone <YOUR_REPO_URL>
cd my-portfolio
npm install
```

### Run locally

```sh
npm run dev
```

## Scripts

```sh
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the build locally
```

## Customize content

Most site content is driven from `src/data/*` and Markdown in `src/content/*`.

- Site metadata (title, description, social links): `src/data/config.ts`
- Hero section (name/title/skills/links): `src/data/heroData.ts`
- Experience section: `src/data/experienceData.ts`
- Projects / portfolio feed: `src/data/portfolioData.ts`
- Footer links: `src/data/footerData.ts`

### Blog + reviews

- Blog posts: `src/content/blog/*.md`
- Reviews: `src/content/reviews/*.md`
- Collection schema: `src/content/config.ts`

### Images

- Static assets live in `public/`
- Profile/portfolio images are in `public/Images/`

## Project structure (high level)

- `src/pages/` — route entry points (e.g. home, blog)
- `src/components/` — React + Astro UI components
- `src/layouts/` — page layouts
- `src/styles/` — global styles
- `src/data/` — data/config objects that power sections

## Deployment

This is a standard Astro static build:

```sh
npm run build
```

The output is written to `dist/`. The canonical site URL is configured in `astro.config.mjs`.

## License

MIT — see `LICENSE`.



