import React, { useEffect, useRef } from 'react';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';

const Hero = () => {
  const heroRef = useGSAP((gsap, element) => {
    const tl = gsap.timeline();
    
    // Animate hero content
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo('.hero-buttons',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo('.hero-stats',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.2"
    );

    // Animate floating elements
    gsap.to('.floating-1', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    gsap.to('.floating-2', {
      y: -15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 0.5
    });

    gsap.to('.floating-3', {
      y: -25,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 1
    });
  });

  const statsRef = useRef();

  useEffect(() => {
    // Animate counter numbers
    const counters = statsRef.current?.querySelectorAll('.counter');
    counters?.forEach((counter, index) => {
      const endValue = parseInt(counter.dataset.count);
      animations.countUp(counter, endValue, 2 + index * 0.2);
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-1 absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20"></div>
        <div className="floating-2 absolute top-40 right-20 w-16 h-16 bg-secondary-300 rounded-full opacity-30"></div>
        <div className="floating-3 absolute bottom-40 left-1/4 w-24 h-24 bg-accent-200 rounded-full opacity-25"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent-300 to-primary-300 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="hero-title">
              <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 leading-tight">
                Tìm người
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                  {" "}giúp việc{" "}
                </span>
                hoàn hảo
              </h1>
            </div>
            
            <div className="hero-subtitle mt-6">
              <p className="text-xl lg:text-2xl text-neutral-600 leading-relaxed">
                Kết nối với hàng nghìn người giúp việc chuyên nghiệp, 
                uy tín và đáng tin cậy tại TP.HCM
              </p>
            </div>

            <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" className="group">
                Tìm người giúp việc
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
              <Button variant="outline" size="xl">
                Trở thành đối tác
              </Button>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="hero-stats mt-12 grid grid-cols-3 gap-8">
              <div className="text-center lg:text-left">
                <div className="counter text-3xl lg:text-4xl font-bold text-primary-600" data-count="1250">0</div>
                <div className="text-neutral-600 mt-1">Người giúp việc</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="counter text-3xl lg:text-4xl font-bold text-secondary-600" data-count="15600">0</div>
                <div className="text-neutral-600 mt-1">Đơn hoàn thành</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-accent-600">
                  <span className="counter" data-count="98">0</span>%
                </div>
                <div className="text-neutral-600 mt-1">Hài lòng</div>
              </div>
            </div>
          </div>

          {/* Right content - Hero image/illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop"
                alt="Professional cleaning service"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 floating-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Đã xác minh</div>
                    <div className="text-xs text-neutral-500">100% an toàn</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 floating-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">⭐</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">4.9/5 sao</div>
                    <div className="text-xs text-neutral-500">Đánh giá cao</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-white rounded-2xl shadow-lg p-4 floating-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">24/7</div>
                  <div className="text-xs text-neutral-500">Hỗ trợ</div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
