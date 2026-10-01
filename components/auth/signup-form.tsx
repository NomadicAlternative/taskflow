'use client';

import { useActionState } from 'react';
import { signUp } from '@/app/(auth)/actions';
import { FormField } from '@/components/auth/form-field';
import type { AuthFormState } from '@/lib/validation/auth';

const initialState: AuthFormState = { error: null, email: '' };

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Name" name="name" type="text" autoComplete="name" />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.email}
      />
      <FormField
        label="Password (at least 8 characters)"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
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
        {isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
