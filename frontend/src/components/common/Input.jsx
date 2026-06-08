import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || `input-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          required={required}
          className={`
            block w-full rounded-lg border text-sm transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500' 
              : 'border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 bg-white'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
