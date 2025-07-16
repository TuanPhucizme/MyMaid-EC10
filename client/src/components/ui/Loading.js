import React from 'react';
import { cn } from '../../utils/cn';

const Loading = ({ 
  size = 'md', 
  variant = 'spinner',
  className,
  text = 'Đang tải...'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const SpinnerLoader = () => (
    <div className={cn('animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500', sizes[size])} />
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary-500 animate-bounce',
            size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <div className={cn('rounded-full bg-primary-500 animate-pulse', sizes[size])} />
  );

  const BarsLoader = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary-500 animate-pulse',
            size === 'sm' ? 'w-1' : size === 'lg' ? 'w-2' : 'w-1.5',
            'h-4'
          )}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: `${Math.random() * 20 + 10}px`
          }}
        />
      ))}
    </div>
  );

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
      <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'bars':
        return <BarsLoader />;
      case 'skeleton':
        return <SkeletonLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {renderLoader()}
      {text && variant !== 'skeleton' && (
        <p className="text-neutral-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

// Skeleton components for specific use cases
export const CardSkeleton = ({ className }) => (
  <div className={cn('animate-pulse bg-white rounded-xl p-6 shadow-soft', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-neutral-200 rounded"></div>
      <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
      <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
    </div>
    <div className="mt-6 flex space-x-2">
      <div className="h-10 bg-neutral-200 rounded flex-1"></div>
      <div className="h-10 w-10 bg-neutral-200 rounded"></div>
    </div>
  </div>
);

export const ListSkeleton = ({ items = 3, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="animate-pulse flex items-center space-x-4">
        <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="w-20 h-8 bg-neutral-200 rounded"></div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4, className }) => (
  <div className={cn('animate-pulse', className)}>
    {/* Header */}
    <div className="flex space-x-4 mb-4 pb-2 border-b border-neutral-200">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-neutral-200 rounded flex-1"></div>
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 mb-3">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="h-4 bg-neutral-200 rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

// Full page loading overlay
export const LoadingOverlay = ({ isLoading, children, text = 'Đang tải...' }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loading size="lg" text={text} />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default Loading;
