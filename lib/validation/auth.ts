import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Enter a valid email address'));

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, 'Name must be at most 100 characters')
    .transform((value) => (value === '' ? null : value)),
  email,
  // bcrypt only uses the first 72 bytes of a password.
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
});

export const logInSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

// State returned by the auth form actions. `email` is echoed back so the form
// keeps it after a failed submit.
export interface AuthFormState {
  error: string | null;
  email: string;
}
