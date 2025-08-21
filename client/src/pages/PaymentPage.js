import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, FileText, Package, Scale, Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { services } from '../data/services';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state);
      if (location.state.serviceType) {
        const service = services.find(s => s.id === location.state.serviceType);
        setSelectedService(service);
      }
    }
  }, [location.state]);

  const handlePaymentClick = () => {
    // Xử lý thanh toán ở đây
    alert('Chức năng thanh toán đang được phát triển!');
  };

  if (!bookingData || !selectedService) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Không tìm thấy thông tin đặt dịch vụ</h2>
          <Button onClick={() => navigate('/booking')}>Quay lại đặt dịch vụ</Button>
        </div>
      </div>
    );
  };

  const renderServiceDetails = () => {
    if (!bookingData.serviceData) return null;

    const { serviceData } = bookingData;

    if (selectedService.serviceType === 'laundry') {
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Cân nặng
            </span>
            <span>{serviceData.weight}kg</span>
          </div>
          
          {serviceData.selectedOptions && Object.entries(serviceData.selectedOptions).map(([key, isSelected]) => {
            if (!isSelected) return null;
            const option = selectedService.laundryOptions[key];
            if (!option) return null;
            return (
              <div key={key} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  {option.name}
                </span>
                <span>+{option.price.toLocaleString('vi-VN')}đ</span>
              </div>
            );
          })}
          
          {serviceData.selectedClothingTypes && serviceData.selectedClothingTypes.length > 0 && (
            <div className="text-sm">
              <span className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4" />
                Loại quần áo:
              </span>
              <div className="flex flex-wrap gap-1">
                {serviceData.selectedClothingTypes.map(typeId => {
                  const type = selectedService.clothingTypes.find(t => t.id === typeId);
                  return type ? (
                    <span key={typeId} className="text-xs bg-neutral-100 px-2 py-1 rounded">
                      {type.icon} {type.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      );
    } else if (selectedService.serviceType === 'cleaning') {
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Thời gian
            </span>
            <span>{serviceData.duration} giờ</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Diện tích
            </span>
            <span>{selectedService.areaOptions?.find(a => a.id === serviceData.selectedArea)?.name}</span>
          </div>
          
          {serviceData.selectedOptions && Object.entries(serviceData.selectedOptions).map(([key, isSelected]) => {
            if (!isSelected) return null;
            const option = selectedService.cleaningOptions?.[key];
            if (!option) return null;
            return (
              <div key={key} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  {option.name}
                </span>
                <span>+{option.price.toLocaleString('vi-VN')}đ</span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return null;
  };

  const totalPrice = bookingData.serviceData?.totalPrice || parseInt(selectedService.price.replace(/,/g, ''));

  return (
    <div className="min-h-screen bg-neutral-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Xác nhận thanh toán
          </h1>
          <p className="text-xl text-neutral-600">
            Vui lòng kiểm tra thông tin đặt dịch vụ trước khi thanh toán
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Chi tiết đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Info */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Dịch vụ</h3>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <span className="text-2xl">{selectedService.icon}</span>
                  <div>
                    <div className="font-medium">{selectedService.name}</div>
                    <div className="text-sm text-neutral-600">{selectedService.subtitle}</div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              {renderServiceDetails()}

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Thông tin khách hàng</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>{bookingData.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <span>{bookingData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <span>{bookingData.email}</span>
                  </div>
                </div>
              </div>

              {/* Schedule & Address */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Lịch hẹn</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span>{bookingData.date} - {bookingData.time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
                    <span>{bookingData.formattedAddress || bookingData.address}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {bookingData.notes && (
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Ghi chú</h3>
                  <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                    {bookingData.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Giá dịch vụ</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                
                {bookingData.frequency !== 'one-time' && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({bookingData.frequency === 'weekly' ? '10%' : '20%'})</span>
                    <span>-{Math.round(totalPrice * (bookingData.frequency === 'weekly' ? 0.1 : 0.2)).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                
                <hr className="border-neutral-200" />
                <div className="flex justify-between text-lg font-bold text-primary-700">
                  <span>Tổng cộng</span>
                  <span>
                    {bookingData.frequency === 'one-time' 
                      ? totalPrice.toLocaleString('vi-VN')
                      : Math.round(totalPrice * (bookingData.frequency === 'weekly' ? 0.9 : 0.8)).toLocaleString('vi-VN')
                    }đ
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Phương thức thanh toán</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300">
                    <input type="radio" name="payment" value="cash" defaultChecked className="text-primary-600" />
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span>Thanh toán khi hoàn thành</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300">
                    <input type="radio" name="payment" value="online" className="text-primary-600" />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Thanh toán online</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handlePaymentClick} className="w-full" size="lg">
                  Xác nhận đặt dịch vụ
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/booking', { state: bookingData })} 
                  className="w-full"
                >
                  Quay lại chỉnh sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
