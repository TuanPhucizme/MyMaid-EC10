import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { entranceAnimations, exitAnimations } from '../../utils/gsapAnimations';

const PremiumModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closeOnOverlay = true,
  showCloseButton = true,
  className = ''
}) => {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen && backdropRef.current && modalRef.current) {
      entranceAnimations.modalIn(backdropRef.current, modalRef.current);
    }
  }, [isOpen]);

  // Handle close with animation
  const handleClose = () => {
    if (backdropRef.current && modalRef.current) {
      exitAnimations.modalOut(backdropRef.current, modalRef.current).then(() => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size styles
  const sizeStyles = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Variant styles
  const variantStyles = {
    default: `
      bg-white border border-neutral-200/50 shadow-luxury
    `,
    glass: `
      bg-white/80 backdrop-blur-xl border border-white/50 shadow-luxury
    `,
    dark: `
      bg-neutral-900 border border-neutral-700/50 shadow-luxury text-white
    `,
    gradient: `
      bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 
      text-white shadow-luxury border-transparent
    `
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeStyles[size]} 
          ${variantStyles[variant]}
          rounded-3xl overflow-hidden
          transform-gpu will-change-transform
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200/50">
            {title && (
              <h2 className="text-xl font-bold text-neutral-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="
                  p-2 rounded-xl hover:bg-neutral-100 
                  text-neutral-500 hover:text-neutral-700
                  transition-all duration-200 hover:scale-105
                "
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>
    </div>
  );
};

PremiumModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  variant: PropTypes.oneOf(['default', 'glass', 'dark', 'gradient']),
  closeOnOverlay: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string
};

export default PremiumModal;
