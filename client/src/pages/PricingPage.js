import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useGSAP } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const PricingPage = () => {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState('2h');
  const [selectedFrequency, setSelectedFrequency] = useState('one-time');

  const { ref: pageRef, hasIntersected } = useIntersectionObserver();
  
  const contentRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      gsap.fromTo('.pricing-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [hasIntersected]);

  const services = [
    {
      id: 'cleaning',
      name: 'Dọn dẹp nhà cửa',
      icon: '🏠',
      description: 'Dọn dẹp tổng thể nhà cửa, vệ sinh các khu vực chung',
      basePrice: 150000,
      features: [
        'Dọn dẹp phòng khách, phòng ngủ',
        'Vệ sinh nhà bếp, phòng tắm',
        'Lau chùi cửa sổ, gương',
        'Hút bụi, lau sàn',
        'Dọn dẹp rác thải'
      ]
    },
    {
      id: 'laundry',
      name: 'Giặt ủi',
      icon: '👕',
      description: 'Giặt ủi quần áo, chăn màn, rèm cửa',
      basePrice: 100000,
      features: [
        'Giặt quần áo thường',
        'Giặt đồ len, đồ nhạy cảm',
        'Ủi phẳng quần áo',
        'Gấp xếp gọn gàng',
        'Phân loại theo màu sắc'
      ]
    },
    {
      id: 'childcare',
      name: 'Chăm sóc trẻ em',
      icon: '👶',
      description: 'Chăm sóc, trông nom trẻ em tại nhà',
      basePrice: 200000,
      features: [
        'Trông nom trẻ em',
        'Chuẩn bị bữa ăn',
        'Hỗ trợ học tập',
        'Vui chơi an toàn',
        'Báo cáo tình hình'
      ]
    },
    {
      id: 'cooking',
      name: 'Nấu ăn',
      icon: '🍳',
      description: 'Nấu các bữa ăn ngon, đảm bảo dinh dưỡng',
      basePrice: 180000,
      features: [
        'Nấu bữa sáng, trưa, tối',
        'Chuẩn bị nguyên liệu',
        'Đảm bảo vệ sinh an toàn',
        'Phù hợp khẩu vị',
        'Dọn dẹp sau nấu'
      ]
    },
    {
      id: 'elderly-care',
      name: 'Chăm sóc người già',
      icon: '👴',
      description: 'Chăm sóc người cao tuổi, hỗ trợ sinh hoạt',
      basePrice: 250000,
      features: [
        'Hỗ trợ sinh hoạt hàng ngày',
        'Theo dõi sức khỏe',
        'Trò chuyện, tâm sự',
        'Hỗ trợ vận động',
        'Báo cáo gia đình'
      ]
    },
    {
      id: 'deep-cleaning',
      name: 'Vệ sinh chuyên sâu',
      icon: '🧹',
      description: 'Vệ sinh sâu, làm sạch các khu vực khó tiếp cận',
      basePrice: 300000,
      features: [
        'Vệ sinh sâu toàn bộ nhà',
        'Làm sạch khe kẽ, góc cạnh',
        'Vệ sinh máy lạnh, quạt',
        'Đánh bóng đồ gỗ',
        'Khử mùi, diệt khuẩn'
      ]
    }
  ];

  const durations = [
    { id: '2h', name: '2 giờ', multiplier: 1 },
    { id: '4h', name: '4 giờ', multiplier: 1.8 },
    { id: '6h', name: '6 giờ', multiplier: 2.5 },
    { id: '8h', name: '8 giờ', multiplier: 3.2 }
  ];

  const frequencies = [
    { id: 'one-time', name: 'Một lần', discount: 0 },
    { id: 'weekly', name: 'Hàng tuần', discount: 0.1 },
    { id: 'monthly', name: 'Hàng tháng', discount: 0.2 }
  ];

  const calculatePrice = (service) => {
    const duration = durations.find(d => d.id === selectedDuration);
    const frequency = frequencies.find(f => f.id === selectedFrequency);
    
    const basePrice = service.basePrice;
    const durationPrice = basePrice * duration.multiplier;
    const discountedPrice = durationPrice * (1 - frequency.discount);
    
    return Math.round(discountedPrice);
  };

  const handleBooking = (serviceId) => {
    navigate('/booking', { 
      state: { 
        serviceType: serviceId,
        duration: selectedDuration,
        frequency: selectedFrequency
      }
    });
  };

  const handleConsultation = () => {
    navigate('/consultation');
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="pricing-content">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Bảng Giá Dịch Vụ
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Bảng giá minh bạch, rõ ràng cho tất cả dịch vụ. Chọn gói phù hợp với nhu cầu và ngân sách của bạn.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12">
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Thời lượng dịch vụ
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {durations.map((duration) => (
                      <button
                        key={duration.id}
                        onClick={() => setSelectedDuration(duration.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedDuration === duration.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-neutral-200 hover:border-primary-300'
                        }`}
                      >
                        {duration.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Tần suất sử dụng
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {frequencies.map((frequency) => (
                      <button
                        key={frequency.id}
                        onClick={() => setSelectedFrequency(frequency.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedFrequency === frequency.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-neutral-200 hover:border-primary-300'
                        }`}
                      >
                        {frequency.name}
                        {frequency.discount > 0 && (
                          <Badge className="ml-2" variant="success">
                            -{frequency.discount * 100}%
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {service.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {calculatePrice(service).toLocaleString()}đ
                  </div>
                  <div className="text-sm text-neutral-500">
                    /{durations.find(d => d.id === selectedDuration)?.name}
                  </div>
                  {frequencies.find(f => f.id === selectedFrequency)?.discount > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      Tiết kiệm {Math.round(service.basePrice * frequencies.find(f => f.id === selectedFrequency)?.discount).toLocaleString()}đ
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-neutral-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => handleBooking(service.id)}
                  >
                    Đặt ngay
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleConsultation}
                  >
                    Tư vấn thêm
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pricing Table */}
          <div className="mb-16">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
                Bảng Giá Chi Tiết
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-4 px-4 font-semibold text-neutral-900">Dịch vụ</th>
                      {durations.map(duration => (
                        <th key={duration.id} className="text-center py-4 px-4 font-semibold text-neutral-900">
                          {duration.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{service.icon}</span>
                            <div>
                              <div className="font-medium text-neutral-900">{service.name}</div>
                              <div className="text-sm text-neutral-500">{service.description}</div>
                            </div>
                          </div>
                        </td>
                        {durations.map(duration => (
                          <td key={duration.id} className="text-center py-4 px-4">
                            <div className="font-semibold text-neutral-900">
                              {Math.round(service.basePrice * duration.multiplier).toLocaleString()}đ
                            </div>
                            <div className="text-sm text-neutral-500">
                              {Math.round(service.basePrice * duration.multiplier * 0.9).toLocaleString()}đ
                            </div>
                            <div className="text-xs text-green-600">(tuần)</div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Additional Services */}
          <div className="mb-16">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
                Dịch Vụ Bổ Sung
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">🚚</span>
                    <h3 className="font-semibold text-neutral-900">Chuyển nhà</h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Dịch vụ chuyển nhà trọn gói, đóng gói và vận chuyển
                  </p>
                  <div className="text-lg font-bold text-primary-600">
                    Từ 500.000đ
                  </div>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">🌿</span>
                    <h3 className="font-semibold text-neutral-900">Chăm sóc cây cảnh</h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Tưới nước, cắt tỉa, chăm sóc cây cảnh trong nhà
                  </p>
                  <div className="text-lg font-bold text-primary-600">
                    Từ 80.000đ
                  </div>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">🐕</span>
                    <h3 className="font-semibold text-neutral-900">Chăm sóc thú cưng</h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Chăm sóc, dắt chó mèo, vệ sinh chuồng trại
                  </p>
                  <div className="text-lg font-bold text-primary-600">
                    Từ 120.000đ
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Cần Tư Vấn Thêm?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Đội ngũ chuyên viên của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn chọn dịch vụ phù hợp nhất
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={handleConsultation}
                >
                  Liên hệ tư vấn
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                  onClick={() => navigate('/booking')}
                >
                  Đặt dịch vụ ngay
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 