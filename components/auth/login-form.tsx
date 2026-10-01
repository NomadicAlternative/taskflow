'use client';

import { useActionState } from 'react';
import { logIn } from '@/app/(auth)/actions';
import { FormField } from '@/components/auth/form-field';
import type { AuthFormState } from '@/lib/validation/auth';

const initialState: AuthFormState = { error: null, email: '' };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(logIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state.error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-foreground px-4 py-2 font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
