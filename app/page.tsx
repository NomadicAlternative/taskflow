import Link from 'next/link';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { getProjects } from '@/lib/projects';
import { getCurrentUser, type SessionUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();

  return user === null ? <Landing /> : <ProjectList user={user} />;
}

function Landing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">TaskFlow</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Organize your projects and tasks in one place.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-foreground px-4 py-2 font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          Create account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-black/15 px-4 py-2 font-medium outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-white/20"
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
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">TaskFlow</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as {user.name ?? user.email}
          </p>
        </div>
        <SignOutButton />
      </header>

      {projects.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No projects yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-solid border-black/[.08] px-4 py-3 dark:border-white/[.145]"
            >
              <div className="flex flex-col">
                <span className="font-medium">{project.title}</span>
                {project.description ? (
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </span>
                ) : null}
              </div>
              <span className="text-sm text-zinc-500">
                {project.taskCount} task{project.taskCount === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
