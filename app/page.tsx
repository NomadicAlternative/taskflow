import { getBaseUrl } from '@/lib/api';
import type { ProjectWithTaskCount } from '@/lib/types';

export default async function Home() {
  const projects = await fetchProjects();

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">TaskFlow</h1>

      {projects.length === 0 ? (
        <p className="text-zinc-600">No projects yet.</p>
      ) : (
        <ul className="flex w-full max-w-xl flex-col gap-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-solid border-black/[.08] px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="font-medium">{project.title}</span>
                {project.description ? (
                  <span className="text-sm text-zinc-600">
                    {project.description}
                  </span>
                ) : null}
              </div>
              <span className="text-sm text-zinc-500">
                {project.taskCount} task{project.taskCount === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

async function fetchProjects(): Promise<ProjectWithTaskCount[]> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }

  const projects: ProjectWithTaskCount[] = await res.json();
  return projects;
}
