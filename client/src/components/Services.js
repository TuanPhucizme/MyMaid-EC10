import React from 'react';
import { services, serviceCategories } from '../data/services';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ServiceCard = ({ service, index }) => {
  const { ref, hasIntersected } = useIntersectionObserver();

  const cardRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element, index * 0.1);

      // Hover animations
      const handleMouseEnter = () => {
        gsap.to(element, {
          y: -8,
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
      <Card ref={cardRef} className="h-full group cursor-pointer transition-all duration-300 hover:shadow-large">
        <div className="relative">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {service.popular && <Badge variant="danger">Phổ biến</Badge>}
            {service.isNew && <Badge variant="success">Mới</Badge>}
            {service.discount && <Badge variant="warning">-{service.discount}%</Badge>}
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium">
              ⭐ {service.rating}
            </div>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{service.icon}</span>
            <span className="text-sm text-neutral-500">{service.bookings} đặt</span>
          </div>
          <CardTitle className="text-lg">{service.name}</CardTitle>
          {service.subtitle && (
            <p className="text-sm text-neutral-600 mt-1">{service.subtitle}</p>
          )}
        </CardHeader>

        <CardContent>
          <p className="text-neutral-600 text-sm mb-4">{service.description}</p>

          <div className="space-y-2 mb-4">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-neutral-600">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                {service.price.toLocaleString()}đ
              </span>
              <span className="text-neutral-500">/{service.unit}</span>
            </div>
            <span className="text-sm text-neutral-500">{service.duration}</span>
          </div>

          <Button className="w-full group">
            Đặt ngay
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Services = () => {
  const { ref: sectionRef, hasIntersected } = useIntersectionObserver();

  const titleRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.fadeInUp(element);
    }
  }, [hasIntersected]);

  const categoriesRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      animations.staggerChildren(element, '.category-item', 0.1);
    }
  }, [hasIntersected]);

  return (
    <section ref={sectionRef} className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Từ dọn dẹp nhà cửa đến chăm sóc trẻ em, chúng tôi cung cấp đầy đủ các dịch vụ
            giúp việc chuyên nghiệp với chất lượng cao nhất
          </p>
        </div>

        {/* Service Categories */}
        <div ref={categoriesRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {serviceCategories.map((category, index) => (
            <div key={category.id} className="category-item">
              <div className={`${category.color} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold text-sm">{category.name}</div>
                <div className="text-xs opacity-75">{category.count} dịch vụ</div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" variant="outline">
            Xem tất cả dịch vụ
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
