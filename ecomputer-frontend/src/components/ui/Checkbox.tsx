 
import React, { InputHTMLAttributes, forwardRef } from 'react';

 
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', onChange, ...props }, ref) => {
 
    const baseClasses = 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';
    
 
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : '';
    
 
    const classes = `${baseClasses} ${errorClasses} ${className}`;
    
 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };
    
    return (
      <div>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={classes}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label className="ml-2 block text-sm text-gray-900">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
