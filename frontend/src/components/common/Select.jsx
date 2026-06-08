import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  required = false,
  emptyOptionText = 'Sélectionner une option',
  ...props
}, ref) => {
  const selectId = id || `select-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        required={required}
        className={`
          block w-full rounded-lg border text-sm transition-all duration-200 px-4 py-2.5 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100
          ${error 
            ? 'border-red-300 text-red-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 dark:bg-slate-900 dark:text-red-200' 
            : 'border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 dark:focus:ring-indigo-400 dark:focus:border-indigo-400'
          }
        `}
        {...props}
      >
        <option value="">{emptyOptionText}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
