import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useGSAP } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ConsultationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
    preferredTime: '',
    urgency: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref: pageRef, hasIntersected } = useIntersectionObserver();
  
  const contentRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      gsap.fromTo('.consultation-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [hasIntersected]);

  const services = [
    { id: 'cleaning', name: 'Dọn dẹp nhà cửa', icon: '🏠' },
    { id: 'laundry', name: 'Giặt ủi', icon: '👕' },
    { id: 'other', name: 'Dịch vụ khác', icon: '✨' }
  ];

  const timeSlots = [
    '08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', 
    '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00'
  ];

  const urgencyLevels = [
    { id: 'low', name: 'Không gấp', color: 'text-green-600' },
    { id: 'normal', name: 'Bình thường', color: 'text-blue-600' },
    { id: 'high', name: 'Gấp', color: 'text-orange-600' },
    { id: 'urgent', name: 'Rất gấp', color: 'text-red-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId
    }));
  };

  const handleUrgencySelect = (urgencyId) => {
    setFormData(prev => ({
      ...prev,
      urgency: urgencyId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.');
              navigate('/my-orders');
    }, 2000);
  };

  const selectedService = services.find(s => s.id === formData.service);
  const selectedUrgency = urgencyLevels.find(u => u.id === formData.urgency);

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="consultation-content">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Liên Hệ Tư Vấn
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Đội ngũ chuyên viên tư vấn của chúng tôi sẵn sàng hỗ trợ bạn chọn dịch vụ phù hợp nhất. 
              Hãy để lại thông tin và chúng tôi sẽ liên hệ trong thời gian sớm nhất.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Thông Tin Liên Hệ
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nhập email (không bắt buộc)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Thời gian liên hệ phù hợp
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Chọn thời gian</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-4">
                      Dịch vụ quan tâm *
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.service === service.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-neutral-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{service.icon}</span>
                            <span className="font-medium text-neutral-900">
                              {service.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-4">
                      Mức độ ưu tiên
                    </label>
                    <div className="grid md:grid-cols-4 gap-3">
                      {urgencyLevels.map((urgency) => (
                        <div
                          key={urgency.id}
                          onClick={() => handleUrgencySelect(urgency.id)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                            formData.urgency === urgency.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-neutral-200 hover:border-primary-300'
                          }`}
                        >
                          <span className={`font-medium ${urgency.color}`}>
                            {urgency.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nội dung cần tư vấn *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Mô tả chi tiết nhu cầu của bạn để chúng tôi có thể tư vấn tốt nhất..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[150px]"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Information Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Thông Tin Liên Hệ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600">📞</span>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Hotline</p>
                      <p className="text-neutral-600">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600">📧</span>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Email</p>
                      <p className="text-neutral-600">tuvan@mymaid.vn</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600">🕒</span>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Giờ làm việc</p>
                      <p className="text-neutral-600">7:00 - 22:00 (T2-CN)</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Why Choose Us */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Tại Sao Chọn MyMaid?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <p className="text-sm text-neutral-600">
                      Tư vấn miễn phí, không ràng buộc
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <p className="text-sm text-neutral-600">
                      Đội ngũ chuyên viên giàu kinh nghiệm
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <p className="text-sm text-neutral-600">
                      Phản hồi nhanh chóng trong 24h
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <p className="text-sm text-neutral-600">
                      Giải pháp tùy chỉnh theo nhu cầu
                    </p>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Hành Động Nhanh
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/booking')}
                  >
                    Đặt dịch vụ ngay
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/services')}
                  >
                    Xem bảng giá
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/services')}
                  >
                    Tìm hiểu thêm
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Summary Section */}
          {selectedService && (
            <div className="mt-12">
              <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Tóm Tắt Yêu Cầu
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedService.icon}</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Dịch vụ</p>
                      <p className="text-neutral-600">{selectedService.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Thời gian</p>
                      <p className="text-neutral-600">{formData.preferredTime || 'Chưa chọn'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🚨</span>
                    <div>
                      <p className="font-semibold text-neutral-900">Mức độ ưu tiên</p>
                      <p className={`${selectedUrgency?.color}`}>{selectedUrgency?.name}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage; 