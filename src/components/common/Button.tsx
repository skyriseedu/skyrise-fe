import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon?: string;
  loading?: boolean;
  primary?: boolean;
  secondary?: boolean;
  destructive?: boolean;
  outline?: boolean;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

const Spinner = () => {
  return (
    <svg
      className="h-5 w-5 animate-spin text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const Button: React.FC<Props> = (props) => {
  const {
    className,
    loading,
    secondary,
    destructive,
    outline,
    children,
    size = 'md',
    disabled,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={clsx(
        // Base styles
        'font-roboto inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed',
        'cursor-pointer',
        // Size variants
        size === 'sm' && 'text-body-5 min-h-[36px] px-3 py-2',
        size === 'md' && 'text-body-4 min-h-[44px] px-4 py-2',
        size === 'lg' && 'text-body-2 min-h-[50px] px-6 py-3',

        // Primary variant (default)
        !secondary &&
          !destructive &&
          !outline && [
            'bg-primary hover:bg-primary/90 focus:ring-primary/50 text-white',
            'disabled:bg-text-secondary disabled:text-white',
          ],

        // Secondary variant
        secondary && [
          'bg-secondary text-primary hover:bg-secondary/80 focus:ring-secondary/50',
          'disabled:bg-text-secondary disabled:text-white',
        ],

        // Destructive variant
        destructive && [
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50',
          'disabled:bg-text-secondary disabled:text-white',
        ],

        // Outline variant
        outline && [
          'border-primary text-primary hover:bg-primary focus:ring-primary/50 border-2 bg-transparent hover:text-white',
          'disabled:border-text-secondary disabled:text-text-secondary disabled:hover:text-text-secondary disabled:hover:bg-transparent',
        ],

        className
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner />
          {children && <span className="ml-2">{children}</span>}
        </div>
      ) : (
        (children ?? 'Button')
      )}
    </button>
  );
};

export default Button;
