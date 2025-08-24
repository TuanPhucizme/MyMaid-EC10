import React, { useState } from 'react';
import styled from 'styled-components';
import AddressSelector from '../components/AddressSelector';
import { MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DemoContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
`;

const StepTitle = styled.h2`
  color: #1f2937;
  margin-bottom: 16px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddressInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #374151;
`;

const Value = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => props.status === 'success' && `
    background: #dcfce7;
    color: #166534;
  `}
  
  ${props => props.status === 'warning' && `
    background: #fef3c7;
    color: #92400e;
  `}
  
  ${props => props.status === 'error' && `
    background: #fee2e2;
    color: #991b1b;
  `}
`;

const BookingAddressDemo = () => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressSelect = (details) => {
    setAddressDetails(details);
    console.log('📍 Địa chỉ booking:', details);
  };

  const getAddressStatus = () => {
    if (!addressDetails) return null;
    
    if (addressDetails.coordinates && addressDetails.relevance > 0.8) {
      return { status: 'success', text: 'Địa chỉ chính xác' };
    } else if (addressDetails.coordinates) {
      return { status: 'warning', text: 'Cần xác nhận' };
    } else {
      return { status: 'error', text: 'Không xác định được vị trí' };
    }
  };

  const addressStatus = getAddressStatus();

  return (
    <DemoContainer>
      <Title>🏠 Booking Address Selector Demo</Title>
      
      <BookingCard>
        <StepTitle>
          <MapPin size={20} />
          Bước 3: Chọn địa chỉ thực hiện dịch vụ
        </StepTitle>
        
        <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
          Nhập địa chỉ chính xác để maid có thể dễ dàng tìm đến nhà bạn. 
          Hệ thống sẽ tự động gợi ý địa chỉ phù hợp.
        </p>
        
        <AddressSelector
          value={selectedAddress}
          onChange={handleAddressChange}
          onAddressSelect={handleAddressSelect}
          placeholder="🔍 Nhập địa chỉ hoặc chọn từ gợi ý..."
        />
        
        {addressDetails && (
          <AddressInfo>
            <InfoRow>
              <Label>Địa chỉ đã chọn:</Label>
              {addressStatus && (
                <StatusBadge status={addressStatus.status}>
                  {addressStatus.status === 'success' && <CheckCircle size={12} />}
                  {addressStatus.status === 'warning' && <Clock size={12} />}
                  {addressStatus.status === 'error' && <AlertCircle size={12} />}
                  {addressStatus.text}
                </StatusBadge>
              )}
            </InfoRow>
            
            <InfoRow>
              <Label>Địa chỉ:</Label>
              <Value>{addressDetails.address}</Value>
            </InfoRow>
            
            {addressDetails.components?.district && (
              <InfoRow>
                <Label>Quận/Huyện:</Label>
                <Value>{addressDetails.components.district}</Value>
              </InfoRow>
            )}
            
            {addressDetails.components?.city && (
              <InfoRow>
                <Label>Thành phố:</Label>
                <Value>{addressDetails.components.city}</Value>
              </InfoRow>
            )}
            
            {addressDetails.coordinates && (
              <InfoRow>
                <Label>Tọa độ:</Label>
                <Value>
                  {addressDetails.coordinates[1].toFixed(6)}, {addressDetails.coordinates[0].toFixed(6)}
                </Value>
              </InfoRow>
            )}
            
            {addressDetails.relevance && (
              <InfoRow>
                <Label>Độ chính xác:</Label>
                <Value>{Math.round(addressDetails.relevance * 100)}%</Value>
              </InfoRow>
            )}
          </AddressInfo>
        )}
        
        {addressDetails?.coordinates && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#dcfce7', 
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#166534'
          }}>
            ✅ <strong>Tuyệt vời!</strong> Địa chỉ đã được xác định chính xác trên bản đồ. 
            Maid sẽ dễ dàng tìm đến nhà bạn.
          </div>
        )}
      </BookingCard>
      
      <BookingCard>
        <StepTitle>
          <CheckCircle size={20} />
          Tính năng nổi bật
        </StepTitle>
        
        <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <h4 style={{ color: '#374151', marginBottom: '8px' }}>🚀 Cải tiến cho Booking:</h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li>⚡ <strong>Autocomplete thông minh:</strong> Gợi ý ngay khi gõ</li>
            <li>🎯 <strong>Độ chính xác cao:</strong> Kết hợp nhiều nguồn dữ liệu</li>
            <li>📍 <strong>Xác định tọa độ:</strong> Giúp maid tìm đường dễ dàng</li>
            <li>💾 <strong>Lưu lịch sử:</strong> Gợi ý địa chỉ đã dùng</li>
            <li>🗺️ <strong>Tích hợp bản đồ:</strong> Chọn vị trí chính xác</li>
          </ul>
        </div>
      </BookingCard>
    </DemoContainer>
  );
};

export default BookingAddressDemo;
