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
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No tasks yet — add one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between gap-3 rounded-md border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        >
          <div className="flex min-w-0 flex-col">
            <span
              className={
                task.status === 'COMPLETED'
                  ? 'text-zinc-500 line-through'
                  : 'font-medium'
              }
            >
              {task.title}
            </span>
            {task.description ? (
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {task.description}
              </span>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <select
              aria-label={`Status of ${task.title}`}
              value={task.status}
              onChange={(event) =>
                changeStatus(task.id, event.target.value as TaskStatus)
              }
              className="rounded-md border border-black/15 bg-transparent px-2 py-1 text-sm dark:border-white/20"
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
              className="text-sm text-zinc-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
