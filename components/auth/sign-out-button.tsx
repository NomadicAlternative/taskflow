import { logOut } from '@/app/(auth)/actions';

export function SignOutButton() {
  return (
    <form action={logOut}>
      <button
        type="submit"
        className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-white/20"
      >
        Sign out
      </button>
    </form>
  );
}
