import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteProjectButton } from '@/components/delete-project-button';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { getProjectById } from '@/lib/projects';
import { requireUser } from '@/lib/session';
import { getTasksByProject } from '@/lib/tasks';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const project = await getProjectById(id, user.id);
  if (project === null) {
    notFound();
  }

  const tasks = (await getTasksByProject(id, user.id)) ?? [];

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/projects/${project.id}/edit`}
            className="rounded-md border border-black/15 px-3 py-2 text-sm font-medium dark:border-white/20"
          >
            Edit
          </Link>
          <DeleteProjectButton projectId={project.id} />
        </div>
      </header>

      <section className="mt-8 flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Tasks</h2>
        <TaskForm projectId={project.id} />
        <TaskList tasks={tasks} />
      </section>

      <Link
        href="/"
        className="mt-8 inline-block text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
      >
        ← Back to projects
      </Link>
    </main>
  );
}
