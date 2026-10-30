import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Create account | TaskFlow',
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create account"
      description="Start organizing your projects and tasks in one place."
      footer={
        <p className="text-sm text-muted">
          Already have an account?{' '}
          <Link
            href="/login"
            className="focus-ring rounded-sm font-medium text-primary-text underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
