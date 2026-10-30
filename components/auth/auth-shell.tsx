import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

// The auth screens share the app header so the bar looks identical before and
// after signing in; only the form area differs.
export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <>
      <SiteHeader>
        <ThemeToggle />
      </SiteHeader>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="rise flex w-full max-w-md flex-col gap-6">
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
        </div>
      </main>
    </>
  );
}
