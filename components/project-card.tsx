import Link from 'next/link';
import { StatusIcon, STATUS_LABEL } from '@/components/ui/status-badge';
import type { ProjectWithTaskCount, TaskStatus } from '@/lib/types';

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

// Full literal class names on purpose: Tailwind only emits classes it can see
// in the source, so building these strings dynamically would drop the styles.
const ACCENT_STRIPES = [
  'border-l-project-1',
  'border-l-project-2',
  'border-l-project-3',
  'border-l-project-4',
  'border-l-project-5',
];

// Stable per-project accent: the same project always gets the same stripe,
// derived from the id so it survives reordering.
function accentStripe(id: string) {
  let hash = 0;
  for (const character of id) {
    hash = (hash * 31 + character.charCodeAt(0)) % 1_000_003;
  }
  return ACCENT_STRIPES[hash % ACCENT_STRIPES.length];
}

// One card carries the whole project at a glance: identity, progress and the
// per-status breakdown, so the dashboard is informative before opening anything.
// `href` is optional so the landing preview can reuse the exact same markup as a
// static, non-navigable card and stay in sync with the real dashboard.
export function ProjectCard({
  project,
  href,
}: {
  project: ProjectWithTaskCount;
  href?: string;
}) {
  const total = project.taskCount;
  const done = project.counts.COMPLETED;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const className = `flex flex-col gap-3 rounded-lg border border-l-4 border-border bg-surface px-4 py-3 ${accentStripe(project.id)}`;

  const content = (
    <>
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
          className="block h-full rounded-full bg-linear-to-r from-primary to-accent"
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
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`focus-ring transition-colors hover:border-border-strong ${className}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
