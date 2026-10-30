'use client';

import { useRouter } from 'next/navigation';
import type { Task, TaskStatus } from '@/lib/types';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

function statusLabel(status: TaskStatus): string {
  return status.replace('_', ' ');
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  async function changeStatus(taskId: string, status: TaskStatus) {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(taskId: string) {
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    router.refresh();
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-muted">No tasks yet — add one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2"
        >
          <div className="flex min-w-0 flex-col">
            <span
              className={
                task.status === 'COMPLETED'
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
            <select
              aria-label={`Status of ${task.title}`}
              value={task.status}
              onChange={(event) =>
                changeStatus(task.id, event.target.value as TaskStatus)
              }
              className="focus-ring rounded-md border border-border-strong bg-background px-2 py-1 text-sm"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(task.id)}
              className="focus-ring rounded-sm text-sm text-muted transition-colors hover:text-danger"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
