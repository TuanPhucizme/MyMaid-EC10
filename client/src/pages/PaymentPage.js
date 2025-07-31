import React from 'react';
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

  // Nếu không có dữ liệu, có thể điều hướng về trang trước đó
  if (!bookingDetails) {
    // Xử lý trường hợp người dùng truy cập trực tiếp vào trang thanh toán
    return <div>Dữ liệu đặt hàng không hợp lệ. Vui lòng thử lại.</div>;
  }

  // Bây giờ bạn có thể sử dụng dữ liệu này để hiển thị và tạo thanh toán
  const { service, summary, contact } = bookingDetails;

  const handlePayment = () => {
    fetch('http://localhost:3030/api/payment/create_payment_url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Sử dụng tổng tiền từ bookingDetails
        amount: summary.totalPrice, 
        // Sử dụng mô tả đơn hàng đã tạo
        orderDescription: summary.orderDescription, 
        language: 'vn',
        bankCode: ''
      })
    })
    // ... logic fetch như cũ
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
            <Value>{contact.name} - {contact.phone}</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper>{/* Icon */}</IconWrapper>
          <InfoText>
            <Label>Tổng tiền</Label>
            <Value>{summary.totalPrice.toLocaleString()} VNĐ</Value>
          </InfoText>
        </InfoRow>
        
        <PayButton onClick={handlePayment}>Thanh toán ngay</PayButton>
      </PaymentCard>
    </PaymentContainer>
  );
};

export default PaymentDetailPage;