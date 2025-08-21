import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, serviceCategories } from '../data/services';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ServiceDetailModal from '../components/ServiceDetailModal';
import { useGSAP, animations } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ServiceCard = ({ service, index, onViewDetails }) => {
  const navigate = useNavigate();
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
                {service.serviceType === 'laundry' ? 'Từ ' : ''}{service.price.toLocaleString()}đ
              </span>
              <span className="text-neutral-500">/{service.unit}</span>
            </div>
            <span className="text-sm text-neutral-500">{service.duration}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(service)}
            >
              Xem chi tiết
            </Button>
            <Button
              className="flex-1 group"
              onClick={() => navigate('/booking', { state: { serviceType: service.id } })}
            >
              Đặt ngay
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter and sort services
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.bookings - a.bookings;
    }
  });

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleBookService = (service, serviceData) => {
    navigate('/booking', {
      state: {
        serviceType: service.id,
        serviceData: serviceData
      }
    });
  };

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Dịch vụ <span className="text-primary-600">MyMaid</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Từ dọn dẹp nhà cửa đến chăm sóc trẻ em, chúng tôi cung cấp đầy đủ các dịch vụ
            giúp việc chuyên nghiệp với chất lượng cao nhất
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-neutral-700">Sắp xếp:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price-low">Giá thấp nhất</option>
                <option value="price-high">Giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div ref={categoriesRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div 
            className={`category-item rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer ${
              selectedCategory === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-neutral-700 hover:bg-primary-50'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="font-semibold text-sm">Tất cả</div>
            <div className="text-xs opacity-75">{services.length} dịch vụ</div>
          </div>
          
          {serviceCategories.map((category, index) => (
            <div 
              key={category.id} 
              className={`category-item rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer ${
                selectedCategory === category.id 
                  ? 'bg-primary-600 text-white' 
                  : category.color
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-semibold text-sm">{category.name}</div>
              <div className="text-xs opacity-75">{category.count} dịch vụ</div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Không tìm thấy dịch vụ</h3>
            <p className="text-neutral-600 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
              Xem tất cả dịch vụ
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Cần tư vấn dịch vụ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Đội ngũ chuyên viên của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn chọn dịch vụ phù hợp nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/consultation')}
              >
                Liên hệ tư vấn
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-primary-600"
                onClick={() => navigate('/pricing')}
              >
                Xem bảng giá
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookService={handleBookService}
      />
    </div>
  );
};

export default ServicesPage; 