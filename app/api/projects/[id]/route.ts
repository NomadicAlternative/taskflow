import { NextResponse, type NextRequest } from 'next/server';
import { deleteProject, getProject, updateProject } from '@/lib/projects';
import { getCurrentUser } from '@/lib/session';

function unauthorized() {
  return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
}

function notFound() {
  return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

export async function GET(
  _request: NextRequest,
  context: RouteContext<'/api/projects/[id]'>,
) {
  const user = await getCurrentUser();
  if (user === null) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const project = await getProject(user.id, id);
    // Same answer whether the project is missing or owned by someone else.
    if (project === null) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to fetch project', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 },
    );
  }
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

  const { title, description } = body as {
    title?: unknown;
    description?: unknown;
  };

  if (
    title !== undefined &&
    (typeof title !== 'string' || title.trim() === '')
  ) {
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

  const project = await updateProject(user.id, id, {
    title: typeof title === 'string' ? title.trim() : undefined,
    description: typeof description === 'string' ? description : undefined,
  });

  if (project === null) {
    return notFound();
  }

  return NextResponse.json(project);
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
  const deleted = await deleteProject(user.id, id);
  if (!deleted) {
    return notFound();
  }

  return new NextResponse(null, { status: 204 });
}
