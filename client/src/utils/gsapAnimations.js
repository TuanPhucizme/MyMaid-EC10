// GSAP Animation utilities for premium UI
import { gsap } from 'gsap';

// Set GSAP defaults for smooth animations
gsap.defaults({
  duration: 0.6,
  ease: "power2.out"
});

/**
 * Premium entrance animations
 */
export const entranceAnimations = {
  // Fade in with scale
  fadeInScale: (element, options = {}) => {
    return gsap.fromTo(element, 
      { 
        opacity: 0, 
        scale: 0.9,
        y: 20
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        ...options
      }
    );
  },

  // Slide in from bottom with bounce
  slideInBottom: (element, options = {}) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        y: 100,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        ...options
      }
    );
  },

  // Stagger animation for lists
  staggerIn: (elements, options = {}) => {
    return gsap.fromTo(elements,
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        ...options
      }
    );
  },

  // Dropdown animation
  dropdownIn: (element, options = {}) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scaleY: 0,
        transformOrigin: "top center",
        y: -10
      },
      {
        opacity: 1,
        scaleY: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
        ...options
      }
    );
  },

  // Modal animation
  modalIn: (backdrop, modal, options = {}) => {
    const tl = gsap.timeline();
    
    tl.fromTo(backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
    .fromTo(modal,
      { 
        opacity: 0, 
        scale: 0.8,
        y: 50
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      },
      "-=0.1"
    );

    return tl;
  }
};

/**
 * Premium exit animations
 */
export const exitAnimations = {
  // Fade out with scale
  fadeOutScale: (element, options = {}) => {
    return gsap.to(element, {
      opacity: 0,
      scale: 0.9,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      ...options
    });
  },

  // Slide out to bottom
  slideOutBottom: (element, options = {}) => {
    return gsap.to(element, {
      opacity: 0,
      y: 100,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
      ...options
    });
  },

  // Dropdown out
  dropdownOut: (element, options = {}) => {
    return gsap.to(element, {
      opacity: 0,
      scaleY: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      transformOrigin: "top center",
      ...options
    });
  },

  // Modal out
  modalOut: (backdrop, modal, options = {}) => {
    const tl = gsap.timeline();
    
    tl.to(modal, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(backdrop, {
      opacity: 0,
      duration: 0.2
    }, "-=0.1");

    return tl;
  }
};

/**
 * Micro-interactions
 */
export const microAnimations = {
  // Button press effect
  buttonPress: (element) => {
    return gsap.to(element, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  },

  // Hover lift effect
  hoverLift: (element) => {
    return gsap.to(element, {
      y: -4,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      duration: 0.3,
      ease: "power2.out"
    });
  },

  // Hover reset
  hoverReset: (element) => {
    return gsap.to(element, {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      duration: 0.3,
      ease: "power2.out"
    });
  },

  // Shake animation for errors
  shake: (element) => {
    return gsap.to(element, {
      x: [-5, 5, -5, 5, 0],
      duration: 0.5,
      ease: "power2.inOut"
    });
  },

  // Success pulse
  successPulse: (element) => {
    return gsap.to(element, {
      scale: [1, 1.05, 1],
      duration: 0.6,
      ease: "power2.inOut"
    });
  },

  // Loading pulse
  loadingPulse: (element) => {
    return gsap.to(element, {
      opacity: [1, 0.5, 1],
      duration: 1.5,
      repeat: -1,
      ease: "power2.inOut"
    });
  },

  // Glow effect
  glow: (element, color = "#0ea5e9") => {
    return gsap.to(element, {
      boxShadow: `0 0 20px ${color}`,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });
  }
};

/**
 * Page transitions
 */
export const pageTransitions = {
  // Slide transition
  slideTransition: (outElement, inElement, direction = "left") => {
    const tl = gsap.timeline();
    const xOut = direction === "left" ? -100 : 100;
    const xIn = direction === "left" ? 100 : -100;

    tl.to(outElement, {
      x: xOut,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    })
    .fromTo(inElement, {
      x: xIn,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

    return tl;
  },

  // Fade transition
  fadeTransition: (outElement, inElement) => {
    const tl = gsap.timeline();

    tl.to(outElement, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    })
    .fromTo(inElement, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.1");

    return tl;
  }
};

/**
 * Utility functions
 */
export const animationUtils = {
  // Kill all animations on element
  killAnimations: (element) => {
    gsap.killTweensOf(element);
  },

  // Set element to initial state
  resetElement: (element) => {
    gsap.set(element, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0,
      clearProps: "all"
    });
  },

  // Create timeline
  createTimeline: (options = {}) => {
    return gsap.timeline(options);
  },

  // Batch animate elements
  batch: (elements, animation, options = {}) => {
    return gsap.to(elements, {
      ...animation,
      stagger: 0.1,
      ...options
    });
  }
};

export default {
  entranceAnimations,
  exitAnimations,
  microAnimations,
  pageTransitions,
  animationUtils
};
