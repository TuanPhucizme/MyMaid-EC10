import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors";
  
  const variants = {
    default: "bg-neutral-100 text-neutral-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    outline: "border border-neutral-300 text-neutral-700 bg-transparent"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs rounded-md",
    md: "px-2.5 py-1 text-sm rounded-lg",
    lg: "px-3 py-1.5 text-base rounded-xl"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
