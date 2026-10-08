import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';

// Sign-out control rendered only when a session exists (see the home page).
export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <Button type="submit" variant="secondary">
        Sign Out
      </Button>
    </form>
  );
}
