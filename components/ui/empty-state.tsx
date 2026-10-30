import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  children?: ReactNode;
}

// Empty states are a next step, not a dead end: every usage renders an action.
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface px-6 py-10 text-center">
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {children}
    </div>
  );
}
