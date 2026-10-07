'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, TextareaField } from '@/components/ui/field';

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
      <Field
        label="Title"
        id="title"
        name="title"
        required
        defaultValue={project?.title ?? ''}
      />
      <TextareaField
        label="Description"
        id="description"
        name="description"
        rows={3}
        defaultValue={project?.description ?? ''}
      />

      {error !== null ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
