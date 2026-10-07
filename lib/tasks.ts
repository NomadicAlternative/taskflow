import { prisma } from '@/lib/prisma';
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '@/lib/types';

function mapTask(row: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  projectId: string;
}): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    createdAt: row.createdAt,
    projectId: row.projectId,
  };
}

// A task belongs to an owner only through its project, so every operation
// verifies the project's ownerId before touching the task.
async function projectOwnedBy(
  projectId: string,
  ownerId: string,
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId },
    select: { id: true },
  });
  return project !== null;
}

export async function getTasksByProject(
  projectId: string,
  ownerId: string,
): Promise<Task[] | null> {
  if (!(await projectOwnedBy(projectId, ownerId))) {
    return null;
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  });

  return tasks.map(mapTask);
}

export async function createTask(input: CreateTaskInput): Promise<Task | null> {
  if (!(await projectOwnedBy(input.projectId, input.ownerId))) {
    return null;
  }

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      projectId: input.projectId,
    },
  });

  return mapTask(task);
}

export async function updateTask(
  id: string,
  ownerId: string,
  input: UpdateTaskInput,
): Promise<Task | null> {
  const existing = await prisma.task.findFirst({
    where: { id, project: { ownerId } },
    select: { id: true },
  });
  if (existing === null) {
    return null;
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      status: input.status ?? undefined,
    },
  });

  return mapTask(task);
}

export async function deleteTask(id: string, ownerId: string): Promise<boolean> {
  const result = await prisma.task.deleteMany({
    where: { id, project: { ownerId } },
  });

  return result.count > 0;
}
