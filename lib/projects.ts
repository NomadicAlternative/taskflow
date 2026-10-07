import { prisma } from '@/lib/prisma';
import type {
  CreateProjectInput,
  Project,
  ProjectWithTaskCount,
  UpdateProjectInput,
} from '@/lib/types';

export async function getProjects(
  ownerId: string,
): Promise<ProjectWithTaskCount[]> {
  const projects = await prisma.project.findMany({
    where: { ownerId },
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

// Owner-scoped: the caller passes the signed-in user id (from lib/session.ts),
// never one taken from request input, so a user cannot read another user's
// project by guessing its id.
export async function getProjectById(
  id: string,
  ownerId: string,
): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: { id, ownerId },
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

// Updates only the fields that are present. updateMany + where {id, ownerId}
// enforces ownership: a mismatched owner updates zero rows and returns null.
export async function updateProject(
  id: string,
  ownerId: string,
  input: UpdateProjectInput,
): Promise<Project | null> {
  const result = await prisma.project.updateMany({
    where: { id, ownerId },
    data: {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return getProjectById(id, ownerId);
}

// deleteMany + where {id, ownerId} enforces ownership and lets the caller
// distinguish "deleted" from "not found / not yours" via the boolean.
export async function deleteProject(
  id: string,
  ownerId: string,
): Promise<boolean> {
  const result = await prisma.project.deleteMany({
    where: { id, ownerId },
  });

  return result.count > 0;
}
