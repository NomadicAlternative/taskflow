import Link from 'next/link';
import { StatusIcon, STATUS_LABEL } from '@/components/ui/status-badge';
import type { ProjectWithTaskCount, TaskStatus } from '@/lib/types';

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

// One card carries the whole project at a glance: identity, progress and the
// per-status breakdown, so the dashboard is informative before opening anything.
export function ProjectCard({ project }: { project: ProjectWithTaskCount }) {
  const total = project.taskCount;
  const done = project.counts.COMPLETED;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="focus-ring flex flex-col gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{project.title}</p>
          {project.description ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-muted">
              {project.description}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted">
          {done}/{total}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${project.title}: ${percent}% complete`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      >
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        {STATUS_ORDER.map((status) => (
          <li
            key={status}
            aria-label={`${STATUS_LABEL[status]}: ${project.counts[status]}`}
            className="flex items-center gap-1 text-muted"
          >
            <StatusIcon status={status} className="h-3 w-3" />
            <span className="font-medium tabular-nums text-foreground">
              {project.counts[status]}
            </span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
