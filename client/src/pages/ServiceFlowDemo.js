import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LaundryServiceForm from '../components/LaundryServiceForm';
import PricingCalculator from '../components/PricingCalculator';
import ServiceDetailModal from '../components/ServiceDetailModal';
import { services } from '../data/services';

const ServiceFlowDemo = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceData, setServiceData] = useState({});

  const laundryService = services.find(s => s.serviceType === 'laundry');
  const cleaningService = services.find(s => s.serviceType === 'cleaning');

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleBookService = (service, serviceData) => {
    console.log('Booking service:', service.name, 'with data:', serviceData);
    alert(`Đặt dịch vụ ${service.name} thành công!\nGiá: ${serviceData.totalPrice?.toLocaleString('vi-VN')}đ`);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Demo Flow Dịch Vụ MyMaid
          </h1>
          <p className="text-xl text-neutral-600">
            Test các tính năng mới: Giặt ủi theo cân, dọn dẹp theo diện tích
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Laundry Service Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👕</span>
                Demo Dịch Vụ Giặt Ủi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {laundryService && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">{laundryService.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4">{laundryService.description}</p>
                    <Button 
                      onClick={() => handleViewDetails(laundryService)}
                      className="w-full"
                    >
                      Xem chi tiết & đặt dịch vụ
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Preview Form:</h4>
                    <LaundryServiceForm
                      service={laundryService}
                      onDataChange={(data) => setServiceData(data)}
                      formData={serviceData}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Cleaning Service Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                Demo Dịch Vụ Dọn Dẹp
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cleaningService && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">{cleaningService.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4">{cleaningService.description}</p>
                    <Button 
                      onClick={() => handleViewDetails(cleaningService)}
                      className="w-full"
                    >
                      Xem chi tiết & đặt dịch vụ
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Preview Form:</h4>
                    <PricingCalculator
                      service={cleaningService}
                      onDataChange={(data) => setServiceData(data)}
                      formData={serviceData}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Services Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Tất cả dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 cursor-pointer transition-all"
                  onClick={() => handleViewDetails(service)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                    <p className="text-xs text-neutral-600 mb-2">{service.subtitle}</p>
                    <div className="text-primary-600 font-bold">
                      {service.serviceType === 'laundry' ? 'Từ ' : ''}{service.price}đ/{service.unit}
                    </div>
                    {service.serviceType && (
                      <div className="mt-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {service.serviceType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Summary */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold mb-2">Giặt ủi theo cân</h3>
              <p className="text-sm text-neutral-600">
                Tính giá chính xác theo cân nặng với các tùy chọn đặc biệt
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-semibold mb-2">Dọn dẹp theo diện tích</h3>
              <p className="text-sm text-neutral-600">
                Tính giá dựa trên diện tích nhà và thời gian thực hiện
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold mb-2">Tùy chọn linh hoạt</h3>
              <p className="text-sm text-neutral-600">
                Nhiều tùy chọn bổ sung để phù hợp với nhu cầu cụ thể
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Detail Modal */}
        <ServiceDetailModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBookService={handleBookService}
        />
      </div>
    </div>
  );
};

export default ServiceFlowDemo;
