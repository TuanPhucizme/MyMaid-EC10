import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = (animationCallback, dependencies = []) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      animationCallback(gsap, element);
    }, element);

    return () => ctx.revert();
  }, dependencies);

  return ref;
};

// Common animation presets
export const animations = {
  fadeInUp: (element, delay = 0) => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay,
        ease: "power2.out" 
      }
    );
  },

  fadeInLeft: (element, delay = 0) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        x: -50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: "power2.out"
      }
    );
  },

  fadeInRight: (element, delay = 0) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        x: 50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: "power2.out"
      }
    );
  },

  scaleIn: (element, delay = 0) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.8
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "back.out(1.7)"
      }
    );
  },

  staggerChildren: (container, childSelector, delay = 0.1) => {
    const children = container.querySelectorAll(childSelector);
    gsap.fromTo(children,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: delay,
        ease: "power2.out"
      }
    );
  },

  parallax: (element, speed = 0.5) => {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  },

  countUp: (element, endValue, duration = 2) => {
    const obj = { value: 0 };
    gsap.to(obj, {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toLocaleString();
      }
    });
  },

  typewriter: (element, text, speed = 0.05) => {
    element.textContent = '';
    const chars = text.split('');
    
    gsap.to({}, {
      duration: chars.length * speed,
      ease: "none",
      onUpdate: function() {
        const progress = this.progress();
        const currentIndex = Math.floor(progress * chars.length);
        element.textContent = chars.slice(0, currentIndex).join('');
      }
    });
  },

  morphPath: (path, newPath, duration = 1) => {
    gsap.to(path, {
      duration,
      attr: { d: newPath },
      ease: "power2.inOut"
    });
  },

  infiniteRotate: (element, duration = 10) => {
    gsap.to(element, {
      rotation: 360,
      duration,
      repeat: -1,
      ease: "none"
    });
  },

  hoverScale: (element, scale = 1.05) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(element, {
      scale,
      duration: 0.3,
      ease: "power2.out"
    });

    element.addEventListener('mouseenter', () => tl.play());
    element.addEventListener('mouseleave', () => tl.reverse());
  },

  slideInFromBottom: (element, delay = 0) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "power3.out"
      }
    );
  }
};
