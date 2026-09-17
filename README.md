# TaskFlow

A web app that helps students and small teams organize their projects and manage tasks in one place.

## Team 6

| Member                   | GitHub                                                       |
| ------------------------ | ------------------------------------------------------------ |
| Diego Artemio Garcia     | [@NomadicAlternative](https://github.com/NomadicAlternative) |
| Joshua Abinadi Cirilo    | [@joshuacirilo](https://github.com/joshuacirilo)             |
| Nelson Mandella Akpomah  | [@mandellasly1](https://github.com/mandellasly1)             |
| Taiye Gabriel Ade-Benson | _add username_                                               |

**Synchronous meeting:** Wednesdays at **22:00 UTC**.

## Tech stack

| Layer                  | Technology               |
| ---------------------- | ------------------------ |
| Framework              | Next.js (App Router)     |
| Language               | TypeScript (strict mode) |
| Styling                | Tailwind CSS             |
| Linting and formatting | ESLint + Prettier        |
| Deployment             | Vercel                   |

## Getting started

```bash
git clone <repository-url>
cd taskflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Development server                       |
| `npm run build`        | Production build                         |
| `npm run lint`         | ESLint                                   |
| `npm run format`       | Formats the code with Prettier           |
| `npm run format:check` | Checks formatting without changing files |

## Branching

`main` is protected. Nobody pushes to it directly.

1. Branch off `main` using `feature/<short-description>`, for example `feature/user-auth`.
2. Commit your work on that branch.
3. Open a pull request into `main`.
4. At least one other team member must review and approve it.
5. Merge only after the review.

Keep pull requests small and focused on one thing. A pull request that does five things is a pull request nobody reviews properly.

## Code standards

- **Formatting** is handled by Prettier. The rules live in `.prettierrc` and are shared by the whole team, so nobody argues about style in a review. Run `npm run format` before committing.
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

## Specification

The project specification lives in [`specs/`](./specs). Read it before starting a feature — it is the source of truth for what we are building and what is out of scope.

## Coordination

Beyond the weekly meeting, keep the team posted asynchronously in our Microsoft Teams channel: what you finished, what you are working on next, and anything blocking you.
