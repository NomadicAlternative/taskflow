# Feature Specification: TaskFlow MVP

**Feature Branch**: `001-taskflow-mvp`

**Created**: 2026-09-16

**Status**: Draft

**Input**: Team 6 project proposal (Week 01), selected during the Week 02 team meeting.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Account Access (Priority: P1)

A student creates an account, signs in, and can sign out again. Once signed in, they have a profile
they can view, and their projects and tasks belong to them alone.

**Why this priority**: Every other story depends on knowing who the user is. Without account
access there is no such thing as "my projects", so this is the first slice that has to work.

**Independent Test**: Create an account, sign out, sign back in, and confirm the profile page shows
the account's details. Delivers value on its own: a working, deployable shell with accounts.

**Acceptance Scenarios**:

1. **Given** a visitor with no account, **When** they submit a valid email and password, **Then** an
   account is created and they are signed in.
2. **Given** a visitor, **When** they submit an email already in use, **Then** the form shows a
   validation message and no account is created.
3. **Given** a signed-in user, **When** they sign out, **Then** they are returned to a signed-out
   state and can no longer reach their projects by going back.
4. **Given** a signed-out visitor, **When** they open a project URL directly, **Then** they are sent
   to sign in instead of seeing the content.

---

### User Story 2 - Manage Projects (Priority: P2)

A signed-in user creates a project, sees it in a list of their projects, edits its details, and
deletes it when it is no longer needed.

**Why this priority**: The project is the container the whole application is organised around. It is
the minimum useful unit of work for a student.

**Independent Test**: Sign in, create two projects, rename one, delete the other, and confirm the
list reflects each change. Delivers value alone: a personal project tracker.

**Acceptance Scenarios**:

1. **Given** a signed-in user with no projects, **When** they create a project with a title and
   description, **Then** the project appears in their list.
2. **Given** a signed-in user with projects, **When** they edit a project's title, **Then** the new
   title is shown in the list and on the project page.
3. **Given** a signed-in user, **When** they delete a project, **Then** it disappears from the list
   and its URL no longer resolves.
4. **Given** a signed-in user, **When** they open the projects list, **Then** they only ever see
   their own projects.

---

### User Story 3 - Manage Tasks Inside a Project (Priority: P3)

A signed-in user opens one of their projects, adds tasks to it, edits them, and deletes them.

**Why this priority**: Tasks are where the actual work lives. It depends on projects existing, which
is why it follows Story 2 rather than leading.

**Independent Test**: Open a project, add three tasks, edit one and delete one, and confirm the
project page shows exactly the two remaining tasks.

**Acceptance Scenarios**:

1. **Given** a signed-in user on one of their projects, **When** they add a task with a title,
   **Then** the task appears in that project's task list.
2. **Given** a task in a project, **When** the user edits its title, **Then** the change is visible
   without a full page reload losing state.
3. **Given** a task in a project, **When** the user deletes it, **Then** it is removed from the list
   and does not reappear after a refresh.
4. **Given** a signed-in user, **When** they open a project belonging to someone else, **Then** they
   are refused access.

---

### User Story 4 - Track Task Status (Priority: P4)

A signed-in user moves a task between To Do, In Progress and Completed, and sees the state of a
project at a glance from the dashboard.

**Why this priority**: This is what turns a to-do list into something a team can actually plan
with. It is valuable but not required for the app to be usable, so it comes last.

**Independent Test**: Move a task through all three states and confirm the dashboard counts change
accordingly.

**Acceptance Scenarios**:

1. **Given** a task in To Do, **When** the user marks it In Progress, **Then** the task's status is
   updated and persists after a refresh.
2. **Given** tasks in different states, **When** the user opens the dashboard, **Then** the counts
   per status match the tasks in their projects.
3. **Given** a completed task, **When** the user moves it back to To Do, **Then** it is counted in
   To Do again.

---

### Edge Cases

- A user submits a project title that is empty or only whitespace.
- A user deletes a project that still has tasks in it — what happens to those tasks?
- A user opens a URL for a task inside a project that is not theirs.
- A session expires while the user is filling in a form.
- The same task title is used twice inside one project.
- A user with many projects loads the list — is it paginated, and at what point does it matter?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow a visitor to create an account with an email address and password.
- **FR-002**: System MUST allow a registered user to sign in and sign out.
- **FR-003**: System MUST restrict every project and task to its owning account.
- **FR-004**: Users MUST be able to create, view, edit and delete their own projects.
- **FR-005**: Users MUST be able to create, view, edit and delete tasks inside their own projects.
- **FR-006**: System MUST allow each task to hold a status of To Do, In Progress or Completed.
- **FR-007**: System MUST persist all data so it survives a page reload and a new session.
- **FR-008**: System MUST validate required fields and reject empty titles on both projects and
  tasks, showing a message that says what is wrong.
- **FR-009**: System MUST reject any request that targets a record the signed-in user does not own.
- **FR-010**: System MUST provide a dashboard showing the user's projects and a count of tasks by
  status.
- **FR-011**: System MUST authenticate users with **Auth.js v5**. Decided by the team on
  2026-09-17. The session shape and the way the user identifier reaches the data layer follow
  from that choice.
- **FR-012**: System MUST store data in **PostgreSQL**. Decided by the team on 2026-09-17.
  Two sub-decisions are still open and MUST be settled before the first data-backed branch is
  merged: the host (Supabase or Render) and the access layer (Prisma or the host's client).
  **Known constraint:** a free Render PostgreSQL database expires 30 days after creation and is
  deleted after a 14-day grace period, which is shorter than the remaining term. Verify the
  host's limits before committing.
- **FR-013**: System MUST provide a working API route that reads real data from the database and
  serves it to the client, satisfying the course requirement for a full client → server → database
  cycle.

### Key Entities

- **User**: A person with an account. Attributes: identifier, email, display name, hashed
  credential or provider identity. Relationships: owns many Projects.
- **Project**: A container for related work, owned by exactly one User. Attributes: identifier,
  title, description, owner, created date. Relationships: belongs to one User, contains many Tasks.
- **Task**: A single unit of work inside a Project. Attributes: identifier, title, optional
  description, status (To Do | In Progress | Completed), owning project, created date.
  Relationships: belongs to exactly one Project.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new user can go from the landing page to a created project in under 2 minutes
  without outside help.
- **SC-002**: Every primary flow — sign up, sign in, create/edit/delete project, create/edit/delete
  task, change status — works on a 375px-wide viewport with no horizontal scrolling.
- **SC-003**: The dashboard and the project list each score 90 or above in all four Lighthouse
  mobile categories (Performance, Accessibility, Best Practices, SEO).
- **SC-004**: Every primary action can be completed using only the keyboard, with a visible focus
  indicator at each step.
- **SC-005**: A signed-in user can never read or modify another account's projects or tasks,
  verified by attempting to open a known record URL from a second account.
- **SC-006**: Data survives a browser refresh and a full sign-out / sign-in cycle with no loss.

## Assumptions

- Users have a stable internet connection and a modern browser with JavaScript enabled.
- The MVP targets students and small teams as individual users; shared or multi-user projects are
  out of scope for v1.
- Mobile support is responsive web only; no native app is planned.
- Email delivery is out of scope, so account verification and password reset flows are not part of
  v1 unless the chosen authentication provider supplies them for free.
- The course's required stack (Next.js App Router, TypeScript, Tailwind CSS) is fixed and already
  scaffolded in the repository.
- The team has four members and a weekly synchronous meeting on Wednesdays at 22:00 UTC.
