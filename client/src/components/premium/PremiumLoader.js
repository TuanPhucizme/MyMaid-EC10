import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { microAnimations } from '../../utils/gsapAnimations';

const PremiumLoader = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  text = '',
  overlay = false,
  className = ''
}) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current && type === 'pulse') {
      microAnimations.loadingPulse(loaderRef.current);
    }
  }, [type]);

  // Size styles
  const sizeStyles = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color styles
  const colorStyles = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-500',
    success: 'border-success-500',
    warning: 'border-warning-500',
    error: 'border-error-500',
    white: 'border-white',
    neutral: 'border-neutral-500'
  };

  // Spinner component
  const Spinner = () => (
    <div className={`
      ${sizeStyles[size]} 
      border-3 ${colorStyles[color]} border-t-transparent 
      rounded-full animate-spin
    `} />
  );

  // Dots component
  const Dots = () => (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            w-2 h-2 bg-${color}-500 rounded-full
            animate-bounce
          `}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  // Pulse component
  const Pulse = () => (
    <div
      ref={loaderRef}
      className={`
        ${sizeStyles[size]} 
        bg-${color}-500 rounded-full
      `}
    />
  );

  // Bars component
  const Bars = () => (
    <div className="flex gap-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            w-1 bg-${color}-500 rounded-full
            animate-pulse
          `}
          style={{ 
            height: `${12 + i * 4}px`,
            animationDelay: `${i * 0.1}s` 
          }}
        />
      ))}
    </div>
  );

  // Wave component
  const Wave = () => (
    <div className="flex gap-1 items-center">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`
            w-1 h-8 bg-${color}-500 rounded-full
            animate-pulse
          `}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  // Ring component
  const Ring = () => (
    <div className={`
      ${sizeStyles[size]} 
      border-3 border-${color}-200 border-t-${color}-500 
      rounded-full animate-spin
    `} />
  );

  // Gradient Spinner
  const GradientSpinner = () => (
    <div className={`
      ${sizeStyles[size]} 
      bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500
      rounded-full animate-spin relative
    `}>
      <div className="absolute inset-1 bg-white rounded-full" />
    </div>
  );

  // Morphing component
  const Morphing = () => (
    <div className="relative">
      <div className={`
        ${sizeStyles[size]} 
        bg-${color}-500 rounded-full
        animate-ping absolute
      `} />
      <div className={`
        ${sizeStyles[size]} 
        bg-${color}-500 rounded-full
        animate-pulse relative
      `} />
    </div>
  );

  // Get loader component
  const getLoaderComponent = () => {
    switch (type) {
      case 'spinner': return <Spinner />;
      case 'dots': return <Dots />;
      case 'pulse': return <Pulse />;
      case 'bars': return <Bars />;
      case 'wave': return <Wave />;
      case 'ring': return <Ring />;
      case 'gradient': return <GradientSpinner />;
      case 'morphing': return <Morphing />;
      default: return <Spinner />;
    }
  };

  const content = (
    <div className={`
      flex flex-col items-center justify-center gap-4
      ${className}
    `}>
      {getLoaderComponent()}
      {text && (
        <div className={`
          text-sm font-medium text-${color}-600
          animate-pulse
        `}>
          {text}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-luxury">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

PremiumLoader.propTypes = {
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'bars', 'wave', 'ring', 'gradient', 'morphing']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'white', 'neutral']),
  text: PropTypes.string,
  overlay: PropTypes.bool,
  className: PropTypes.string
};

export default PremiumLoader;
