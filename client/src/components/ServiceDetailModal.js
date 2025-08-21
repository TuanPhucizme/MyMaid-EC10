import React, { useState } from 'react';
import { X, Star, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import LaundryServiceForm from './LaundryServiceForm';
import PricingCalculator from './PricingCalculator';

const ServiceDetailModal = ({ service, isOpen, onClose, onBookService }) => {
  const [serviceData, setServiceData] = useState({});

  if (!isOpen || !service) return null;

  const handleServiceDataChange = (data) => {
    setServiceData(data);
  };

  const handleBookNow = () => {
    onBookService(service, serviceData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{service.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{service.name}</h2>
              <p className="text-neutral-600">{service.subtitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Service Info */}
            <div className="space-y-6">
              {/* Service Image */}
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                  <div className="text-xs text-neutral-500">Đánh giá</div>
                </div>
                
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="font-semibold">{service.bookings}</span>
                  </div>
                  <div className="text-xs text-neutral-500">Đã đặt</div>
                </div>
                
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-sm">{service.duration}</span>
                  </div>
                  <div className="text-xs text-neutral-500">Thời gian</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Mô tả dịch vụ</h3>
                <p className="text-neutral-600 leading-relaxed">{service.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Dịch vụ bao gồm</h3>
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {service.popular && (
                  <Badge variant="primary">Phổ biến</Badge>
                )}
                {service.isNew && (
                  <Badge variant="success">Mới</Badge>
                )}
                {service.discount && (
                  <Badge variant="warning">Giảm {service.discount}%</Badge>
                )}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tùy chỉnh dịch vụ</h3>
                
                {/* Service-specific forms */}
                {service.serviceType === 'laundry' ? (
                  <LaundryServiceForm
                    service={service}
                    onDataChange={handleServiceDataChange}
                    formData={serviceData}
                  />
                ) : (
                  <PricingCalculator
                    service={service}
                    onDataChange={handleServiceDataChange}
                    formData={serviceData}
                  />
                )}
              </div>

              {/* Booking Actions */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-neutral-200">
                <div className="space-y-3">
                  <Button
                    onClick={handleBookNow}
                    className="w-full"
                    size="lg"
                    disabled={!serviceData.totalPrice}
                  >
                    <span>Đặt dịch vụ ngay</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {serviceData.totalPrice ? 
                        `${serviceData.totalPrice.toLocaleString('vi-VN')}đ` : 
                        `Từ ${service.price}đ`
                      }
                    </div>
                    <div className="text-sm text-neutral-500">
                      {service.serviceType === 'laundry' ? 'theo cân nặng' : `/${service.unit}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
