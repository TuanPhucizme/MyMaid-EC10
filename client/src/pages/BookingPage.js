import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useGSAP } from '../hooks/useGSAP';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import AddressSelector from '../components/AddressSelector';
import LaundryServiceForm from '../components/LaundryServiceForm';
import PricingCalculator from '../components/PricingCalculator';
import { services } from '../data/services';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    serviceType: location.state?.serviceType || '',
    serviceData: location.state?.serviceData || {},
    date: '',
    time: '',
    area: 'small', // Thêm 'area' với giá trị mặc định
    address: '',
    addressCoordinates: null, // Thêm tọa độ địa chỉ
    addressComponents: null, // Thêm thông tin chi tiết địa chỉ
    formattedAddress: '', // Thêm địa chỉ được định dạng
    phone: '',
    name: '',
    email: '',
    notes: '',
    frequency: 'one-time'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { ref: pageRef, hasIntersected } = useIntersectionObserver();
  
  const contentRef = useGSAP((gsap, element) => {
    if (hasIntersected) {
      gsap.fromTo('.booking-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [hasIntersected]);

  // Tìm service được chọn từ dữ liệu services
  useEffect(() => {
    if (formData.serviceType) {
      const service = services.find(s => s.id === formData.serviceType);
      setSelectedService(service);
    }
  }, [formData.serviceType]);



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
    // Nếu có serviceData với totalPrice, sử dụng giá đó
    if (formData.serviceData && formData.serviceData.totalPrice) {
      const frequencyDiscount = formData.frequency === 'weekly' ? 0.9 :
                               formData.frequency === 'monthly' ? 0.8 : 1;
      return Math.round(formData.serviceData.totalPrice * frequencyDiscount);
    }

    // Fallback cho các service cũ
    const selectedService = services.find(s => s.id === formData.serviceType);
    if (!selectedService) return 0;

    const basePrice = parseInt(selectedService.price.replace(/,/g, ''));
    const frequencyDiscount = formData.frequency === 'weekly' ? 0.9 :
                             formData.frequency === 'monthly' ? 0.8 : 1;

    return Math.round(basePrice * frequencyDiscount);
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
    if (currentStep === 3 && (!formData.address || !formData.addressCoordinates)) {
      alert('Vui lòng chọn địa chỉ chính xác bằng cách sử dụng bản đồ');
      return;
    }
    if (currentStep === 4 && (!formData.name || !formData.phone)) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ');
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

    // Chuyển hướng đến trang payment với dữ liệu mới
    navigate('/payment', { state: formData });
  };

  const totalPrice = calculatePrice();

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="booking-content">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Thanh Toán
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Chọn dịch vụ phù hợp và đặt lịch ngay hôm nay để được phục vụ bởi đội ngũ chuyên nghiệp
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
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
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      Bước 1: Chọn Dịch Vụ
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {services.map((service) => (
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
                                {service.serviceType === 'laundry' ? 'Từ ' : ''}{service.price}đ/{service.unit}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Service Configuration */}
                    {selectedService && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                          Tùy chỉnh dịch vụ
                        </h3>
                        {selectedService.serviceType === 'laundry' ? (
                          <LaundryServiceForm
                            service={selectedService}
                            onDataChange={(data) => setFormData(prev => ({ ...prev, serviceData: data }))}
                            formData={formData.serviceData}
                          />
                        ) : (
                          <PricingCalculator
                            service={selectedService}
                            onDataChange={(data) => setFormData(prev => ({ ...prev, serviceData: data }))}
                            formData={formData.serviceData}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2 */}
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
                              Diện tích / Quy mô
                            </label>
                            <select
                              name="area" // Đổi name thành "area"
                              value={formData.area} // value là formData.area
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              {areaOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
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

                {/* Step 3: Chọn địa chỉ */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      Bước 3: Chọn Địa Chỉ
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Địa chỉ thực hiện dịch vụ *
                        </label>
                        <AddressSelector
                          value={formData.address}
                          onChange={(address) => {
                            setFormData(prev => ({ ...prev, address }));
                          }}
                          onAddressSelect={({ address, coordinates, components, formattedAddress }) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              address, 
                              addressCoordinates: coordinates,
                              addressComponents: components,
                              formattedAddress: formattedAddress || address
                            }));
                          }}
                          placeholder="Nhập địa chỉ hoặc chọn trên bản đồ..."
                        />
                        <p className="text-sm text-neutral-500 mt-2">
                          💡 Sử dụng bản đồ để chọn địa chỉ chính xác, giúp maid dễ dàng tìm đến nhà bạn
                        </p>
                      </div>
                      
                      {formData.addressCoordinates && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start space-x-3 text-green-700">
                            <span className="text-lg">📍</span>
                            <div className="flex-1">
                              <p className="font-medium">Địa chỉ đã được xác định</p>
                              <p className="text-sm mb-2">{formData.address}</p>
                              
                              {formData.addressComponents && (
                                <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                                  {formData.addressComponents.houseNumber && (
                                    <div>
                                      <span className="font-medium">Số nhà:</span> {formData.addressComponents.houseNumber}
                                    </div>
                                  )}
                                  {formData.addressComponents.street && (
                                    <div>
                                      <span className="font-medium">Đường:</span> {formData.addressComponents.street}
                                    </div>
                                  )}
                                  {formData.addressComponents.ward && (
                                    <div>
                                      <span className="font-medium">Phường/Xã:</span> {formData.addressComponents.ward}
                                    </div>
                                  )}
                                  {formData.addressComponents.district && (
                                    <div>
                                      <span className="font-medium">Quận/Huyện:</span> {formData.addressComponents.district}
                                    </div>
                                  )}
                                  {formData.addressComponents.city && (
                                    <div>
                                      <span className="font-medium">Thành phố:</span> {formData.addressComponents.city}
                                    </div>
                                  )}
                                  {formData.addressComponents.province && (
                                    <div>
                                      <span className="font-medium">Tỉnh:</span> {formData.addressComponents.province}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <p className="text-xs text-green-600 mt-2">
                                Tọa độ: {formData.addressCoordinates[1].toFixed(6)}, {formData.addressCoordinates[0].toFixed(6)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Thông tin liên hệ */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      Bước 4: Thông Tin Liên Hệ
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
                    {currentStep < 4 ? (
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
                
                {selectedService && selectedAreaInfo && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <span className="text-2xl">{selectedService.icon}</span>
                      <div>
                        <p className="font-semibold text-neutral-900">
                          {selectedService.name}
                        </p>
                        {/* Hiển thị thời gian được quy đổi */}
                        <p className="text-sm text-neutral-600">
                          Quy mô: {selectedAreaInfo.label}
                        </p>
                      </div>
                    </div>

                    {formData.date && (
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600">Ngày: {formData.date}</p>
                        <p className="text-sm text-neutral-600">Lúc: {formData.time}</p>
                      </div>
                    )}

                    {formData.address && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">📍</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">Địa chỉ:</p>
                            <p className="text-sm text-blue-700 mb-1">{formData.address}</p>
                            
                            {formData.addressComponents && (
                              <div className="text-xs text-blue-600 space-y-1">
                                {formData.addressComponents.houseNumber && formData.addressComponents.street && (
                                  <p>🏠 {formData.addressComponents.houseNumber} {formData.addressComponents.street}</p>
                                )}
                                {formData.addressComponents.ward && (
                                  <p>🏘️ {formData.addressComponents.ward}</p>
                                )}
                                {formData.addressComponents.district && (
                                  <p>🏙️ {formData.addressComponents.district}</p>
                                )}
                              </div>
                            )}
                            
                            {formData.addressCoordinates && (
                              <p className="text-xs text-blue-600 mt-1">
                                ✓ Đã xác định tọa độ chính xác
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Giá cơ bản:</span>
                        <span>{selectedService.price.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Ước tính:</span>
                        <span>{selectedAreaInfo.duration} giờ</span>
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