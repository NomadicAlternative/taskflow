import type { Project as ProjectRow, Task as TaskRow } from '@prisma/client';
import {
  isRecordNotFound,
  ownedProject,
  ownedProjects,
} from '@/lib/ownership';
import { prisma } from '@/lib/prisma';
import type {
  CreateProjectInput,
  Project,
  ProjectWithTaskCount,
  ProjectWithTasks,
  Task,
  UpdateProjectInput,
} from '@/lib/types';

// Every function is scoped to `ownerId` through `lib/ownership.ts`. A project
// owned by another account is reported as missing (null / false), so callers
// answer 404 and never reveal that it exists.

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: row.createdAt,
    ownerId: row.ownerId,
  };
}

export function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt,
    projectId: row.projectId,
  };
}

export async function getProjects(
  ownerId: string,
): Promise<ProjectWithTaskCount[]> {
  const projects = await prisma.project.findMany({
    where: ownedProjects(ownerId),
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { tasks: true } },
    },
  });

  return projects.map((project) => ({
    ...toProject(project),
    taskCount: project._count.tasks,
  }));
}

export async function getProject(
  ownerId: string,
  projectId: string,
): Promise<ProjectWithTasks | null> {
  const project = await prisma.project.findUnique({
    where: ownedProject(ownerId, projectId),
    include: { tasks: { orderBy: { createdAt: 'asc' } } },
  });

  if (project === null) {
    return null;
  }

  return { ...toProject(project), tasks: project.tasks.map(toTask) };
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const project = await prisma.project.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      ownerId: input.ownerId,
    },
  });

  return toProject(project);
}

export async function updateProject(
  ownerId: string,
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project | null> {
  try {
    const project = await prisma.project.update({
      where: ownedProject(ownerId, projectId),
      data: { title: input.title, description: input.description },
    });
    return toProject(project);
  } catch (error) {
    if (isRecordNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export async function deleteProject(
  ownerId: string,
  projectId: string,
): Promise<boolean> {
  try {
    await prisma.project.delete({ where: ownedProject(ownerId, projectId) });
    return true;
  } catch (error) {
    if (isRecordNotFound(error)) {
      return false;
    }
    throw error;
  }
}
