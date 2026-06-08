import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200";

  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-indigo-50 text-indigo-900 border border-indigo-150",
    success: "bg-green-50 text-green-800 border border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-250",
    danger: "bg-red-50 text-red-800 border border-red-200"
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
