import Link from 'next/link';
import { Landing } from '@/components/landing/landing';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { SiteHeader } from '@/components/layout/site-header';
import { ProjectCard } from '@/components/project-card';
import { EmptyState } from '@/components/ui/empty-state';
import { getProjects } from '@/lib/projects';
import { getCurrentUser, type SessionUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();

  return user === null ? <Landing /> : <ProjectList user={user} />;
}

async function ProjectList({ user }: { user: SessionUser }) {
  const projects = await getProjects(user.id);

  const totals = projects.reduce(
    (accumulator, project) => ({
      tasks: accumulator.tasks + project.taskCount,
      done: accumulator.done + project.counts.COMPLETED,
    }),
    { tasks: 0, done: 0 },
  );
  const overall =
    totals.tasks === 0 ? 0 : Math.round((totals.done / totals.tasks) * 100);

  return (
    <>
      <SiteHeader>
        <Link
          href="/projects/new"
          className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          New project
        </Link>
        <SignOutButton />
      </SiteHeader>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
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
          <>
            <section
              aria-label="Overview"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              <Stat
                label="Projects"
                value={String(projects.length)}
                delay={0}
              />
              <Stat label="Tasks" value={String(totals.tasks)} delay={110} />
              <Stat label="Completed" value={String(totals.done)} delay={220} />
              <Stat
                label="Overall progress"
                value={`${overall}%`}
                delay={330}
              />
            </section>

            <section aria-label="Projects" className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
                  Projects
                </h2>
                <p className="text-sm text-muted">
                  Signed in as {user.name ?? user.email}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="rise"
                    style={{ animationDelay: `${380 + index * 130}ms` }}
                  >
                    <ProjectCard
                      project={project}
                      href={`/projects/${project.id}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <div
      className="rise rounded-lg border border-border bg-surface-raised px-4 py-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
