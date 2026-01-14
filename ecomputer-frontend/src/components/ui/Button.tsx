 
import React, { ButtonHTMLAttributes } from 'react';

 
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

 
export type ButtonSize = 'sm' | 'md' | 'lg';

 
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  onClick,
  ...props
}) => {
 
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
 
  const variantClasses = {
    primary: 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] focus:ring-[var(--primary-color)]',
    secondary: 'bg-[var(--dark-surface)] text-[var(--text-primary)] hover:bg-[var(--darker-surface)] focus:ring-[var(--border-color)] border border-[var(--border-color)]',
    outline: 'border border-[var(--accent-color)] bg-transparent text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:bg-opacity-10 focus:ring-[var(--accent-color)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--dark-surface)] focus:ring-[var(--border-color)]',
    danger: 'bg-[var(--danger)] text-white hover:bg-opacity-90 focus:ring-[var(--danger)]',
  };
  
 
  const sizeClasses = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
 
  const widthClasses = fullWidth ? 'w-full' : '';
  
 
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;
  
 
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('[Button] Click event triggered');
    if (onClick && !disabled && !isLoading) {
      console.log('[Button] Calling onClick handler');
      onClick(e);
    }
  };
  
  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : null}
      {children}
    </button>
  );
};
