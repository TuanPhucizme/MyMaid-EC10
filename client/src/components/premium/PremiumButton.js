import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { microAnimations } from '../../utils/gsapAnimations';

const PremiumButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const buttonRef = useRef(null);

  // Handle hover animations
  useEffect(() => {
    const button = buttonRef.current;
    if (!button || disabled || loading) return;

    const handleMouseEnter = () => {
      microAnimations.hoverLift(button);
    };

    const handleMouseLeave = () => {
      microAnimations.hoverReset(button);
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, loading]);

  // Handle click animation
  const handleClick = (e) => {
    if (disabled || loading) return;
    
    microAnimations.buttonPress(buttonRef.current);
    
    if (onClick) {
      onClick(e);
    }
  };

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600 
      hover:from-primary-600 hover:to-primary-700
      text-white shadow-primary border-transparent
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500 to-secondary-600 
      hover:from-secondary-600 hover:to-secondary-700
      text-white shadow-secondary border-transparent
    `,
    accent: `
      bg-gradient-to-r from-accent-500 to-accent-600 
      hover:from-accent-600 hover:to-accent-700
      text-white shadow-accent border-transparent
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600 
      hover:from-success-600 hover:to-success-700
      text-white shadow-success border-transparent
    `,
    warning: `
      bg-gradient-to-r from-warning-500 to-warning-600 
      hover:from-warning-600 hover:to-warning-700
      text-white shadow-warning border-transparent
    `,
    error: `
      bg-gradient-to-r from-error-500 to-error-600 
      hover:from-error-600 hover:to-error-700
      text-white shadow-error border-transparent
    `,
    outline: `
      bg-transparent border-2 border-primary-500 text-primary-600
      hover:bg-primary-50 hover:border-primary-600 hover:text-primary-700
    `,
    ghost: `
      bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700
      border-transparent
    `,
    glass: `
      bg-white/20 backdrop-blur-xl border border-white/30 text-white
      hover:bg-white/30 hover:border-white/40
    `
  };

  // Size styles
  const sizeStyles = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Disabled styles
  const disabledStyles = disabled || loading ? `
    opacity-50 cursor-not-allowed pointer-events-none
  ` : '';

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-semibold rounded-xl transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-primary-200
        transform-gpu will-change-transform
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && iconPosition === 'left' && <Icon size={20} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon size={20} />}
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-white/20 transform scale-0 rounded-full transition-transform duration-300 group-active:scale-100" />
      </div>
    </button>
  );
};

PremiumButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'outline', 'ghost', 'glass']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default PremiumButton;
