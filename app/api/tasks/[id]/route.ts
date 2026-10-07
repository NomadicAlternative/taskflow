import { NextResponse, type NextRequest } from 'next/server';
import { deleteTask, updateTask } from '@/lib/tasks';
import { getCurrentUser } from '@/lib/session';
import type { TaskStatus } from '@/lib/types';

const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

function unauthorized() {
  return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
}

function taskNotFound() {
  return NextResponse.json({ error: 'Task not found' }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (user === null) {
    return unauthorized();
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Request body must be a JSON object' },
      { status: 400 },
    );
  }

  const { title, description, status } = body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
  };

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return NextResponse.json(
      { error: 'Title must be a non-empty string' },
      { status: 400 },
    );
  }

  if (description !== undefined && typeof description !== 'string') {
    return NextResponse.json(
      { error: 'Description must be a string' },
      { status: 400 },
    );
  }

  if (
    status !== undefined &&
    (typeof status !== 'string' ||
      !TASK_STATUSES.includes(status as TaskStatus))
  ) {
    return NextResponse.json(
      { error: 'Status must be one of TODO, IN_PROGRESS, COMPLETED' },
      { status: 400 },
    );
  }

  const task = await updateTask(id, user.id, {
    title: typeof title === 'string' ? title.trim() : undefined,
    description: typeof description === 'string' ? description : undefined,
    status: typeof status === 'string' ? (status as TaskStatus) : undefined,
  });

  if (task === null) {
    return taskNotFound();
  }

  return NextResponse.json(task);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (user === null) {
    return unauthorized();
  }

  const { id } = await params;
  const deleted = await deleteTask(id, user.id);
  if (!deleted) {
    return taskNotFound();
  }

  return new NextResponse(null, { status: 204 });
}
