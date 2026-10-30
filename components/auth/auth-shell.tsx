import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

// Shared frame for /login and /signup: the app is entered from a portfolio
// link, so the first screen has to identify the product instead of showing a
// bare form floating in whitespace.
export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
      <Link
        href="/"
        className="focus-ring inline-flex w-fit items-center gap-2 rounded-md"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          TF
        </span>
        <span className="text-heading text-lg font-semibold tracking-tight">
          TaskFlow
        </span>
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted">{description}</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        {children}
      </div>

      {footer}
    </main>
  );
}
