import React, { useState } from 'react';
import styled from 'styled-components';
import AddressSelector from '../components/AddressSelector';

const DemoContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #1f2937;
  margin-bottom: 40px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
`;

const SectionTitle = styled.h2`
  color: #374151;
  margin-bottom: 16px;
  font-size: 18px;
`;

const ResultDisplay = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ResultTitle = styled.h3`
  color: #374151;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
`;

const ResultContent = styled.pre`
  background: #1f2937;
  color: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
`;

const AddressSelectorDemo = () => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState(null);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressSelect = (details) => {
    setAddressDetails(details);
    console.log('Address selected:', details);
  };

  return (
    <DemoContainer>
      <Title>🏠 Address Selector Demo - Việt Nam</Title>
      
      <Section>
        <SectionTitle>Tính năng chọn địa chỉ Việt Nam</SectionTitle>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Thử nhập địa chỉ hoặc tên tỉnh/thành phố để xem gợi ý. Ví dụ: "Hà Nội", "Quận 1", "Hồ Chí Minh"
        </p>
        
        <AddressSelector
          value={selectedAddress}
          onChange={handleAddressChange}
          onAddressSelect={handleAddressSelect}
          placeholder="Nhập địa chỉ hoặc chọn từ gợi ý..."
        />
      </Section>

      {selectedAddress && (
        <Section>
          <SectionTitle>Địa chỉ đã nhập</SectionTitle>
          <ResultDisplay>
            <ResultTitle>Văn bản:</ResultTitle>
            <div style={{ padding: '8px', background: 'white', borderRadius: '4px', border: '1px solid #d1d5db' }}>
              {selectedAddress}
            </div>
          </ResultDisplay>
        </Section>
      )}

      {addressDetails && (
        <Section>
          <SectionTitle>Chi tiết địa chỉ đã chọn</SectionTitle>
          <ResultDisplay>
            <ResultTitle>Dữ liệu JSON:</ResultTitle>
            <ResultContent>
              {JSON.stringify(addressDetails, null, 2)}
            </ResultContent>
          </ResultDisplay>
        </Section>
      )}

      <Section>
        <SectionTitle>Hướng dẫn sử dụng</SectionTitle>
        <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <h4 style={{ color: '#374151', marginBottom: '8px' }}>Các tính năng:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>🔍 <strong>Tìm kiếm thông minh:</strong> Gõ tên tỉnh/thành phố, quận/huyện để xem gợi ý</li>
            <li>📍 <strong>Tích hợp Mapbox:</strong> Kết quả từ cả API Việt Nam và Mapbox</li>
            <li>⏰ <strong>Lịch sử tìm kiếm:</strong> Hiển thị các địa chỉ đã tìm gần đây</li>
            <li>🗺️ <strong>Chọn trên bản đồ:</strong> Click nút "Bản đồ" để chọn địa chỉ chính xác</li>
            <li>✨ <strong>Giao diện đẹp:</strong> Dropdown với animation và icon</li>
          </ul>
          
          <h4 style={{ color: '#374151', margin: '16px 0 8px', }}>Ví dụ tìm kiếm:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>"Hà Nội" - Tìm các quận/huyện ở Hà Nội</li>
            <li>"Quận 1" - Tìm Quận 1 ở các thành phố</li>
            <li>"Hồ Chí Minh" - Tìm các quận ở TP.HCM</li>
            <li>"Cầu Giấy" - Tìm quận Cầu Giấy</li>
          </ul>
        </div>
      </Section>
    </DemoContainer>
  );
};

export default AddressSelectorDemo;
