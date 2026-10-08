# Issue #3: ownership verification

Source: `spec.md` — FR-003, FR-009, SC-005.

Reviewed on 2026-10-07 against `dab9fdd` plus the changes in this working tree.

## Implementation

- `lib/ownership.ts` defines the project-owner and task-project-owner filters.
- Project and task reads and mutations in `lib/projects.ts` and `lib/tasks.ts`
  use those filters. Nested task reads start from an owner-filtered project.
- Pages and API handlers obtain the user ID from the server session, rather
  than request input. Missing and foreign records receive the same refusal.
- Project detail and edit pages call `notFound()` for foreign projects.
  The detail page now also calls `notFound()` if its task lookup returns null,
  instead of silently rendering an empty list.

## Runtime verification

Passed 30 HTTP integration assertions using two temporary accounts, real
credentials sessions, the production build, and the configured PostgreSQL
database. Temporary accounts and their cascading records were removed.

- A's project list excludes B's project.
- A receives 404 from project and project-task read APIs for B's records.
- A cannot render B's project detail or edit page or see its private content.
- B can read and render its own records (positive controls).
- A cannot update/delete B's project, create tasks in it, or update/delete B's
  task: each API returns 404.
- Anonymous requests receive 401 from the tested APIs and a login redirect
  from the tested pages.
- A supplied ownerId cannot override the signed-in identity on project creation.
- B's project and task remain unchanged after the rejected mutations.

ESLint and the production build (including TypeScript) passed.

To repeat, use a database where temporary test accounts may be created. The
server and script must use the same database. In PowerShell:

```powershell
pnpm.cmd build
$env:AUTH_TRUST_HOST = 'true'
pnpm.cmd start --port 3100
```

In a second terminal:

```powershell
node --env-file=.env scripts/check-ownership.mjs
```

The script uses localhost:3100 by default. `OWNERSHIP_TEST_URL` can select
another localhost port. It creates unique fixtures and deletes only its own
accounts in a finally block. If forcibly terminated, cleanup may need to be
completed manually.

## Manual browser acceptance — pending

The HTTP verification above is automated; it does not claim completion of the
issue's explicit manual browser criterion.

1. Sign in as B, create a project and task, and copy the project URL.
2. In a separate browser profile, sign in as A and open B's copied URL.
3. Confirm the not-found screen appears, with no project/task content and no
   empty project view. Repeat with the project's `/edit` URL.
4. Confirm B can still open the same URL and A cannot see it in their list.
5. Record the tester, date, and result in the PR before marking SC-005's manual
   acceptance complete.

This verification establishes current behavior, not that protection landed
historically with the first data-backed page. Keep these protections in the
same delivered change as the affected pages.
