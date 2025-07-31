import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useGSAP } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    serviceType: location.state?.serviceType || '',
    date: '',
    time: '',
    duration: '2',
    address: '',
    phone: '',
    name: '',
    email: '',
    notes: '',
    frequency: 'one-time'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref: pageRef, hasIntersected } = useIntersectionObserver();
  
  const contentRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      gsap.fromTo('.booking-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [hasIntersected]);

  const serviceTypes = [
    { id: 'cleaning', name: 'Dọn dẹp nhà cửa', price: 150000, icon: '🏠' },
    { id: 'laundry', name: 'Giặt ủi', price: 100000, icon: '👕' },
    { id: 'childcare', name: 'Chăm sóc trẻ em', price: 200000, icon: '👶' },
    { id: 'cooking', name: 'Nấu ăn', price: 180000, icon: '🍳' },
    { id: 'elderly-care', name: 'Chăm sóc người già', price: 250000, icon: '👴' },
    { id: 'deep-cleaning', name: 'Vệ sinh chuyên sâu', price: 300000, icon: '🧹' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
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
      serviceType: serviceId
    }));
  };

  const calculatePrice = () => {
    const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
    if (!selectedService) return 0;
    
    const basePrice = selectedService.price;
    const durationMultiplier = parseInt(formData.duration) / 2;
    const frequencyDiscount = formData.frequency === 'weekly' ? 0.9 : 
                             formData.frequency === 'monthly' ? 0.8 : 1;
    
    return Math.round(basePrice * durationMultiplier * frequencyDiscount);
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.serviceType) {
      alert('Vui lòng chọn loại dịch vụ');
      return;
    }
    if (currentStep === 2 && (!formData.date || !formData.time)) {
      alert('Vui lòng chọn ngày và giờ');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
      navigate('/dashboard');
    }, 2000);
  };

  const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
  const totalPrice = calculatePrice();

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="booking-content">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Đặt Dịch Vụ
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Chọn dịch vụ phù hợp và đặt lịch ngay hôm nay để được phục vụ bởi đội ngũ chuyên nghiệp
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      Bước 1: Chọn Dịch Vụ
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.serviceType === service.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-neutral-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{service.icon}</span>
                            <div>
                              <h3 className="font-semibold text-neutral-900">
                                {service.name}
                              </h3>
                              <p className="text-sm text-neutral-600">
                                Từ {service.price.toLocaleString()}đ/2h
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      Bước 2: Chọn Thời Gian
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Ngày thực hiện
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Giờ bắt đầu
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Chọn giờ</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Thời lượng
                        </label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="2">2 giờ</option>
                          <option value="4">4 giờ</option>
                          <option value="6">6 giờ</option>
                          <option value="8">8 giờ</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tần suất
                        </label>
                        <select
                          name="frequency"
                          value={formData.frequency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="one-time">Một lần</option>
                          <option value="weekly">Hàng tuần</option>
                          <option value="monthly">Hàng tháng</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      Bước 3: Thông Tin Liên Hệ
                    </h2>
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
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Địa chỉ *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập địa chỉ chi tiết"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Ghi chú
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Mô tả thêm về yêu cầu dịch vụ..."
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Quay lại
                    </Button>
                  )}
                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <Button onClick={handleNext}>
                        Tiếp tục
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? 'Đang xử lý...' : 'Đặt dịch vụ'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Tóm Tắt Đơn Hàng
                </h3>
                
                {selectedService && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <span className="text-2xl">{selectedService.icon}</span>
                      <div>
                        <p className="font-semibold text-neutral-900">
                          {selectedService.name}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {formData.duration} giờ
                        </p>
                      </div>
                    </div>

                    {formData.date && (
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600">Ngày: {formData.date}</p>
                        <p className="text-sm text-neutral-600">Giờ: {formData.time}</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Giá cơ bản:</span>
                        <span>{selectedService.price.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Thời lượng:</span>
                        <span>{formData.duration} giờ</span>
                      </div>
                      {formData.frequency !== 'one-time' && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-neutral-600">Giảm giá:</span>
                          <span className="text-green-600">
                            {formData.frequency === 'weekly' ? '10%' : '20%'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-bold text-lg">Tổng cộng:</span>
                        <span className="font-bold text-lg text-primary-600">
                          {totalPrice.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedService && (
                  <div className="text-center py-8 text-neutral-500">
                    <p>Vui lòng chọn dịch vụ để xem tóm tắt</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 