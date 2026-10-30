import { ProjectCard } from '@/components/project-card';
import type { ProjectWithTaskCount } from '@/lib/types';

// Mirrors the seeded demo account so the landing shows exactly what a visitor
// gets after signing in. Rendered with the real card component — never a
// screenshot — so it cannot drift from the app.
const SAMPLE_PROJECTS: ProjectWithTaskCount[] = [
  {
    id: 'preview-website-redesign',
    title: 'Website Redesign',
    description: 'Refresh the marketing site before the public launch.',
    createdAt: new Date(0),
    ownerId: 'preview',
    taskCount: 5,
    counts: { TODO: 2, IN_PROGRESS: 1, COMPLETED: 2 },
  },
  {
    id: 'preview-authentication',
    title: 'Authentication Hardening',
    description: 'Close the gaps found in the security review.',
    createdAt: new Date(0),
    ownerId: 'preview',
    taskCount: 4,
    counts: { TODO: 1, IN_PROGRESS: 1, COMPLETED: 2 },
  },
  {
    id: 'preview-onboarding',
    title: 'Team Onboarding',
    description: 'Make the first ten minutes of a new account make sense.',
    createdAt: new Date(0),
    ownerId: 'preview',
    taskCount: 6,
    counts: { TODO: 3, IN_PROGRESS: 1, COMPLETED: 2 },
  },
  {
    id: 'preview-release',
    title: 'Q4 Release',
    description: 'Everything that has to ship before the term ends.',
    createdAt: new Date(0),
    ownerId: 'preview',
    taskCount: 4,
    counts: { TODO: 1, IN_PROGRESS: 1, COMPLETED: 2 },
  },
];

const STATS = [
  { label: 'Projects', value: '4' },
  { label: 'Tasks', value: '19' },
  { label: 'Completed', value: '8' },
  { label: 'Overall progress', value: '42%' },
];

// Exposed as a single labelled graphic: the numbers are illustrative, so an
// assistive technology should hear a summary instead of fake data.
export function ProductPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of the TaskFlow dashboard: four projects, each with an overall progress bar and counts of to-do, in-progress and completed tasks."
      className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-danger/70" />
        <span className="h-2 w-2 rounded-full bg-warning/70" />
        <span className="h-2 w-2 rounded-full bg-success/70" />
        <span className="ml-3 text-xs text-muted">taskflow / dashboard</span>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-surface-raised px-3 py-2"
            >
              <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {SAMPLE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
