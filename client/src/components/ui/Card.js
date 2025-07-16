import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold text-neutral-900", className)}
    {...props}
  >
    {children}
  </h3>
));

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-neutral-600 mt-2", className)}
    {...props}
  >
    {children}
  </p>
));

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 flex items-center", className)}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
