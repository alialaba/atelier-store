# Atelier Store

Next.js ecommerce app — initial scaffold.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Better Auth](https://www.better-auth.com) for authentication
- [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) serverless Postgres

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env example and fill in values:

   ```bash
   cp .env.example .env.local
   ```

   - `DATABASE_URL` — Neon connection string
   - `BETTER_AUTH_SECRET` — generate with `npx auth secret`
   - `BETTER_AUTH_URL` — app base URL (`http://localhost:3000` locally)

3. Run the dev server:

   ```bash
   npm run dev
   ```

## Project structure

```
src/
  app/
    api/auth/[...all]/route.ts  Better Auth route handler
  db/
    index.ts                    Drizzle client (Neon HTTP driver)
    schema/index.ts             Drizzle schema exports
  lib/
    auth.ts                     Better Auth server instance
    auth-client.ts              Better Auth React client
    env.ts                      Server env access
drizzle.config.ts               drizzle-kit config
```

## Scripts

| Script                  | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Start the dev server                                |
| `npm run build`         | Production build                                    |
| `npm run lint`          | Run ESLint                                          |
| `npm run typecheck`     | Type-check with `tsc`                               |
| `npm run auth:generate` | Generate Better Auth tables into `src/db/schema/`   |
| `npm run db:generate`   | Generate SQL migrations from the schema             |
| `npm run db:migrate`    | Apply migrations                                    |
| `npm run db:push`       | Push schema directly to the database (prototyping)  |
| `npm run db:studio`     | Open Drizzle Studio                                 |

## Database setup (when you're ready)

No tables are defined yet. To add the Better Auth tables:

```bash
npm run auth:generate
```

Then export them from `src/db/schema/index.ts` (e.g. `export * from "./auth";`) and run `npm run db:generate && npm run db:migrate`.
