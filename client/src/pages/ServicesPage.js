import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../data/services";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useGSAP, animations } from "../hooks/useGSAP";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

// === Icons ===
const IconCheck = () => (
  <span className="text-green-500 mr-2">✓</span>
);
const IconSearch = () => (
  <svg
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
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

// === Service Card ===
const ServiceCard = ({ service, index }) => {
  const navigate = useNavigate();
  const { ref, hasIntersected } = useIntersectionObserver();

  const cardRef = useGSAP(
    (gsap, element) => {
      if (!hasIntersected) return;

      animations.fadeInUp(element, index * 0.1);

      const handleHover = (y, scale) =>
        gsap.to(element, { y, scale, duration: 0.3, ease: "power2.out" });

      element.addEventListener("mouseenter", () => handleHover(-8, 1.02));
      element.addEventListener("mouseleave", () => handleHover(0, 1));

      return () => {
        element.removeEventListener("mouseenter", handleHover);
        element.removeEventListener("mouseleave", handleHover);
      };
    },
    [hasIntersected]
  );

  return (
    <div ref={ref}>
      <Card
        ref={cardRef}
        className="h-full group cursor-pointer transition-all duration-300 hover:shadow-large"
      >
        {/* Image */}
        <div className="relative">
          <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {service.popular && <Badge variant="danger">Phổ biến</Badge>}
            {service.isNew && <Badge variant="success">Mới</Badge>}
            {service.discount && <Badge variant="warning">-{service.discount}%</Badge>}
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium">
            ⭐ {service.rating}
          </div>
        </div>

        {/* Info */}
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{service.icon}</span>
            <span className="text-sm text-neutral-500">{service.bookings} đặt</span>
          </div>
          <CardTitle className="text-lg">{service.name}</CardTitle>
          {service.subtitle && (
            <p className="text-sm text-neutral-600">{service.subtitle}</p>
          )}
        </CardHeader>

        <CardContent>
          <p className="text-neutral-600 text-sm">{service.description}</p>

          {/* Features */}
          <div className="space-y-2">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-neutral-600">
                <IconCheck />
                {feature}
              </div>
            ))}
          </div>

          {/* Price & Duration */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                {service.price.toLocaleString()}đ
              </span>
              <span className="text-neutral-500">/{service.unit}</span>
            </div>
            <span className="text-sm text-neutral-500">{service.duration}</span>
          </div>

          {/* Button */}
          <Button
            className="w-full group"
            onClick={() => navigate("/booking", { state: { serviceType: service.id } })}
          >
            Đặt ngay
            <IconArrowRight />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// === Main Page ===
const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const { ref: sectionRef, hasIntersected } = useIntersectionObserver();

  const titleRef = useGSAP(
    (gsap, element) => hasIntersected && animations.fadeInUp(element),
    [hasIntersected]
  );
  const categoriesRef = useGSAP(
    (gsap, element) => hasIntersected && animations.staggerChildren(element, ".category-item", 0.1),
    [hasIntersected]
  );

  // Filter + Sort (memoized)
  const filteredServices = useMemo(() => {
    return services
      .filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "popular":
          default:
            return b.bookings - a.bookings;
        }
      });
  }, [searchTerm, sortBy]);

  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mt-8 mb-2">
            Dịch vụ <span className="text-primary-600">MyMaid</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Từ dọn dẹp nhà cửa đến chăm sóc trẻ em, chúng tôi cung cấp đầy đủ các dịch vụ
            giúp việc chuyên nghiệp với chất lượng cao nhất
          </p>
        </div>

        {/* Search + Sort */}
        <div className="mb-8 flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <IconSearch />
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

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconSearch />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Không tìm thấy dịch vụ</h3>
            <p className="text-neutral-600 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
            <Button onClick={() => setSearchTerm("")}>Xem tất cả dịch vụ</Button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Cần tư vấn dịch vụ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Đội ngũ chuyên viên của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn chọn dịch vụ phù hợp nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={() => navigate("/consultation")}>
                Liên hệ tư vấn
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
                onClick={() => navigate("/pricing")}
              >
                Xem bảng giá
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
