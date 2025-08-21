import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import { Clock, Home, Plus, Minus } from 'lucide-react';

const PricingCalculator = ({ service, onDataChange, formData }) => {
  const [duration, setDuration] = useState(formData?.duration || service.pricing?.minHours || 2);
  const [selectedArea, setSelectedArea] = useState(formData?.selectedArea || 'small');
  const [selectedOptions, setSelectedOptions] = useState(formData?.selectedOptions || {});

  // Tính toán giá dựa trên loại dịch vụ
  const calculatePrice = () => {
    let basePrice = service.pricing?.basePrice || parseInt(service.price.replace(/,/g, ''));
    
    if (service.serviceType === 'cleaning') {
      // Dịch vụ dọn dẹp tính theo giờ và diện tích
      const areaMultiplier = service.areaOptions?.find(area => area.id === selectedArea)?.multiplier || 1;
      basePrice = basePrice * duration * areaMultiplier;
    }
    
    // Thêm giá các options
    const optionsPrice = Object.entries(selectedOptions).reduce((total, [key, isSelected]) => {
      if (isSelected && service.cleaningOptions?.[key]) {
        return total + service.cleaningOptions[key].price;
      }
      return total;
    }, 0);
    
    return basePrice + optionsPrice;
  };

  const totalPrice = calculatePrice();

  // Cập nhật dữ liệu khi có thay đổi
  useEffect(() => {
    const data = {
      duration,
      selectedArea,
      selectedOptions,
      totalPrice,
      serviceType: service.serviceType || 'general'
    };
    onDataChange(data);
  }, [duration, selectedArea, selectedOptions, totalPrice, onDataChange, service.serviceType]);

  const handleDurationChange = (newDuration) => {
    const minHours = service.pricing?.minHours || 1;
    const maxHours = service.pricing?.maxHours || 12;
    const clampedDuration = Math.max(minHours, Math.min(maxHours, newDuration));
    setDuration(clampedDuration);
  };

  const handleOptionToggle = (optionKey) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionKey]: !prev[optionKey]
    }));
  };

  if (service.serviceType === 'laundry') {
    return null; // LaundryServiceForm sẽ xử lý
  }

  return (
    <div className="space-y-6">
      {/* Duration Selection for Cleaning Services */}
      {service.serviceType === 'cleaning' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Thời gian dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDurationChange(duration - 1)}
                disabled={duration <= (service.pricing?.minHours || 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{duration}</div>
                <div className="text-sm text-neutral-500">giờ</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDurationChange(duration + 1)}
                disabled={duration >= (service.pricing?.maxHours || 12)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center text-sm text-neutral-600">
              Tối thiểu {service.pricing?.minHours || 1} giờ - Tối đa {service.pricing?.maxHours || 12} giờ
            </div>
          </CardContent>
        </Card>
      )}

      {/* Area Selection for Cleaning Services */}
      {service.serviceType === 'cleaning' && service.areaOptions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary-600" />
              Diện tích nhà
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.areaOptions.map((area) => (
                <div
                  key={area.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedArea === area.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <div className="font-medium text-sm">{area.name}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Hệ số: x{area.multiplier}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Options */}
      {service.cleaningOptions && (
        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ bổ sung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(service.cleaningOptions).map(([key, option]) => (
                <div
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedOptions[key]
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                  onClick={() => handleOptionToggle(key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-xs text-neutral-500">{option.description}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary-600">
                      +{option.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Summary */}
      <Card className="border-primary-200 bg-primary-50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            {service.serviceType === 'cleaning' ? (
              <>
                <div className="flex justify-between text-sm">
                  <span>Giá cơ bản ({duration} giờ)</span>
                  <span>{(service.pricing.basePrice * duration).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hệ số diện tích</span>
                  <span>x{service.areaOptions?.find(area => area.id === selectedArea)?.multiplier || 1}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span>Giá cơ bản</span>
                <span>{parseInt(service.price.replace(/,/g, '')).toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            
            {Object.entries(selectedOptions).map(([key, isSelected]) => {
              if (!isSelected) return null;
              const option = service.cleaningOptions?.[key];
              if (!option) return null;
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span>{option.name}</span>
                  <span>+{option.price.toLocaleString('vi-VN')}đ</span>
                </div>
              );
            })}
            
            <hr className="border-primary-200" />
            <div className="flex justify-between font-bold text-lg text-primary-700">
              <span>Tổng cộng</span>
              <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCalculator;
