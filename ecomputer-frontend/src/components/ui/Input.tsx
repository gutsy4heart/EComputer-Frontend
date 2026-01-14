import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', readOnly, ...props }, ref) => {
  
    const baseClasses = 'px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--darker-surface)] text-[var(--text-primary)]';
 
    const errorClasses = error
      ? 'border-[var(--danger)] focus:ring-[var(--danger)] focus:border-[var(--danger)]'
      : 'border-[var(--border-color)]';
 
    const readonlyClasses = readOnly 
      ? 'cursor-not-allowed bg-[var(--disabled-bg)] text-[var(--disabled-text)]' 
      : '';
 
    const widthClasses = fullWidth ? 'w-full' : '';
    
 
    const classes = `${baseClasses} ${errorClasses} ${readonlyClasses} ${widthClasses} ${className}`;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className={`block text-sm font-medium text-[var(--text-secondary)] mb-1 ${
            readOnly ? 'text-[var(--disabled-text)]' : ''
          }`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classes}
          readOnly={readOnly}
          aria-readonly={readOnly}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';