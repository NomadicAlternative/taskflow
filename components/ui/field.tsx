import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const FIELD_CLASSES =
  'rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-accent';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

// Shared labeled inputs used by the auth and project/task forms.
export function Field({ label, id, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input id={id} className={FIELD_CLASSES} {...props} />
    </div>
  );
}

export function TextareaField({ label, id, ...props }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea id={id} className={FIELD_CLASSES} {...props} />
    </div>
  );
}
