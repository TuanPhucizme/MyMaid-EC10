import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testimonials, testimonialStats } from '../data/testimonials';
import { Card, CardContent } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-neutral-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  
  const cardRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element, index * 0.15);
      
      // Hover animation
      const handleMouseEnter = () => {
        gsap.to(element, {
          y: -5,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(element, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [hasIntersected]);

  return (
    <div ref={ref}>
      <Card ref={cardRef} className="h-full hover:shadow-large transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-neutral-900">{testimonial.name}</h4>
                <p className="text-sm text-neutral-500">{testimonial.location}</p>
              </div>
            </div>
            {testimonial.verified && (
              <Badge variant="success" size="sm">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Đã xác minh
              </Badge>
            )}
          </div>

          {/* Rating and Service */}
          <div className="flex items-center justify-between mb-4">
            <StarRating rating={testimonial.rating} />
            <Badge variant="outline" size="sm">{testimonial.service}</Badge>
          </div>

          {/* Review */}
          <blockquote className="text-neutral-700 mb-4 leading-relaxed">
            "{testimonial.review}"
          </blockquote>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <span>{new Date(testimonial.date).toLocaleDateString('vi-VN')}</span>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{testimonial.helpful}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { ref: sectionRef, hasIntersected } = useIntersectionObserver();
  const navigate = useNavigate();
  
  const titleRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element);
    }
  }, [hasIntersected]);

  const statsRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.staggerChildren(element, '.stat-item', 0.1);
      
      // Animate counter numbers
      const counters = element.querySelectorAll('.counter');
      counters.forEach((counter, index) => {
        const endValue = parseInt(counter.dataset.count);
        animations.countUp(counter, endValue, 2 + index * 0.2);
      });
    }
  }, [hasIntersected]);

  // Auto-slide for mobile carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const visibleTestimonials = testimonials.slice(0, 6);

  const handleViewAllReviews = () => {
    // Navigate to a reviews page or open modal
    console.log('View all reviews');
  };

  const handleWriteReview = () => {
    navigate('/services');
  };

  const handleLearnMore = () => {
    navigate('/about-us');
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của MyMaid
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="stat-item text-center">
            <div className="counter text-3xl lg:text-4xl font-bold text-primary-600" data-count={testimonialStats.totalReviews}>0</div>
            <div className="text-neutral-600 mt-1">Đánh giá</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl lg:text-4xl font-bold text-secondary-600">
              <span className="counter" data-count={testimonialStats.averageRating * 10}>0</span>/50
            </div>
            <div className="text-neutral-600 mt-1">Điểm trung bình</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl lg:text-4xl font-bold text-accent-600">
              <span className="counter" data-count={testimonialStats.fiveStarPercent}>0</span>%
            </div>
            <div className="text-neutral-600 mt-1">5 sao</div>
          </div>
          <div className="stat-item text-center">
            <div className="text-3xl lg:text-4xl font-bold text-green-600">
              <span className="counter" data-count="99">0</span>%
            </div>
            <div className="text-neutral-600 mt-1">Sẽ giới thiệu</div>
          </div>
        </div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Testimonials Carousel - Mobile */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                  <TestimonialCard testimonial={testimonial} index={0} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWriteReview}>
              Viết đánh giá
            </Button>
            <Button variant="outline" size="lg" onClick={handleViewAllReviews}>
              Xem tất cả đánh giá
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ghost" onClick={handleLearnMore}>
              Tìm hiểu thêm về MyMaid
            </Button>
            <Button variant="ghost" onClick={() => navigate('/booking')}>
              Đặt dịch vụ ngay
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
