import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreditCard, DollarSign, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PaymentContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const PaymentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  color: #3b82f6;
  margin-right: 1rem;
`;

const InfoText = styled.div`
  flex-grow: 1;
`;

const Label = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Value = styled.p`
  margin: 0;
  font-weight: 500;
  color: #111827;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: #059669;
  }
`;

const PaymentDetailPage = () => {
  const location = useLocation();
  
  // Lấy dữ liệu booking từ state của location
  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
  }, [bookingDetails]);

  // Nếu không có dữ liệu, có thể điều hướng về trang trước đó
  if (!bookingDetails) {
    // Xử lý trường hợp người dùng truy cập trực tiếp vào trang thanh toán
    return <div>Dữ liệu đặt hàng không hợp lệ. Vui lòng thử lại.</div>;
  }

  // Bây giờ bạn có thể sử dụng dữ liệu này để hiển thị và tạo thanh toán
  const { service, summary, contact, schedule } = bookingDetails;

  const handlePayment = async () => {
    try {
      // Bước 1: Tạo đơn hàng trong database trước
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getCurrentUserToken()}`
        },
        body: JSON.stringify({
          service: bookingDetails.service,
          schedule: bookingDetails.schedule,
          contact: bookingDetails.contact,
          summary: bookingDetails.summary,
          paymentMethod: 'vnpay'
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Không thể tạo đơn hàng');
      }

      const orderData = await orderResponse.json();
      console.log('Order created:', orderData);

      // Bước 2: Tạo URL thanh toán với order ID
      const paymentResponse = await fetch('http://localhost:5000/api/payment/create_payment_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: summary.totalPrice, 
          orderDescription: summary.orderDescription, 
          language: 'vn',
          bankCode: '',
          orderDbId: orderData.orderId
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Lỗi từ server: ' + paymentResponse.status);
      }

      return paymentResponse.json();
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng hoặc thanh toán:', error);
      alert('Có lỗi xảy ra: ' + error.message);
      return null;
    }
  };

  const getCurrentUserToken = async () => {
    // Import auth từ firebase config
    const { auth } = await import('../config/firebase');
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    throw new Error('Vui lòng đăng nhập để tiếp tục');
  };

  const handlePaymentClick = async () => {
    const data = await handlePayment();
    
    if (data && data.paymentUrl) {
      // Lưu thông tin booking và order ID vào localStorage
      localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
      localStorage.setItem('orderDbId', data.orderDbId);
      // Chuyển hướng người dùng đến URL thanh toán
      window.location.href = data.paymentUrl;
    } else if (data === null) {
      // Lỗi đã được xử lý trong handlePayment
      return;
    } else {
      console.error('Không nhận được URL thanh toán từ server.');
      alert('Không thể lấy được URL thanh toán. Vui lòng kiểm tra lại.');
    }
  };
  
  return (
    <PaymentContainer>
      <PaymentCard>
        {/* Hiển thị thông tin dịch vụ và giá tiền từ bookingDetails */}
        <SectionTitle>Chi Tiết Thanh Toán</SectionTitle>
        
        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Dịch vụ</Label>
            <Value>{service.name}</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Khách hàng</Label>
            <Value>{contact.name}</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Địa chỉ</Label>
            <Value>{contact.address}</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Số điện thoại</Label>
            <Value>{contact.phone}</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Lịch trình</Label>
            <Value>{schedule.date} - {schedule.time} - {schedule.duration} giờ</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Ghi chú</Label>
            <Value>{contact.notes}</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Tổng tiền</Label>
            <Value>{summary.totalPrice.toLocaleString()} VNĐ</Value>
          </InfoText>
        </InfoRow>
        
        <PayButton onClick={handlePaymentClick}>Thanh toán ngay</PayButton>
      </PaymentCard>
    </PaymentContainer>
  );
};

export default PaymentDetailPage;