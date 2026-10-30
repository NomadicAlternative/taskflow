'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge, STATUS_LABEL } from '@/components/ui/status-badge';
import type { Task, TaskStatus } from '@/lib/types';

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED: 'TODO',
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  // Optimistic overrides: the badge changes on click and only rolls back if the
  // request fails, so the row never waits on a round trip.
  const [overrides, setOverrides] = useState<Record<string, TaskStatus>>({});
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  function statusOf(task: Task): TaskStatus {
    return overrides[task.id] ?? task.status;
  }

  async function cycleStatus(task: Task) {
    const next = NEXT_STATUS[statusOf(task)];
    setError(null);
    setOverrides((current) => ({ ...current, [task.id]: next }));
    setAnnouncement(`${task.title}: ${STATUS_LABEL[next]}`);

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });

    if (!response.ok) {
      setOverrides((current) => ({ ...current, [task.id]: task.status }));
      setError('Could not update the status. Try again.');
      setAnnouncement('Status update failed');
      return;
    }

    router.refresh();
  }

  async function remove(task: Task) {
    setError(null);
    const response = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });

    if (!response.ok) {
      setError('Could not delete the task. Try again.');
      return;
    }

    setAnnouncement(`${task.title}: deleted`);
    router.refresh();
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Add the first task for this project to start tracking progress."
      >
        <button
          type="button"
          onClick={() => document.getElementById('task-title')?.focus()}
          className="focus-ring rounded-md border border-border-strong px-3 py-2 text-sm font-medium transition-colors hover:bg-background"
        >
          Add a task
        </button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {tasks.map((task) => {
          const status = statusOf(task);

          return (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span
                  className={
                    status === 'COMPLETED'
                      ? 'text-muted line-through'
                      : 'font-medium'
                  }
                >
                  {task.title}
                </span>
                {task.description ? (
                  <span className="text-sm text-muted">{task.description}</span>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => cycleStatus(task)}
                  aria-label={`Status of ${task.title}: ${STATUS_LABEL[status]}. Activate to change.`}
                  title="Change status"
                  className="focus-ring rounded-full transition-opacity hover:opacity-80"
                >
                  <StatusBadge status={status} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(task)}
                  className="focus-ring rounded-sm px-1 text-sm text-muted transition-colors hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
