import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign in | TaskFlow',
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <LoginForm />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No account yet?{' '}
        <Link href="/signup" className="font-medium underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
