import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { microAnimations, entranceAnimations } from '../../utils/gsapAnimations';

const PremiumCard = ({
  children,
  variant = 'default',
  hover = true,
  glow = false,
  glass = false,
  className = '',
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    if (cardRef.current) {
      entranceAnimations.fadeInScale(cardRef.current, { delay: 0.1 });
    }
  }, []);

  // Hover animations
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !hover) return;

    const handleMouseEnter = () => {
      microAnimations.hoverLift(card);
      if (glow) {
        microAnimations.glow(card);
      }
    };

    const handleMouseLeave = () => {
      microAnimations.hoverReset(card);
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hover, glow]);

  // Click animation
  const handleClick = (e) => {
    if (onClick) {
      microAnimations.buttonPress(cardRef.current);
      onClick(e);
    }
  };

  // Variant styles
  const variantStyles = {
    default: `
      bg-white border border-neutral-200/50 shadow-soft
      hover:shadow-medium hover:border-neutral-300/50
    `,
    primary: `
      bg-gradient-to-br from-primary-50 to-primary-100 
      border border-primary-200/50 shadow-primary
      hover:shadow-primary hover:from-primary-100 hover:to-primary-200
    `,
    secondary: `
      bg-gradient-to-br from-secondary-50 to-secondary-100 
      border border-secondary-200/50 shadow-secondary
      hover:shadow-secondary hover:from-secondary-100 hover:to-secondary-200
    `,
    accent: `
      bg-gradient-to-br from-accent-50 to-accent-100 
      border border-accent-200/50 shadow-accent
      hover:shadow-accent hover:from-accent-100 hover:to-accent-200
    `,
    dark: `
      bg-gradient-to-br from-neutral-800 to-neutral-900 
      border border-neutral-700/50 shadow-luxury text-white
      hover:shadow-luxury hover:from-neutral-700 hover:to-neutral-800
    `,
    glass: `
      bg-white/20 backdrop-blur-xl border border-white/30 shadow-luxury
      hover:bg-white/30 hover:border-white/40
    `,
    gradient: `
      bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 
      text-white shadow-luxury border-transparent
      hover:shadow-glow-lg
    `
  };

  // Glass effect override
  const glassStyles = glass ? `
    bg-white/80 backdrop-blur-xl border border-white/50 shadow-luxury
    hover:bg-white/90 hover:border-white/60
  ` : '';

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`
        relative rounded-2xl transition-all duration-300 transform-gpu will-change-transform
        ${glass ? glassStyles : variantStyles[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Glow effect */}
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
    </div>
  );
};

PremiumCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'dark', 'glass', 'gradient']),
  hover: PropTypes.bool,
  glow: PropTypes.bool,
  glass: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default PremiumCard;
