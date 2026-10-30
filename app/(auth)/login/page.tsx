import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign in | TaskFlow',
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      description="Pick up your projects and tasks where you left them."
      footer={
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-dashed border-border-strong px-4 py-3 text-xs">
            <p className="font-medium text-foreground">Demo account</p>
            <p className="mt-1 font-mono text-muted">
              demo@taskflow.app · taskflow123
            </p>
            <p className="mt-1 text-muted">Sample data for trying the app.</p>
          </div>

          <p className="text-sm text-muted">
            No account yet?{' '}
            <Link
              href="/signup"
              className="focus-ring rounded-sm font-medium text-primary-text underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
