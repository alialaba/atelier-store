# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project status

Early scaffold for an ecommerce app: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Better Auth + Drizzle ORM on Neon Postgres. Integrations are wired up. The homepage, a new arrivals listing (`/new-arrivals`), product detail pages (`/products/[slug]`) and a product quick view read the catalog (categories, products, per-size stock) from Postgres, and a client-only bag (localStorage) counts added items. There is no bag/checkout page, no category listing pages, no auth flows (no sign-in methods enabled), no auth tables and no payments yet; category and footer links 404 for now. There is no test framework configured.

## Commands

```bash
npm run dev            # dev server (http://localhost:3000)
npm run build          # production build
npm run lint           # ESLint (flat config, eslint-config-next)
npm run typecheck      # tsc --noEmit
npm run auth:generate  # generate Better Auth tables into src/db/schema/auth.ts
npm run db:generate    # drizzle-kit: SQL migrations from schema -> ./drizzle
npm run db:migrate     # apply migrations
npm run db:seed        # upsert the sample catalog (idempotent; src/db/seed/)
npm run db:push        # push schema directly (throwaway prototyping only)
npm run db:studio      # Drizzle Studio
```

Env vars live in `.env.local` (template: `.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. `src/lib/env.ts` validates each variable lazily, when it is first read, so `next dev` serves the storefront with only `DATABASE_URL` set (auth vars are needed once `/api/auth` is hit). `npm run build` needs all three: it loads the `/api/auth` route while collecting page data, and `DATABASE_URL` must point at a **migrated and seeded** database: the homepage and product pages prerender from it, and `generateStaticParams` must return at least one slug under Cache Components. Use a Neon dev branch for local work. Generate a secret with `npx auth secret`. The Better Auth CLI is the `auth` package (`@better-auth/cli` is deprecated).

## Architecture

- `src/lib/env.ts`: the single place server env vars are read and checked. Import `env` from here rather than reading `process.env` directly in server code.
- `src/db/index.ts`: exports `db`, a Drizzle client over Neon's HTTP driver (`drizzle-orm/neon-http`) built with every export of `src/db/schema/index.ts`. New tables must be re-exported from `schema/index.ts` to be visible to both `db` and the Better Auth adapter. `drizzle.config.ts` reads the whole `src/db/schema` directory.
- `src/lib/auth.ts`: Better Auth server instance using `drizzleAdapter(db, { provider: "pg", schema })`. The `nextCookies()` plugin must stay **last** in `plugins` so cookies set in server actions are applied. Enable auth methods (email/password, OAuth) here.
- `src/app/api/auth/[...all]/route.ts`: catch-all that hands `/api/auth/*` to Better Auth via `toNextJsHandler`.
- `src/lib/auth-client.ts`: `authClient` (from `better-auth/react`) for client components; it uses the same origin, so it has no baseURL.
- Server-only modules (`env`, `db`, `auth`) import `server-only`; keep that on anything that touches secrets or the database.

Because the auth tables don't exist yet, `next build` logs a Better Auth "Drizzle schema mismatch" error (missing `user`, `session`, `account`, `verification`). This is expected until the auth tables are added: run `npm run auth:generate`, add `export * from "./auth";` to `src/db/schema/index.ts`, then run `npm run db:generate && npm run db:migrate`.

## Design system

Defined in `src/app/globals.css` (Tailwind v4, CSS-first; there is no `tailwind.config`). The `@theme` block **resets** Tailwind's default colour, font-size and radius scales, so only the tokens defined there exist (e.g. `text-ink-muted`, `bg-well`, `border-line`; `text-red-500` and `rounded-lg` will not generate). Monochrome palette, square corners (`rounded-pill`/`rounded-full` only for chips and icon buttons), a single sans family (Jost via `next/font`, exposed as `--font-jost`).

- Layout: `container-page` / `container-prose` / `container-bleed`, `section-y`, `gutter-x`, `h-header`/`pt-header`. These read responsive CSS variables on `:root` (`--page-gutter`, `--section-space`, `--header-height`, `--grid-gap`), which step up at `md` and `lg`.
- Type roles: `type-display`, `type-h1`–`type-h3`, `type-body`, `type-body-sm`, `type-caption`, `type-label`. Prefer these over raw `text-*` sizes.
- Buttons: `btn` + one of `btn-primary`/`btn-secondary`/`btn-inverse`/`btn-text`, optional `btn-sm`/`btn-lg`/`btn-icon`. The hover fill is a `::before` sweep driven by `--btn-sweep`.
- Links: `link` (underlined, in copy) and `link-reveal` (underline draws in; nav, with `aria-current="page"` support).
- React primitives in `src/components/ui` (barrel `@/components/ui`) wrap these classes: `Container`, `Section`, `Heading`, `Text`, `Button`/`ButtonLink`/`buttonClassName`, `TextLink`, `Divider`, `Grid` (2→3→4 columns, hairline gutters for product listings), `Media` (fixed-ratio image well; default 3:4). Use `cn` from `@/lib/cn` to join classes.

## Database conventions

- **Current model** (`src/db/schema/catalog.ts`): `categories` 1─< `products` 1─< `product_stock` (one row per product + size, PK `(product_id, size)`). There are deliberately **no variants**: colours are display-only jsonb on the product, and sizes carry only a stock count. Don't add carts, orders or variants into these tables; they get their own tables when they're designed.
- **Column conventions:** `uuid` PKs with `defaultRandom()`; money as integer cents (`price_cents`, never floats); `timestamptz` with `defaultNow()`; snake_case SQL names mapped to camelCase in TypeScript; `slug` is unique and is the stable key for URLs, seeds and upserts; non-negative checks on money and quantities. Use jsonb only for data always read with its row and never queried on its own (`images`, `colors`); anything filtered, joined or counted gets a real table.
- **Schema files** live in `src/db/schema/*.ts` and are re-exported from `schema/index.ts`. Use **relative imports** there: drizzle-kit loads them outside Next and doesn't resolve `@/`.
- **Migrations only:** change the schema → `npm run db:generate` → review and commit `drizzle/*.sql` → `npm run db:migrate`. Never hand-edit applied migrations, and never `db:push` against a shared or production database. Use a Neon dev branch locally.
- **Reads go through `src/lib/data/*.ts`**, never `db` directly from pages, routes or components. Each read is `server-only` with `"use cache"` + `cacheTag(...)` + `cacheLife(...)` (catalog: tag `"catalog"`, `"minutes"`, because stock changes). Map rows onto the UI types in `src/lib/product.ts` (e.g. `toProduct()`), and keep those types stable so components never see database shapes. Any write must call `updateTag()` for the tags it affects.
- **neon-http has no interactive transactions.** For atomic multi-statement writes use `db.batch([...])`, which runs as one transaction; resolve foreign keys with subselects rather than ids returned by earlier statements.
- **Scripts outside Next** (seed, one-offs, run with `tsx`) must build their own Neon/Drizzle client from `process.env`, because `src/db/index.ts` and `src/lib/env.ts` import `server-only`, which throws outside Next. See `src/db/seed/index.ts`. Seeds must stay idempotent (upsert by slug).
- **Builds need a live database:** pages prerender from cached reads, and `generateStaticParams` must return at least one row under Cache Components.

## Storefront

- `src/lib/content.ts` holds editorial content only (hero, departments, campaigns, services); catalog data comes from the database. Client components import types and helpers (`formatPrice`, `stockStatus`, `totalStock`, `Collection`) from `src/lib/product.ts` and nav from `src/lib/navigation.ts`, never from server data modules.
- Sample catalog seed data is in `src/db/seed/data.ts`. Product images are three shots of one Unsplash photo made with imgix params (`shots()`): full frame, focal-point zoom (`fp-z`), mirrored crop; `images[1]` is the card's hover image. `categories.featured` drives the homepage tiles.
- Stock status: a single-size product is "one size" and pre-selected. 0 = out, ≤3 = low, otherwise in stock.
- `ProductGallery` (client) is shared by the product page (thumbnail rail from `lg`) and the quick view (from `md`): a snap-scrolling main image with arrows, synced thumbnails, and a counter on small screens.
- `ProductCard` → `QuickViewButton` (client) fetches `GET /api/products/[slug]`, shows `LoadingDots` (with a 450 ms minimum) and then opens a native modal `<dialog>`. `PurchasePanel` (colour/size/stock/add to bag) is shared by the quick view and the product page. `src/lib/bag.ts` is the localStorage bag (`useBag`, `addToBag`).
- With `cacheComponents` + `partialPrefetching`, Next keeps the previous page mounted but hidden after navigation: client components must undo global side effects in effect cleanups (the quick view closes its dialog on unmount, otherwise `html:has(dialog[open])` keeps the next page scroll-locked). Pages that read `params` must do so inside `<Suspense>` (see `/products/[slug]`), or dev reports an instant-navigation error.
- `src/components/layout/site-header.tsx` (client) and `site-footer.tsx` are rendered by the root layout. The header is fixed: transparent over the hero on `/`, solid elsewhere, so **every other page must offset its first section with `pt-header`**.
- Homepage sections live in `src/components/home/`; `ProductCard` is in `src/components/product/`.
- Listing pages (e.g. `/new-arrivals`) follow one pattern: `pt-header` main, `Breadcrumbs` (`src/components/layout/breadcrumbs.tsx`, last crumb is the current page), an eyebrow + `type-h1` header with a count, then `ProductCard`s in `<Container size="bleed"><Grid cols={4}>`. Fetch with a cached `src/lib/data` function, and include an empty state.
- Remote images must be allowed in `next.config.ts` `images.remotePatterns`. Use the object form; a `new URL()` pattern rejects URLs with query strings. Next 16 requires `images.qualities` (only `75` is allowed) and replaces `priority` with `preload`.

## Conventions

- Import alias `@/*` → `src/*`.
- Next.js 16 conventions differ from older versions (e.g. middleware is now `proxy`). Check `node_modules/next/dist/docs/` before using a Next API.
