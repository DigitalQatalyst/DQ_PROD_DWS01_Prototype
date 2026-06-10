import type { ButtonHTMLAttributes, ReactNode } from 'react';

type DqButtonVariant = 'orange' | 'navy' | 'outline' | 'ghost';

interface DqButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DqButtonVariant;
  children: ReactNode;
}

export function DqButton({ variant = 'navy', className = '', children, type = 'button', ...props }: DqButtonProps) {
  const variantClass = {
    orange: 'dq-btn-orange',
    navy: 'dq-btn-navy',
    outline: 'dq-btn-outline',
    ghost: 'dq-btn-ghost',
  }[variant];

  return (
    <button type={type} className={`dq-btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

interface DqIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function DqIconButton({ label, className = '', children, type = 'button', ...props }: DqIconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={`dq-icon-btn ${className}`} {...props}>
      {children}
    </button>
  );
}
