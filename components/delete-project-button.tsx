'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function remove() {
    if (!window.confirm('Delete this project and all of its tasks?')) {
      return;
    }

    setPending(true);
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.push('/');
      router.refresh();
    } else {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={pending}
      className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition-colors disabled:opacity-60 dark:border-red-800 dark:text-red-400"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
