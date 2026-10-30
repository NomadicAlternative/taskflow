import Link from 'next/link';
import { ProductPreview } from '@/components/landing/product-preview';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const CAPABILITIES = [
  {
    title: 'Progress you can read at a glance',
    body: 'Every project shows its overall progress plus how many tasks are to do, in progress and completed — so the state of a board is readable without opening anything.',
  },
  {
    title: 'Accounts stay isolated',
    body: 'Every query is scoped to the signed-in owner. A project belonging to another account answers 404 rather than 403, so it never reveals that it exists. Thirty automated assertions cover cross-account reads, writes and page renders.',
  },
  {
    title: 'One token set, two modes',
    body: 'Light and dark resolve from a single definition of semantic tokens, and a contrast script fails the build if any text pair drops below WCAG AA.',
  },
];

export function Landing() {
  return (
    <>
      <SiteHeader>
        <ThemeToggle />
        <Link
          href="/login"
          className="focus-ring rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Sign in
        </Link>
      </SiteHeader>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12">
        <section className="rise flex flex-col gap-5">
          <p className="text-sm font-medium tracking-wide text-primary-text uppercase">
            Project and task tracking
          </p>
          <h1 className="text-heading max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Keep every project and its tasks in one clear view
          </h1>
          <p className="max-w-xl text-lg text-muted">
            TaskFlow is a small full-stack app for organising projects and the
            tasks inside them: create a project, break it into tasks, and move
            each one from to do, to in progress, to completed.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="focus-ring rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Try the demo
            </Link>
            <Link
              href="/signup"
              className="focus-ring rounded-md border border-border-strong px-5 py-2.5 font-medium transition-colors hover:bg-surface"
            >
              Create an account
            </Link>
          </div>
        </section>

        <section
          aria-label="Product preview"
          className="rise"
          style={{ animationDelay: '220ms' }}
        >
          <ProductPreview />
        </section>

        <section
          aria-labelledby="capabilities-heading"
          className="flex flex-col gap-6"
        >
          <h2
            id="capabilities-heading"
            className="text-heading rise text-2xl font-semibold tracking-tight"
            style={{ animationDelay: '300ms' }}
          >
            What it actually does
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {CAPABILITIES.map((capability, index) => (
              <div
                key={capability.title}
                className="rise flex flex-col gap-2"
                style={{ animationDelay: `${340 + index * 160}ms` }}
              >
                <p className="text-xs font-medium tabular-nums text-primary-text">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-medium">{capability.title}</h3>
                <p className="text-sm text-muted">{capability.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="demo-heading"
          className="rise flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ animationDelay: '860ms' }}
        >
          <div className="flex flex-col gap-1">
            <h2
              id="demo-heading"
              className="text-heading text-xl font-semibold tracking-tight"
            >
              Look around without signing up
            </h2>
            <p className="text-sm text-muted">
              Sign in with{' '}
              <span className="font-mono text-foreground">
                demo@taskflow.app
              </span>{' '}
              and password{' '}
              <span className="font-mono text-foreground">taskflow123</span>.
            </p>
            <p className="text-xs text-muted">
              This is a demonstration build: accounts are sample data and may be
              reset.
            </p>
          </div>
          <Link
            href="/login"
            className="focus-ring shrink-0 rounded-md bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Open the demo
          </Link>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Built with Next.js, Prisma and Auth.js</p>
          <a
            href="https://github.com/NomadicAlternative/taskflow"
            className="focus-ring rounded-sm font-medium text-primary-text underline-offset-4 hover:underline"
            rel="noreferrer noopener"
            target="_blank"
          >
            Source on GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
