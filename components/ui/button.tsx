import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
  secondary:
    'border border-border-strong bg-transparent text-foreground hover:bg-surface active:bg-surface',
  danger:
    'border border-danger/40 bg-transparent text-danger hover:bg-danger-surface active:bg-danger-surface',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

// Shared button used across forms, the sign-out control, and destructive
// actions, so the color/radius/size stay consistent everywhere.
export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`focus-ring rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
