import React from 'react';

export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || `textarea-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        required={required}
        className={`
          block w-full rounded-lg border text-sm transition-all duration-200 px-4 py-2.5
          ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 dark:bg-slate-900 dark:text-red-200' 
            : 'border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400'
          }
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
