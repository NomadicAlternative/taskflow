import { NextResponse, type NextRequest } from 'next/server';
import { createProject, getProjects } from '@/lib/projects';

// Auth (Auth.js v5) is not wired up yet. Until then, every created project is
// owned by this placeholder user id. This is replaced by the signed-in user's
// id from the session once auth lands.
const SEED_OWNER_ID = 'seed-user';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

  try {
    const project = await createProject({
      title: title.trim(),
      description: typeof description === 'string' ? description : undefined,
      ownerId: SEED_OWNER_ID,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 },
    );
  }
}
