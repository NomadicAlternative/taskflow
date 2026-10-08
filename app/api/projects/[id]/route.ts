import { NextResponse, type NextRequest } from 'next/server';
import { getProject } from '@/lib/projects';
import { getCurrentUser } from '@/lib/session';

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
