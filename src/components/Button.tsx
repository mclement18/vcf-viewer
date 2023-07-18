import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, type, ...other }, ref) => (
    <button
      ref={ref}
      type={type || 'button'}
      className={`
      p-2 text-slate-500 text-sm stroke-slate-500
      first-of-type:rounded-l-md last-of-type:rounded-r-md
      first-of-type:border-l border-r border-y border-slate-700
      bg-slate-900 hover:bg-slate-700
      active:bg-slate-800
      disabled:bg-slate-800 disabled:cursor-not-allowed
      disabled:text-slate-700 disabled:stroke-slate-700
      ${className === undefined ? '' : className}
    `}
      {...other}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
