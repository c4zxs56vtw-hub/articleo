import React from 'react';
import Loader from './Loader';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98";

  const variants = {
    primary: "bg-indigo-900 hover:bg-indigo-950 text-white focus:ring-indigo-800 shadow-sm",
    secondary: "bg-slate-200 hover:bg-slate-350 text-slate-800 focus:ring-slate-400",
    outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader size="small" className="mr-2 border-t-white" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
