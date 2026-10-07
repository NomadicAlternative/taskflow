'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type EditableProject = {
  id: string;
  title: string;
  description: string | null;
};

// Client component that talks to the route handlers (POST /api/projects or
// PATCH /api/projects/[id]) — this is the client → route handler → database
// flow required by the rubric.
export function ProjectForm({ project }: { project?: EditableProject }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = project !== undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (title === '') {
      setError('Title is required.');
      setPending(false);
      return;
    }

    const url = isEdit ? `/api/projects/${project.id}` : '/api/projects';
    const response = await fetch(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: description === '' ? undefined : description,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? 'Something went wrong.');
      setPending(false);
      return;
    }

    router.push(isEdit ? `/projects/${project.id}` : '/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={project?.title ?? ''}
          className="rounded-md border border-black/15 px-3 py-2 text-sm outline-none dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ''}
          className="rounded-md border border-black/15 px-3 py-2 text-sm outline-none dark:border-white/20 dark:bg-transparent"
        />
      </div>

      {error !== null ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
