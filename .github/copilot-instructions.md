# Copilot Instructions

## Stack

- Next.js 16 (App Router), TypeScript in strict mode, Tailwind CSS 4.
- Database: PostgreSQL on Supabase, accessed via Prisma.
- Auth.js v5 will be added in a later slice; authentication is not implemented yet.

## Architecture

- Server-first: Server Components are the default. Add `'use client'` only where
  browser interactivity is required, and keep that boundary as low as possible.
- Shared data-layer types live in `lib/types.ts` and are the contract between
  route handlers, data access, and UI.

## Data model

- `User` — owns many `Project`s.
- `Project` — belongs to one `User` and contains many `Task`s.
- `Task` — belongs to one `Project` and has a `TaskStatus` of
  `TODO | IN_PROGRESS | COMPLETED`.

## Conventions

- No `any`. Use explicit types on component props and API responses.
- Use the `@/` import alias.
- 2-space indent, single quotes, semicolons — `.prettierrc` is authoritative.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- Work on `feature/*` branches and open a PR into `main` for review.

## Environment

- `DATABASE_URL` configures Prisma (Supabase Postgres). Never commit `.env` files.
