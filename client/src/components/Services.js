import React from 'react';
import { useNavigate } from 'react-router-dom';
import { services, serviceCategories } from '../data/services';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// === Icons ===
const IconCheck = () => (
  <span className="text-green-500 mr-2">✓</span>
);
const IconArrowRight = () => (
  <svg
    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ServiceCard = ({ service, index }) => {
  const navigate = useNavigate();
  const { ref, hasIntersected } = useIntersectionObserver();

  const cardRef = useGSAP((gsap, element) => {
    if (!hasIntersected) return; // Only animate if intersected

    animations.fadeInUp(element, index * 0.1);

    // Hover animations
    const handleHover = (y, scale) =>
      gsap.to(element, { y, scale, duration: 0.3, ease: "power2.out" });

    element.addEventListener('mouseenter', () => handleHover(-8, 1.02));
    element.addEventListener('mouseleave', () => handleHover(0, 1));

    return () => {
      element.removeEventListener('mouseenter', () => handleHover(-8, 1.02)); // Remove with original function reference
      element.removeEventListener('mouseleave', () => handleHover(0, 1)); // Remove with original function reference
    };
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

        <CardHeader className="space-y-2"> {/* Changed from mb-2 to space-y-2 on CardHeader */}
          <div className="flex items-center justify-between">
            <span className="text-2xl">{service.icon}</span>
            <span className="text-sm text-neutral-500">{service.bookings} đặt</span>
          </div>
          <CardTitle className="text-lg">{service.name}</CardTitle>
          {service.subtitle && (
            <p className="text-sm text-neutral-600 mt-1">{service.subtitle}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4"> {/* Added space-y-4 for consistency */}
          <p className="text-neutral-600 text-sm">{service.description}</p> {/* Removed mb-4 */}

          <div className="space-y-2"> {/* Removed mb-4 */}
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-neutral-600 gap-2"> {/* Added gap-2 and IconCheck */}
                <IconCheck />
                {feature}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between"> {/* Removed mb-4 */}
            <div>
              <span className="text-2xl font-bold text-primary-600">
                {service.price.toLocaleString()}đ
              </span>
              <span className="ml-1 text-neutral-500">/{service.unit}</span> {/* Added ml-1 */}
            </div>
            <span className="text-sm text-neutral-500">{service.duration}</span>
          </div>

          <Button
            className="w-full group"
            onClick={() => navigate('/booking', { state: { serviceType: service.id } })}
          >
            Đặt ngay
            <IconArrowRight /> {/* Replaced inline SVG with IconArrowRight */}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
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
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mt-8 mb-2"> {/* Updated h2 to match ServicesPage h1 */}
            Dịch vụ <span className="text-primary-600">MyMaid</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Từ dọn dẹp nhà cửa đến chăm sóc trẻ em, chúng tôi cung cấp đầy đủ các dịch vụ
            giúp việc chuyên nghiệp với chất lượng cao nhất
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/services')}
          >
            Xem tất cả dịch vụ
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;