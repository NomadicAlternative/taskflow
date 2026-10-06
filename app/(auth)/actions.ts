'use server';

import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  logInSchema,
  signUpSchema,
  type AuthFormState,
} from '@/lib/validation/auth';

export async function signUp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '');
  const parsed = signUpSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input', email };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  // Rely on the unique constraint instead of checking first, so two
  // simultaneous sign-ups with the same email cannot both succeed.
  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { error: 'An account with this email already exists', email };
    }
    throw error;
  }

  // On success this throws a redirect, so nothing after it runs.
  await signIn('credentials', {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: '/',
  });
  return { error: null, email };
}

export async function logIn(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '');
  const parsed = logInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input', email };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/',
    });
  } catch (error) {
    // signIn signals success by throwing a redirect; only AuthError is a
    // real failure, everything else must be rethrown.
    if (error instanceof AuthError) {
      return {
        error:
          error.type === 'CredentialsSignin'
            ? 'Invalid email or password'
            : 'Something went wrong. Please try again.',
        email,
      };
    }
    throw error;
  }
  return { error: null, email };
}

export async function logOut(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
