'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TaskForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get('title') ?? '').trim();

    if (title === '') {
      setError('Title is required.');
      setPending(false);
      return;
    }

    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? 'Something went wrong.');
      setPending(false);
      return;
    }

    form.reset();
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="task-title" className="text-sm font-medium">
        New task
      </label>
      <div className="flex gap-2">
        <input
          id="task-title"
          name="title"
          required
          placeholder="Task title"
          className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm outline-none dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {pending ? 'Adding…' : 'Add'}
        </button>
      </div>
      {error !== null ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </form>
  );
}
