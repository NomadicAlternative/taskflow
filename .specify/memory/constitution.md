# TaskFlow Constitution

## Core Principles

### I. Type-Safe by Default

TypeScript runs in strict mode. The `any` type is forbidden; when a shape is unknown, it is
narrowed or validated, never asserted away. Every component prop is declared with an explicit
type or interface, and every API response has a named type that both the route handler and the
consumer import from the same module.

Rationale: a shared, explicit contract catches integration mistakes at compile time instead of at
review time. In a team of four working on the same data model, the type is the cheapest
documentation we have.

### II. Server-First Rendering

Server Components are the default. A component becomes a Client Component only when it needs
browser interactivity, and when it does, the `'use client'` boundary is pushed as far down the
tree as possible.

Rationale: server rendering keeps the client bundle small and the data access close to the
database. Pulling `'use client'` up to a page because one button needs state throws away both.

### III. Two Models, Deep Rather Than Wide

The MVP is CRUD over exactly two core entities: **Project** and **Task**. New entities are added
only after both are complete, working, and demonstrated. Scope expansion is a decision for the
whole team, recorded in the specification, not something an individual adds mid-branch.

Rationale: a team of four with four weeks finishes a small app that works and abandons a large app
that almost works. Every extra entity multiplies the surface that has to be built, reviewed and
integrated.

### IV. No Direct Pushes to `main`

Every change reaches `main` through a pull request from a `feature/*` branch, reviewed and
approved by at least one other team member. `main` must stay deployable at all times.

Rationale: a broken `main` blocks three other people. The review is also the mechanism by which
the team learns what the others are building.

### V. Formatting Is Automated, Correctness Is Reviewed

Prettier owns formatting and its rules are committed in `.prettierrc`; ESLint owns correctness.
No review comment may be about formatting, and no formatting rule may be argued in a pull request.

Rationale: style debates consume the scarcest resource the team has — review attention. Automate
what a machine can decide and spend the review on what it cannot.

## Additional Constraints

**Required stack**, fixed by the course and not open to change:

| Layer | Technology |
| --- | --- |
| Framework | Next.js, App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

**Stack decisions still open** — these MUST be resolved by the team before the first data-fetching
branch is merged, because they determine the shape of the data layer:

- Database engine and access layer: PostgreSQL (Supabase or Prisma) vs MongoDB.
- Authentication: Auth.js v5 vs Clerk.

**Explicitly out of scope for the MVP:** payments, email notifications, real-time collaboration,
file uploads, and third-party integrations. Any of these returning to scope requires an amendment
to this constitution.

## Development Workflow

1. Branch off `main` as `feature/<short-description>`.
2. Keep the pull request scoped to one thing. A pull request that does five things is a pull
   request nobody reviews properly.
3. Open the pull request into `main` and request a review from one teammate.
4. Address review comments on the same branch; do not open a second pull request for fixes.
5. Merge only after approval. Never merge your own pull request without a review.
6. Pull requests over roughly 400 changed lines are split before review, not after.

**Cadence.** The team meets synchronously every Wednesday at 22:00 UTC. Between meetings, progress,
blockers and handoffs are posted in the team's Microsoft Teams channel, not held until the meeting.

**Definition of done for any work unit:** it builds (`npm run build`), it lints (`npm run lint`),
it is formatted (`npm run format:check`), and its acceptance scenarios have been verified by hand
in the running app.

## Governance

This constitution supersedes other practices where they conflict. When a principle and a
convenience disagree, the principle wins and the convenience is documented as a justification in
the pull request that breaks it.

**Amendments** require agreement from the team during a synchronous meeting, a documented reason,
and a version bump. An amendment is recorded in this file, never only in a chat message.

**Versioning policy** follows semantic versioning: MAJOR for removing or redefining a principle,
MINOR for adding a principle or materially expanding guidance, PATCH for clarifications that do not
change behaviour.

**Compliance** is verified in every pull request: reviewers check the change against these
principles, and a violation is a review blocker rather than a follow-up issue.

**Version**: 1.0.0 | **Ratified**: 2026-09-16 | **Last Amended**: 2026-09-16
