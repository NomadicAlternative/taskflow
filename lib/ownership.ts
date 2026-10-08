import { Prisma } from '@prisma/client';

// The ownership rule for the whole app lives here. Every query in the data
// layer that targets a project or task must build its `where` from these
// helpers, so a record owned by another account behaves exactly like one that
// does not exist. `ownerId` must come from `lib/session.ts`, never from
// request input.

export function ownedProjects(ownerId: string) {
  return { ownerId } satisfies Prisma.ProjectWhereInput;
}

export function ownedProject(ownerId: string, projectId: string) {
  return { id: projectId, ownerId } satisfies Prisma.ProjectWhereUniqueInput;
}

export function ownedTask(ownerId: string, taskId: string) {
  return {
    id: taskId,
    project: { ownerId },
  } satisfies Prisma.TaskWhereUniqueInput;
}

// Prisma throws P2025 when an update or delete matches no row, which with the
// filters above also means "owned by someone else".
export function isRecordNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
}
