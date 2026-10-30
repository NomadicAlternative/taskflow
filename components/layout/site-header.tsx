import type { ReactNode } from 'react';
import { Brand } from '@/components/ui/brand';

// One header for every screen: the same width, the same rhythm, the same brand
// position. Pages only pass their own actions, so the bar cannot drift between
// the landing, the auth screens and the dashboard.
//
// It is sticky so only the body scrolls; the translucent background keeps the
// content readable while it passes underneath.
export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-2">
        <Brand href="/" />
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
