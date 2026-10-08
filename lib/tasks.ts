import { isRecordNotFound, ownedProject, ownedTask } from '@/lib/ownership';
import { prisma } from '@/lib/prisma';
import { toTask } from '@/lib/projects';
import type { CreateTaskInput, Task, UpdateTaskInput } from '@/lib/types';

// Tasks are owned through their project. As in `lib/projects.ts`, a task or
// project belonging to another account is reported as missing (null / false).

// Returns null (not an empty list) when the project is not the user's, so the
// caller refuses the request instead of showing an empty project.
export async function getTasks(
  ownerId: string,
  projectId: string,
): Promise<Task[] | null> {
  const project = await prisma.project.findUnique({
    where: ownedProject(ownerId, projectId),
    select: { tasks: { orderBy: { createdAt: 'asc' } } },
  });

  return project === null ? null : project.tasks.map(toTask);
}

export async function getTask(
  ownerId: string,
  taskId: string,
): Promise<Task | null> {
  const task = await prisma.task.findUnique({
    where: ownedTask(ownerId, taskId),
  });

  return task === null ? null : toTask(task);
}

export async function createTask(
  ownerId: string,
  projectId: string,
  input: CreateTaskInput,
): Promise<Task | null> {
  const project = await prisma.project.findUnique({
    where: ownedProject(ownerId, projectId),
    select: { id: true },
  });
  if (project === null) {
    return null;
  }

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      projectId: project.id,
    },
  });

  return toTask(task);
}

export async function updateTask(
  ownerId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task | null> {
  try {
    const task = await prisma.task.update({
      where: ownedTask(ownerId, taskId),
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
      },
    });
    return toTask(task);
  } catch (error) {
    if (isRecordNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export async function deleteTask(
  ownerId: string,
  taskId: string,
): Promise<boolean> {
  try {
    await prisma.task.delete({ where: ownedTask(ownerId, taskId) });
    return true;
  } catch (error) {
    if (isRecordNotFound(error)) {
      return false;
    }
    throw error;
  }
}
