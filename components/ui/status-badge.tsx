import type { TaskStatus } from '@/lib/types';

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

// Color reinforces the state; it never carries it alone. Each status also has a
// distinct glyph so the list stays readable in grayscale or with color-blindness.
export function StatusIcon({
  status,
  className = 'h-3.5 w-3.5',
}: {
  status: TaskStatus;
  className?: string;
}) {
  const shared = {
    viewBox: '0 0 16 16',
    'aria-hidden': true,
    className,
  } as const;

  if (status === 'COMPLETED') {
    return (
      <svg {...shared}>
        <circle
          cx="8"
          cy="8"
          r="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5.2 8.2 7.1 10l3.7-3.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <circle
        cx="8"
        cy="8"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {status === 'IN_PROGRESS' ? (
        <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      ) : null}
    </svg>
  );
}

const VARIANT: Record<TaskStatus, string> = {
  TODO: 'border-border-strong text-foreground',
  IN_PROGRESS: 'border-primary text-primary-text',
  COMPLETED: 'border-border text-muted',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${VARIANT[status]}`}
    >
      <StatusIcon status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}
