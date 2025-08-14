import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { microAnimations } from '../../utils/gsapAnimations';

const PremiumInput = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus animations
  const handleFocus = (e) => {
    setIsFocused(true);
    if (containerRef.current) {
      microAnimations.hoverLift(containerRef.current);
    }
    if (onFocus) onFocus(e);
  };

  // Handle blur animations
  const handleBlur = (e) => {
    setIsFocused(false);
    if (containerRef.current) {
      microAnimations.hoverReset(containerRef.current);
    }
    if (onBlur) onBlur(e);
  };

  // Error shake animation
  useEffect(() => {
    if (error && containerRef.current) {
      microAnimations.shake(containerRef.current);
    }
  }, [error]);

  // Success pulse animation
  useEffect(() => {
    if (success && containerRef.current) {
      microAnimations.successPulse(containerRef.current);
    }
  }, [success]);

  // Variant styles
  const variantStyles = {
    default: `
      bg-white border border-neutral-200 
      focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200
    `,
    glass: `
      bg-white/80 backdrop-blur-xl border border-white/50 
      focus-within:border-primary-400 focus-within:bg-white/90
    `,
    minimal: `
      bg-transparent border-b-2 border-neutral-200 rounded-none
      focus-within:border-primary-500
    `,
    filled: `
      bg-neutral-100 border border-transparent 
      focus-within:bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200
    `
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  // State styles
  const getStateStyles = () => {
    if (error) {
      return 'border-error-500 focus-within:border-error-500 focus-within:ring-error-200';
    }
    if (success) {
      return 'border-success-500 focus-within:border-success-500 focus-within:ring-success-200';
    }
    return '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className={`
          block text-sm font-medium transition-colors duration-200
          ${error ? 'text-error-600' : success ? 'text-success-600' : 'text-neutral-700'}
        `}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div
        ref={containerRef}
        className={`
          relative flex items-center transition-all duration-300 rounded-xl
          transform-gpu will-change-transform
          ${variantStyles[variant]}
          ${getStateStyles()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className={`
            flex items-center justify-center ml-3
            ${isFocused ? 'text-primary-500' : 'text-neutral-400'}
            transition-colors duration-200
          `}>
            <Icon size={20} />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 bg-transparent border-none outline-none
            placeholder-neutral-400 text-neutral-900
            ${sizeStyles[size]}
            ${Icon && iconPosition === 'left' ? 'pl-2' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-2' : ''}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          {...props}
        />

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <div className={`
            flex items-center justify-center mr-3
            ${isFocused ? 'text-primary-500' : 'text-neutral-400'}
            transition-colors duration-200
          `}>
            <Icon size={20} />
          </div>
        )}

        {/* Focus Ring */}
        <div className={`
          absolute inset-0 rounded-xl pointer-events-none
          transition-all duration-200
          ${isFocused ? 'ring-2 ring-primary-200 ring-opacity-50' : ''}
        `} />
      </div>

      {/* Helper Text */}
      {(error || success) && (
        <div className={`
          text-sm font-medium transition-colors duration-200
          ${error ? 'text-error-600' : 'text-success-600'}
        `}>
          {error || success}
        </div>
      )}

      {/* Floating Label Animation */}
      {variant === 'minimal' && label && (
        <div className={`
          absolute left-0 transition-all duration-200 pointer-events-none
          ${isFocused || value ? 'top-0 text-xs text-primary-500' : 'top-3 text-base text-neutral-400'}
        `}>
          {label}
        </div>
      )}
    </div>
  );
};

PremiumInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  success: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['default', 'glass', 'minimal', 'filled']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default PremiumInput;
