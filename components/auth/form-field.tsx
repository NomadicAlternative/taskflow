interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password';
  autoComplete: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
}

export function FormField({
  label,
  name,
  type,
  autoComplete,
  required = false,
  minLength,
  defaultValue,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue}
        className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-white/20"
      />
    </label>
  );
}
