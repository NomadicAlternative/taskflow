# TaskFlow

A web app that helps students and small teams organize their projects and manage tasks in one place.

Users can create private projects, manage tasks, and track progress through To Do, In Progress, and Completed. The MVP provides individual workspaces; shared projects are out of scope for v1.

## Team 6

| Member                   | GitHub                                                       |
| ------------------------ | ------------------------------------------------------------ |
| Diego Artemio Garcia     | [@NomadicAlternative](https://github.com/NomadicAlternative) |
| Joshua Abinadi Cirilo    | [@joshuacirilo](https://github.com/joshuacirilo)             |
| Nelson Mandella Akpomah  | [@mandellasly1](https://github.com/mandellasly1)             |
| Taiye Gabriel Ade-Benson | [@adebenson20](https://github.com/adebenson20)               |

**Synchronous meeting:** Wednesdays at **22:00 UTC**.

## Tech stack

| Layer                  | Technology               |
| ---------------------- | ------------------------ |
| Framework              | Next.js (App Router)     |
| Language               | TypeScript (strict mode) |
| Styling                | Tailwind CSS             |
| Database               | PostgreSQL on Supabase   |
| Data access            | Prisma                   |
| Authentication         | Auth.js v5 (credentials) |
| Linting and formatting | ESLint + Prettier        |
| Deployment             | Vercel                   |

## Getting started

Prerequisites: Node.js 20.9 or later, [pnpm](https://pnpm.io/), and a PostgreSQL development database.

```bash
git clone https://github.com/NomadicAlternative/taskflow.git
cd taskflow
pnpm install
```

Copy `.env.example` to `.env` in the project root and fill in the values. In PowerShell, use `Copy-Item .env.example .env` only if `.env` does not already exist. Keep existing credentials; `.env` is ignored by Git:

```bash
DATABASE_URL="postgresql://postgres.<project-ref>:<url-encoded-password>@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
AUTH_SECRET="<output of: npx auth secret>"
# Only needed to run `pnpm start` locally; dev mode and Vercel trust the host automatically.
AUTH_TRUST_HOST=true
```

Use the session pooler connection string from your Supabase project when your network requires IPv4. URL-encode special characters in the password. Apply the committed migrations to your development database and start the app:

```bash
pnpm exec prisma migrate deploy
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Installation generates Prisma Client through `postinstall`. For schema changes, use `pnpm exec prisma migrate dev --name <change>` against your development database and commit the migration. On Windows, use `pnpm.cmd` if PowerShell blocks `pnpm.ps1`.

To serve a production build locally, run `pnpm build` followed by `pnpm start`, with `AUTH_TRUST_HOST=true` in your environment.

| Command             | What it does                             |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Development server                       |
| `pnpm build`        | Production build                         |
| `pnpm lint`         | ESLint                                   |
| `pnpm format`       | Formats the code with Prettier           |
| `pnpm format:check` | Checks formatting without changing files |

## Deployment (Vercel)

1. Import this GitHub repository into Vercel, selecting the Next.js framework preset and repository root.
2. Set `DATABASE_URL` and `AUTH_SECRET` in the project's environment variables. Use separate databases for Preview and Production. These are server secrets, so do not prefix them with `NEXT_PUBLIC_`.
3. Set the install command to `pnpm install --frozen-lockfile`. For this Prisma 6 project, set the build command to:

   ```bash
   pnpm exec prisma generate && pnpm exec prisma migrate deploy && pnpm build
   ```

   This applies committed migrations to the database selected by the deployment's `DATABASE_URL`. Do not use `migrate dev` in production.

4. Deploy and verify sign-in, project/task CRUD, and persistence after refresh. Redeploy after changing environment variables.
5. Include the verified deployment URL in the submission. A live URL is not currently recorded in this README.

References: [Vercel environment variables](https://vercel.com/docs/environment-variables) and [Prisma 6 deployment guidance](https://docs.prisma.io/docs/orm/v6/prisma-client/deployment/deploy-database-changes-with-prisma-migrate).

## Demo access and verification

Authentication uses **Auth.js v5** with email/password credentials. Users can register at `/signup`.

For a demo database, optionally create the sample account and project:

```bash
node --env-file=.env scripts/seed-demo-user.mjs
```

Demo credentials are `demo@taskflow.app` / `taskflow123`. They work only after seeding the database used by the app. The script resets this account's password on each run; use the demo account for sample data only.

To test: sign in, select **New project**, add a task, change its status, edit it, refresh to confirm persistence, and delete the test task and project.

To verify ownership manually, sign in as account B and copy a project URL. In a separate browser profile, sign in as account A and open that URL and its `/edit` page. Confirm access is refused without exposing B's content, then confirm B still has access. The automated ownership check and detailed evidence are part of the separate issue #3 security changes, pending integration into `main`.

## Graphify (local code graph)

[Graphify](https://github.com/Graphify-Labs/graphify) is an optional development tool. Its official Python package is `graphifyy`; it is separate from the app's npm dependencies.

Set up the project-local environment with [uv](https://docs.astral.sh/uv/) in PowerShell:

```powershell
uv venv .graphify-venv --python 3.12
uv pip install --python .graphify-venv/Scripts/python.exe graphifyy==0.9.71
.\.graphify-venv\Scripts\graphify.exe install --project --platform agents
```

Build or refresh the code graph locally, without an API key:

```powershell
.\.graphify-venv\Scripts\graphify.exe extract . --code-only --max-workers 2
.\.graphify-venv\Scripts\graphify.exe cluster-only . --no-label
.\.graphify-venv\Scripts\graphify.exe query "RootLayout"
Start-Process .\graphify-out\graph.html
```

The generated graph, report, Python environment, and local assistant skill are ignored by Git and Prettier. `--code-only` skips semantic analysis of documents and media. The skill is installed under `.agents/skills/graphify/` for Codex; invoke it with `$graphify` in a new turn and use the project-local executable above. Terminal commands use `graphify`, without a leading slash.

## Branching

`main` is protected. Nobody pushes to it directly.

1. Branch off `main` using `feature/<short-description>`, for example `feature/user-auth`.
2. Commit your work on that branch.
3. Open a pull request into `main`.
4. At least one other team member must review and approve it.
5. Merge only after the review.

Keep pull requests small and focused on one thing. A pull request that does five things is a pull request nobody reviews properly.

## Code standards

- **Formatting** is handled by Prettier. The rules live in `.prettierrc` and are shared by the whole team, so nobody argues about style in a review. Run `pnpm format` before committing.
- **Correctness** is handled by ESLint. `eslint-config-prettier` is applied last so the linter does not report formatting issues.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- TypeScript runs in strict mode and `any` is not allowed. Types are explicit on component props.

## Project structure

```
taskflow/
├── app/          Routes, layouts and API route handlers
├── components/   Reusable UI components
├── lib/          Types, data access and shared helpers
└── public/       Static assets
```

## API

All project/task routes listed below require a signed-in session and return `401` otherwise. Auth.js endpoints under `/api/auth/*` handle authentication separately.
Mutations return `400` for invalid input and `404` when the record is missing
or belongs to another user (owner-scoped).

| Method | Route                     | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/api/projects`           | List the signed-in user's projects       |
| POST   | `/api/projects`           | Create a project                         |
| GET    | `/api/projects/:id`       | Get one project (owner-scoped)           |
| PATCH  | `/api/projects/:id`       | Update a project                         |
| DELETE | `/api/projects/:id`       | Delete a project                         |
| GET    | `/api/projects/:id/tasks` | List a project's tasks                   |
| POST   | `/api/projects/:id/tasks` | Create a task in a project               |
| PATCH  | `/api/tasks/:id`          | Update a task (title/description/status) |
| DELETE | `/api/tasks/:id`          | Delete a task                            |

Requests and responses use JSON, except successful deletes, which return `204` with no body. Successful creates return `201`. Creation requires a non-empty `title`; `description` is optional. Task status values are `TODO`, `IN_PROGRESS`, and `COMPLETED`. Ownership comes from the server session, never a client-supplied `ownerId`. Deleting a project also deletes its tasks.

## Specification

The project specification lives in [`specs/`](./specs). Read it before starting a feature — it is the source of truth for what we are building and what is out of scope.

## Coordination

Beyond the weekly meeting, keep the team posted asynchronously in our Microsoft Teams channel: what you finished, what you are working on next, and anything blocking you.

## Known issues & opportunities

- **Owner-only model**: every project and task belongs to a single user; there
  is no multi-user sharing or collaboration in v1. Issue #3 concerns preventing cross-account access, not adding sharing.
- **No Open Graph image**: there is no committed brand asset yet, so shared
  links render the title/description without a preview image.
- **No password reset**: credentials auth has no recovery flow yet.
- **No loading/error boundaries** on the project detail page for database
  outages. API error handling is also inconsistent: some handlers catch database errors while others rely on framework responses.
- **Dashboard status counts**: the project list shows total task counts, but per-status dashboard counts required by FR-010 are not implemented.
- **Specification alignment**: FR-012 still lists the database host and access layer as undecided, although the project uses Supabase and Prisma. The profile page mentioned in User Story 1 is not implemented.
- **Validation consistency**: project creation ignores a non-string description instead of returning `400`; input validation should be consistent across endpoints.
