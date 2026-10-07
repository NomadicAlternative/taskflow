import { NextResponse, type NextRequest } from 'next/server';
import { createTask, getTasksByProject } from '@/lib/tasks';
import { getCurrentUser } from '@/lib/session';

function unauthorized() {
  return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
}

function projectNotFound() {
  return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (user === null) {
    return unauthorized();
  }

  const { id } = await params;
  const tasks = await getTasksByProject(id, user.id);
  if (tasks === null) {
    return projectNotFound();
  }

  return NextResponse.json(tasks);
}

export async function POST(
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

  const { title, description } = body as {
    title?: unknown;
    description?: unknown;
  };

  if (typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json(
      { error: 'Title is required and must not be empty' },
      { status: 400 },
    );
  }

  if (description !== undefined && typeof description !== 'string') {
    return NextResponse.json(
      { error: 'Description must be a string' },
      { status: 400 },
    );
  }

  const task = await createTask({
    title: title.trim(),
    description: typeof description === 'string' ? description : undefined,
    projectId: id,
    ownerId: user.id,
  });

  if (task === null) {
    return projectNotFound();
  }

  return NextResponse.json(task, { status: 201 });
}
