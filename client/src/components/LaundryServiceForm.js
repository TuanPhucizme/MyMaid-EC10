import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import { Minus, Plus, Package, Scale, Clock, Star } from 'lucide-react';

const LaundryServiceForm = ({ service, onDataChange, formData }) => {
  const [weight, setWeight] = useState(formData?.weight || service.pricing.minWeight);
  const [selectedOptions, setSelectedOptions] = useState(formData?.selectedOptions || {});
  const [selectedClothingTypes, setSelectedClothingTypes] = useState(formData?.selectedClothingTypes || []);
  const [notes, setNotes] = useState(formData?.notes || '');

  // Tính toán giá dựa trên cân nặng
  const calculateBasePrice = (weight) => {
    const priceBreaks = service.pricing.priceBreaks;
    for (let i = 0; i < priceBreaks.length; i++) {
      if (weight >= priceBreaks[i].from && weight <= priceBreaks[i].to) {
        return priceBreaks[i].price * weight;
      }
    }
    return service.pricing.basePrice * weight;
  };

  // Tính tổng giá options
  const calculateOptionsPrice = () => {
    return Object.entries(selectedOptions).reduce((total, [key, isSelected]) => {
      if (isSelected && service.laundryOptions[key]) {
        return total + service.laundryOptions[key].price;
      }
      return total;
    }, 0);
  };

  // Tính tổng giá
  const totalPrice = calculateBasePrice(weight) + calculateOptionsPrice();

  // Cập nhật dữ liệu khi có thay đổi
  useEffect(() => {
    const data = {
      weight,
      selectedOptions,
      selectedClothingTypes,
      notes,
      totalPrice,
      serviceType: 'laundry'
    };
    onDataChange(data);
  }, [weight, selectedOptions, selectedClothingTypes, notes, totalPrice, onDataChange]);

  const handleWeightChange = (newWeight) => {
    const clampedWeight = Math.max(
      service.pricing.minWeight,
      Math.min(service.pricing.maxWeight, newWeight)
    );
    setWeight(clampedWeight);
  };

  const handleOptionToggle = (optionKey) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionKey]: !prev[optionKey]
    }));
  };

  const handleClothingTypeToggle = (typeId) => {
    setSelectedClothingTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Weight Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-600" />
            Cân nặng quần áo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleWeightChange(weight - 0.5)}
              disabled={weight <= service.pricing.minWeight}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{weight}</div>
              <div className="text-sm text-neutral-500">kg</div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleWeightChange(weight + 0.5)}
              disabled={weight >= service.pricing.maxWeight}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center text-sm text-neutral-600">
            Tối thiểu {service.pricing.minWeight}kg - Tối đa {service.pricing.maxWeight}kg
          </div>
          
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary-700">
                {calculateBasePrice(weight).toLocaleString('vi-VN')}đ
              </div>
              <div className="text-sm text-primary-600">Giá cơ bản</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Laundry Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary-600" />
            Tùy chọn dịch vụ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(service.laundryOptions).map(([key, option]) => (
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

      {/* Clothing Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-600" />
            Loại quần áo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {service.clothingTypes.map((type) => (
              <div
                key={type.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                  selectedClothingTypes.includes(type.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
                onClick={() => handleClothingTypeToggle(type.id)}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-xs font-medium">{type.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Ghi chú đặc biệt</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ví dụ: Quần áo có vết bẩn đặc biệt, yêu cầu giặt riêng..."
            className="w-full p-3 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card className="border-primary-200 bg-primary-50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Giá cơ bản ({weight}kg)</span>
              <span>{calculateBasePrice(weight).toLocaleString('vi-VN')}đ</span>
            </div>
            {Object.entries(selectedOptions).map(([key, isSelected]) => {
              if (!isSelected) return null;
              const option = service.laundryOptions[key];
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

export default LaundryServiceForm;
