import { prisma } from '@/lib/prisma';
import type {
  CreateProjectInput,
  Project,
  ProjectWithTaskCount,
} from '@/lib/types';

// NOTE: Ownership enforcement is intentionally absent from this slice. When
// Auth.js v5 is wired up, every query here will be scoped to the signed-in
// user's id.

export async function getProjects(): Promise<ProjectWithTaskCount[]> {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { tasks: true } },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    createdAt: project.createdAt,
    ownerId: project.ownerId,
    taskCount: project._count.tasks,
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (project === null) {
    return null;
  }

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    createdAt: project.createdAt,
    ownerId: project.ownerId,
  };
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const project = await prisma.project.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      ownerId: input.ownerId,
    },
  });

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    createdAt: project.createdAt,
    ownerId: project.ownerId,
  };
}
