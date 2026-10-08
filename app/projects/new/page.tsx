import type { Metadata } from 'next';
import { ProjectForm } from '@/components/project-form';
import { requireUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'New Project',
};

export default async function NewProjectPage() {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
      <div className="mt-6 rounded-lg border border-black/[.08] p-6 dark:border-white/[.145]">
        <ProjectForm />
      </div>
    </main>
  );
}
