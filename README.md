# nishagoswami.com

Personal site built with Astro, React, Tailwind CSS and Three.js.

Live: https://www.nishagoswami.com

## Requirements

- Node.js 20+
- npm

## Setup

```sh
git clone https://github.com/nishagoswamii/nishagoswamii.github.io.git
cd nishagoswamii.github.io
npm install
npm run dev
```

Open http://localhost:4321.

## Scripts

| Command           | Action                          |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the dev server            |
| `npm run build`   | Build the site into `dist/`     |
| `npm run preview` | Serve the built site locally    |

## Pages

| Route              | Source                                                     |
| ------------------ | ---------------------------------------------------------- |
| `/`                | `src/pages/index.astro`                                    |
| `/projects`        | `src/pages/projects.astro`                                 |
| `/blog`            | `src/pages/blog/index.astro`                               |
| `/blog/<slug>`     | `src/pages/blog/[...slug].astro`                           |
| `/blog/my-journey` | About page, rendered by `src/components/PictureBook.astro` |

## Editing content

| What                             | Where                                |
| -------------------------------- | ------------------------------------ |
| Site title, description, socials | `src/data/config.ts`                 |
| Hero name and role               | `src/components/Hero.tsx`            |
| Experience                       | `src/data/experienceData.ts`         |
| Projects                         | `src/data/portfolioData.ts`          |
| Quotes                           | `src/data/quotes.ts`                 |
| Footer links                     | `src/data/footerData.ts`             |
| Blog posts                       | `src/content/blog/*.md`              |
| Books and movies                 | `src/content/reviews/*.md`           |
| Resume                           | `public/resume.pdf`                  |
| Avatar image                     | `public/Images/avatar/portrait.webp` |
| Comments (Giscus)                | `src/components/GiscusComments.tsx`  |

### Add an experience entry

Add an object to the `jobs` array in `src/data/experienceData.ts`. Keep the current role first.

```ts
{
  title: "Role",
  company: "Company",
  dates: "06/2026 - Present",
  description: ["One line about the work"],
  linkedInUrl: "https://..." // optional
}
```

### Add a project

1. Put screenshots in `public/Images/`.
2. Add an object to `projects` in `src/data/portfolioData.ts` with a unique `id`.
3. Wrap image paths in `withBase()`, e.g. `withBase("/Images/my-project.webp")`.

### Add a blog post

Create `src/content/blog/<slug>.md`:

```md
---
title: "Post title"
description: "One-line summary"
pubDate: "2026-11-06"
tags: ["Tag"]
draft: false
---

Post body.
```

The home page shows the three newest posts. Set `draft: true` to hide a post.

### Add a book or movie

1. Put the cover in `public/Images/books/` or `public/Images/movies/`.
2. Create `src/content/reviews/<slug>.md`:

```md
---
title: "Deep Work"
type: "book"            # book | movie
status: "completed"     # reading | watching | completed | dropped | plan_to_read | plan_to_watch
cover: "/Images/books/deep-work.webp"
author: "Cal Newport"   # use director for movies
rating: 4               # optional, 1-5
pubDate: "2026-11-06"   # optional
---

Optional short note.
```

Items with `reading` or `watching` status appear first on the shelf.

### Edit the About page

The About page reads its text from `src/content/blog/my-journey.md`. `PictureBook.astro` places paragraphs by position, so adding or removing a paragraph requires a matching change in that component.

## Asset paths

PR previews are served from a subpath, so component code must not hardcode root paths. Use the helper:

```ts
import { withBase } from '@/lib/utils';
withBase('/Images/photo.webp');
```

Markdown frontmatter paths such as `cover` stay root-relative (`/Images/...`); the components apply `withBase()` to them.

To test a subpath build locally:

```sh
BASE_PATH=/pr-previews/1/ npm run build
BASE_PATH=/pr-previews/1/ npm run preview
```

Then open http://localhost:4321/pr-previews/1/.

## Deployment

Deployment runs through GitHub Actions and the `gh-pages` branch.

- **Production:** pushing to `main` runs `.github/workflows/publish.yml`, which builds the site and deploys `dist/` to `gh-pages`.
- **PR previews:** opening or updating a pull request runs `.github/workflows/preview.yml`. It deploys to `https://nishagoswami.com/pr-previews/<PR>/` and comments the link on the PR. The preview is removed when the PR closes. PRs from forks do not get previews.

One-time GitHub setup:

1. Settings > Pages > Source: deploy from branch `gh-pages`, folder `/ (root)`.
2. Settings > Actions > General > Workflow permissions: read and write.

## Project structure

```
src/
  components/   React and Astro components (ui/ holds shadcn primitives)
  content/      Blog posts and reviews (Markdown)
  data/         Site config and section data
  layouts/      Page layout and meta tags
  lib/          Helpers (withBase, cn)
  pages/        Routes
  scripts/      Client scripts for stickers and drag interactions
  styles/       Global CSS
public/         Static files served as-is
```

## License

MIT. See `LICENSE`.
