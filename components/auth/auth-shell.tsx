import type { ReactNode } from 'react';
import { Brand } from '@/components/ui/brand';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-fit">
        <Brand href="/" size="lg" />
      </div>

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
