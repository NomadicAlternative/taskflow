'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <Button variant="danger" onClick={remove} disabled={pending}>
      {pending ? 'Deleting…' : 'Delete'}
    </Button>
  );
}
