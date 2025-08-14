import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, User, Phone, Mail, MessageSquare, 
  ChevronLeft, ChevronRight, Check, Star, Sparkles, Home,
  ArrowRight, Shield, Award, Zap
} from 'lucide-react';
import PremiumAddressSelector from '../components/PremiumAddressSelector';
import { entranceAnimations, exitAnimations, microAnimations, pageTransitions } from '../utils/gsapAnimations';

const PremiumBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: location.state?.serviceType || '',
    date: '',
    time: '',
    area: 'small',
    address: '',
    addressCoordinates: null,
    addressComponents: null,
    formattedAddress: '',
    phone: '',
    name: '',
    email: '',
    notes: '',
    frequency: 'one-time'
  });

  const stepRefs = useRef([]);
  const progressRef = useRef(null);
  const containerRef = useRef(null);

  // Service types with premium styling
  const serviceTypes = [
    { 
      id: 'cleaning', 
      name: 'Dọn dẹp nhà cửa', 
      price: 220000, 
      icon: '🧹',
      description: 'Vệ sinh tổng quát, lau chùi, hút bụi',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'deep-cleaning', 
      name: 'Tổng vệ sinh', 
      price: 660000, 
      icon: '✨',
      description: 'Vệ sinh sâu, khử trùng toàn bộ',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'moving-house', 
      name: 'Chuyển nhà', 
      price: 300000, 
      icon: '🏠',
      description: 'Hỗ trợ đóng gói, vận chuyển',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'airconditioner-cleaning', 
      name: 'Vệ sinh máy lạnh', 
      price: 250000, 
      icon: '❄️',
      description: 'Vệ sinh máy lạnh chuyên nghiệp',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      id: 'childcare', 
      name: 'Chăm sóc trẻ em', 
      price: 200000, 
      icon: '👶',
      description: 'Chăm sóc, vui chơi cùng bé',
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  const areaOptions = [
    { id: 'small', name: 'Nhỏ (< 50m²)', multiplier: 1, icon: '🏠' },
    { id: 'medium', name: 'Trung bình (50-100m²)', multiplier: 1.5, icon: '🏡' },
    { id: 'large', name: 'Lớn (100-200m²)', multiplier: 2, icon: '🏘️' },
    { id: 'extra-large', name: 'Rất lớn (> 200m²)', multiplier: 3, icon: '🏰' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const frequencyOptions = [
    { id: 'one-time', name: 'Một lần', discount: 0, icon: '📅' },
    { id: 'weekly', name: 'Hàng tuần', discount: 10, icon: '🔄' },
    { id: 'monthly', name: 'Hàng tháng', discount: 15, icon: '📆' }
  ];

  // Calculate total price
  const calculatePrice = () => {
    const service = serviceTypes.find(s => s.id === formData.serviceType);
    if (!service) return 0;
    
    const area = areaOptions.find(a => a.id === formData.area);
    const frequency = frequencyOptions.find(f => f.id === formData.frequency);
    
    const basePrice = service.price * (area?.multiplier || 1);
    const discount = frequency?.discount || 0;
    
    return basePrice * (1 - discount / 100);
  };

  // Handle step navigation with animations
  const goToStep = (step) => {
    if (step < 1 || step > 4) return;
    
    const currentStepElement = stepRefs.current[currentStep - 1];
    const nextStepElement = stepRefs.current[step - 1];
    
    if (currentStepElement && nextStepElement) {
      pageTransitions.slideTransition(
        currentStepElement, 
        nextStepElement, 
        step > currentStep ? 'left' : 'right'
      );
    }
    
    setCurrentStep(step);
    
    // Update progress bar
    if (progressRef.current) {
      microAnimations.successPulse(progressRef.current);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success animation
      if (containerRef.current) {
        microAnimations.successPulse(containerRef.current);
      }
      
      // Navigate to success page
      navigate('/booking-success', { 
        state: { 
          bookingData: formData,
          totalPrice: calculatePrice()
        } 
      });
    } catch (error) {
      console.error('Booking error:', error);
      if (containerRef.current) {
        microAnimations.shake(containerRef.current);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animate on mount
  useEffect(() => {
    if (containerRef.current) {
      entranceAnimations.fadeInScale(containerRef.current);
    }
  }, []);

  // Progress percentage
  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-neutral-100 hover:bg-neutral-200 text-neutral-700
                  transition-all duration-200 hover:scale-105
                "
              >
                <ChevronLeft size={20} />
                <span className="font-medium">Quay lại</span>
              </button>
              
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary-500" size={24} />
                <h1 className="text-xl font-bold text-neutral-900">Đặt dịch vụ premium</h1>
              </div>
              
              <div className="w-24" /> {/* Spacer */}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">
                  Bước {currentStep} / 4
                </span>
                <span className="text-sm font-medium text-primary-600">
                  {Math.round(progressPercentage)}% hoàn thành
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div 
                  ref={progressRef}
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-smooth"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-8">
          <div className="relative">
            {/* Step 1: Service Selection */}
            <div 
              ref={el => stepRefs.current[0] = el}
              className={`${currentStep === 1 ? 'block' : 'hidden'}`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  Chọn dịch vụ của bạn
                </h2>
                <p className="text-neutral-600 text-lg">
                  Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceTypes.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setFormData({...formData, serviceType: service.id})}
                    className={`
                      relative p-6 rounded-2xl border-2 cursor-pointer
                      transition-all duration-300 hover:scale-105 hover:shadow-luxury
                      ${formData.serviceType === service.id 
                        ? 'border-primary-500 bg-primary-50/50 shadow-primary' 
                        : 'border-neutral-200 bg-white/80 hover:border-primary-300'
                      }
                    `}
                  >
                    {/* Service Icon */}
                    <div className={`
                      w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient}
                      flex items-center justify-center text-2xl mb-4 mx-auto
                      shadow-lg
                    `}>
                      {service.icon}
                    </div>
                    
                    {/* Service Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-neutral-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3">
                        {service.description}
                      </p>
                      <div className="text-2xl font-bold text-primary-600">
                        {service.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {formData.serviceType === service.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={nextStep}
                  disabled={!formData.serviceType}
                  className={`
                    px-8 py-4 rounded-2xl font-semibold text-lg
                    transition-all duration-300 hover:scale-105
                    ${formData.serviceType
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-luxury hover:shadow-primary'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }
                  `}
                >
                  Tiếp tục
                  <ArrowRight size={20} className="inline ml-2" />
                </button>
              </div>
            </div>

            {/* Step 2: Date, Time & Area */}
            <div 
              ref={el => stepRefs.current[1] = el}
              className={`${currentStep === 2 ? 'block' : 'hidden'}`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  Chọn thời gian & diện tích
                </h2>
                <p className="text-neutral-600 text-lg">
                  Xác định thời gian và quy mô công việc
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date & Time */}
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="text-primary-500" size={24} />
                      <h3 className="text-lg font-semibold text-neutral-900">Chọn ngày</h3>
                    </div>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="
                        w-full p-4 border border-neutral-200 rounded-xl
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                        transition-all duration-200
                      "
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="text-primary-500" size={24} />
                      <h3 className="text-lg font-semibold text-neutral-900">Chọn giờ</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData({...formData, time})}
                          className={`
                            p-3 rounded-xl font-medium transition-all duration-200
                            ${formData.time === time
                              ? 'bg-primary-500 text-white shadow-primary'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Area & Frequency */}
                <div className="space-y-6">
                  {/* Area Selection */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Home className="text-primary-500" size={24} />
                      <h3 className="text-lg font-semibold text-neutral-900">Diện tích</h3>
                    </div>
                    <div className="space-y-3">
                      {areaOptions.map((area) => (
                        <button
                          key={area.id}
                          onClick={() => setFormData({...formData, area: area.id})}
                          className={`
                            w-full p-4 rounded-xl text-left transition-all duration-200
                            flex items-center justify-between
                            ${formData.area === area.id
                              ? 'bg-primary-500 text-white shadow-primary'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{area.icon}</span>
                            <span className="font-medium">{area.name}</span>
                          </div>
                          <span className="text-sm opacity-75">
                            x{area.multiplier}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="text-primary-500" size={24} />
                      <h3 className="text-lg font-semibold text-neutral-900">Tần suất</h3>
                    </div>
                    <div className="space-y-3">
                      {frequencyOptions.map((freq) => (
                        <button
                          key={freq.id}
                          onClick={() => setFormData({...formData, frequency: freq.id})}
                          className={`
                            w-full p-4 rounded-xl text-left transition-all duration-200
                            flex items-center justify-between
                            ${formData.frequency === freq.id
                              ? 'bg-secondary-500 text-white shadow-secondary'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-secondary-100 hover:text-secondary-700'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{freq.icon}</span>
                            <span className="font-medium">{freq.name}</span>
                          </div>
                          {freq.discount > 0 && (
                            <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">
                              -{freq.discount}%
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="
                    px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700
                    hover:bg-neutral-100 transition-all duration-200 hover:scale-105
                  "
                >
                  <ChevronLeft size={20} className="inline mr-2" />
                  Quay lại
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={!formData.date || !formData.time}
                  className={`
                    px-8 py-3 rounded-xl font-semibold
                    transition-all duration-300 hover:scale-105
                    ${formData.date && formData.time
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-luxury'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }
                  `}
                >
                  Tiếp tục
                  <ArrowRight size={20} className="inline ml-2" />
                </button>
              </div>
            </div>

            {/* Step 3: Address */}
            <div 
              ref={el => stepRefs.current[2] = el}
              className={`${currentStep === 3 ? 'block' : 'hidden'}`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  Địa chỉ thực hiện
                </h2>
                <p className="text-neutral-600 text-lg">
                  Nhập địa chỉ chính xác để chúng tôi có thể đến đúng nơi
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="text-primary-500" size={24} />
                    <h3 className="text-lg font-semibold text-neutral-900">Chọn địa chỉ</h3>
                  </div>
                  
                  <PremiumAddressSelector
                    value={formData.address}
                    onChange={(address) => setFormData({...formData, address})}
                    onAddressSelect={(addressData) => {
                      setFormData({
                        ...formData,
                        address: addressData.address,
                        addressCoordinates: addressData.coordinates,
                        addressComponents: addressData.components,
                        formattedAddress: addressData.formattedAddress
                      });
                    }}
                    placeholder="Nhập địa chỉ hoặc chọn từ gợi ý..."
                    className="mb-6"
                  />

                  {/* Address Preview */}
                  {formData.address && (
                    <div className="mt-6 p-4 bg-primary-50/50 rounded-xl border border-primary-200/50">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-primary-500 mt-1" size={20} />
                        <div>
                          <div className="font-medium text-neutral-900 mb-1">
                            Địa chỉ đã chọn:
                          </div>
                          <div className="text-neutral-700">
                            {formData.formattedAddress || formData.address}
                          </div>
                          {formData.addressComponents && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.addressComponents.district && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs">
                                  {formData.addressComponents.district}
                                </span>
                              )}
                              {formData.addressComponents.city && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs">
                                  {formData.addressComponents.city}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="
                    px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700
                    hover:bg-neutral-100 transition-all duration-200 hover:scale-105
                  "
                >
                  <ChevronLeft size={20} className="inline mr-2" />
                  Quay lại
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={!formData.address}
                  className={`
                    px-8 py-3 rounded-xl font-semibold
                    transition-all duration-300 hover:scale-105
                    ${formData.address
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-luxury'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }
                  `}
                >
                  Tiếp tục
                  <ArrowRight size={20} className="inline ml-2" />
                </button>
              </div>
            </div>

            {/* Step 4: Contact Info & Confirmation */}
            <div 
              ref={el => stepRefs.current[3] = el}
              className={`${currentStep === 4 ? 'block' : 'hidden'}`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  Thông tin liên hệ
                </h2>
                <p className="text-neutral-600 text-lg">
                  Hoàn tất thông tin để xác nhận đặt dịch vụ
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200/50">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="text-primary-500" size={24} />
                      <h3 className="text-lg font-semibold text-neutral-900">Thông tin cá nhân</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="
                            w-full p-4 border border-neutral-200 rounded-xl
                            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                            transition-all duration-200
                          "
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="
                            w-full p-4 border border-neutral-200 rounded-xl
                            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                            transition-all duration-200
                          "
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="
                            w-full p-4 border border-neutral-200 rounded-xl
                            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                            transition-all duration-200
                          "
                          placeholder="Nhập email (tùy chọn)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Ghi chú
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          rows={4}
                          className="
                            w-full p-4 border border-neutral-200 rounded-xl
                            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                            transition-all duration-200 resize-none
                          "
                          placeholder="Ghi chú thêm về yêu cầu của bạn..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-neutral-200/50 sticky top-24">
                    <div className="flex items-center gap-3 mb-6">
                      <Award className="text-primary-500" size={24} />
                      <h3 className="text-lg font-semibold text-neutral-900">Tóm tắt đơn hàng</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Service */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-neutral-900">
                            {serviceTypes.find(s => s.id === formData.serviceType)?.name}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {areaOptions.find(a => a.id === formData.area)?.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-neutral-900">
                            {calculatePrice().toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      </div>
                      
                      {/* Date & Time */}
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Thời gian:</span>
                        <span className="font-medium text-neutral-900">
                          {formData.date} - {formData.time}
                        </span>
                      </div>
                      
                      {/* Address */}
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Địa chỉ:</span>
                        <span className="font-medium text-neutral-900 text-right max-w-48 truncate">
                          {formData.address}
                        </span>
                      </div>
                      
                      {/* Frequency */}
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Tần suất:</span>
                        <span className="font-medium text-neutral-900">
                          {frequencyOptions.find(f => f.id === formData.frequency)?.name}
                        </span>
                      </div>
                      
                      <hr className="border-neutral-200" />
                      
                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-neutral-900">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {calculatePrice().toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                    
                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-green-500" />
                          <span>Bảo hiểm</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-500" />
                          <span>Đánh giá 4.9/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="
                    px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700
                    hover:bg-neutral-100 transition-all duration-200 hover:scale-105
                  "
                >
                  <ChevronLeft size={20} className="inline mr-2" />
                  Quay lại
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.phone || isSubmitting}
                  className={`
                    px-8 py-4 rounded-2xl font-semibold text-lg
                    transition-all duration-300 hover:scale-105
                    ${formData.name && formData.phone && !isSubmitting
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-luxury hover:shadow-success'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Xác nhận đặt dịch vụ
                      <Check size={20} className="inline ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBookingPage;
