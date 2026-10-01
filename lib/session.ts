import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
}

// Single entry point for reading the signed-in user on the server. The data
// layer must take the user id from here, never from request input.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) {
    return null;
  }

  return {
    id,
    email: session.user?.email ?? null,
    name: session.user?.name ?? null,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (user === null) {
    redirect('/login');
  }
  return user;
}
