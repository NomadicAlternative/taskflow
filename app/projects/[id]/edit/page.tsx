import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/project-form';
import { getProjectById } from '@/lib/projects';
import { requireUser } from '@/lib/session';

export default async function EditProjectPage({
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

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
      <div className="mt-6 rounded-lg border border-black/[.08] p-6 dark:border-white/[.145]">
        <ProjectForm project={project} />
      </div>
    </main>
  );
}
