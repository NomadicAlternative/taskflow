import Link from 'next/link';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { EmptyState } from '@/components/ui/empty-state';
import { getProjects } from '@/lib/projects';
import { getCurrentUser, type SessionUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();

  return user === null ? <Landing /> : <ProjectList user={user} />;
}

function Landing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-heading text-4xl font-semibold tracking-tight">
        TaskFlow
      </h1>
      <p className="max-w-md text-muted">
        Organize your projects and tasks in one place.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/signup"
          className="focus-ring rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Create account
        </Link>
        <Link
          href="/login"
          className="focus-ring rounded-md border border-border-strong px-4 py-2 font-medium transition-colors hover:bg-surface"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}

async function ProjectList({ user }: { user: SessionUser }) {
  const projects = await getProjects(user.id);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-heading text-3xl font-semibold tracking-tight">
            TaskFlow
          </h1>
          <p className="text-sm text-muted">
            Signed in as {user.name ?? user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/projects/new"
            className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            New project
          </Link>
          <SignOutButton />
        </div>
      </header>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing tasks."
        >
          <Link
            href="/projects/new"
            className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Create a project
          </Link>
        </EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="focus-ring flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{project.title}</span>
                  {project.description ? (
                    <span className="text-sm text-muted">
                      {project.description}
                    </span>
                  ) : null}
                </div>
                <span className="text-sm text-muted">
                  {project.taskCount} task{project.taskCount === 1 ? '' : 's'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
