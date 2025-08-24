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
      <Title>🏠 Enhanced Address Selector - Google Maps Style</Title>

      <Section>
        <SectionTitle>🚀 Tính năng Autocomplete thông minh</SectionTitle>
        <div style={{ color: '#6b7280', marginBottom: '20px' }}>
          <p><strong>✨ Tính năng mới:</strong></p>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>🔍 <strong>Autocomplete thông minh:</strong> Tìm kiếm ngay khi gõ, giống Google Maps</li>
            <li>🏢 <strong>Địa điểm phổ biến:</strong> Hiển thị sân bay, trung tâm thành phố khi chưa nhập gì</li>
            <li>🕒 <strong>Lịch sử tìm kiếm:</strong> Lưu và gợi ý các địa chỉ đã tìm gần đây</li>
            <li>🎯 <strong>Kết quả đa nguồn:</strong> Kết hợp Mapbox API và Vietnam Address API</li>
            <li>📍 <strong>Thông tin chi tiết:</strong> Hiển thị quận/huyện, thành phố, độ liên quan</li>
            <li>⚡ <strong>Tối ưu hiệu năng:</strong> Debounce thông minh, tìm kiếm song song</li>
          </ul>
        </div>

        <AddressSelector
          value={selectedAddress}
          onChange={handleAddressChange}
          onAddressSelect={handleAddressSelect}
          placeholder="🔍 Nhập địa chỉ để xem autocomplete thông minh..."
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
          <SectionTitle>🔍 Thông tin chi tiết địa chỉ</SectionTitle>
          <div style={{ display: 'grid', gap: '16px' }}>
            <ResultDisplay>
              <ResultTitle>📋 Thông tin cơ bản:</ResultTitle>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div><strong>Địa chỉ:</strong> {addressDetails.address}</div>
                <div><strong>Loại:</strong> {addressDetails.type}</div>
                <div><strong>Nguồn:</strong> {addressDetails.source}</div>
                {addressDetails.relevance && (
                  <div><strong>Độ liên quan:</strong> {Math.round(addressDetails.relevance * 100)}%</div>
                )}
              </div>
            </ResultDisplay>

            {addressDetails.coordinates && (
              <ResultDisplay>
                <ResultTitle>🗺️ Tọa độ:</ResultTitle>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div><strong>Kinh độ:</strong> {addressDetails.coordinates[0]}</div>
                  <div><strong>Vĩ độ:</strong> {addressDetails.coordinates[1]}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    📍 <a
                      href={`https://www.google.com/maps?q=${addressDetails.coordinates[1]},${addressDetails.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6' }}
                    >
                      Xem trên Google Maps
                    </a>
                  </div>
                </div>
              </ResultDisplay>
            )}

            {addressDetails.components && (
              <ResultDisplay>
                <ResultTitle>🏛️ Thành phần địa chỉ:</ResultTitle>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {addressDetails.components.district && (
                    <div><strong>Quận/Huyện:</strong> {addressDetails.components.district}</div>
                  )}
                  {addressDetails.components.city && (
                    <div><strong>Thành phố:</strong> {addressDetails.components.city}</div>
                  )}
                  {addressDetails.components.country && (
                    <div><strong>Quốc gia:</strong> {addressDetails.components.country}</div>
                  )}
                </div>
              </ResultDisplay>
            )}

            <ResultDisplay>
              <ResultTitle>💻 Raw JSON Data:</ResultTitle>
              <ResultContent>
                {JSON.stringify(addressDetails, null, 2)}
              </ResultContent>
            </ResultDisplay>
          </div>
        </Section>
      )}

      <Section>
        <SectionTitle>📖 Hướng dẫn sử dụng Enhanced Address Selector</SectionTitle>
        <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <h4 style={{ color: '#374151', marginBottom: '8px' }}>🚀 Tính năng nâng cao:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>⚡ <strong>Autocomplete thông minh:</strong> Tìm kiếm ngay khi gõ với debounce tối ưu</li>
            <li>🌟 <strong>Địa điểm phổ biến:</strong> Hiển thị sân bay, trung tâm thành phố khi chưa nhập</li>
            <li>🔄 <strong>Tìm kiếm đa nguồn:</strong> Kết hợp Mapbox API và Vietnam Address API song song</li>
            <li>🎯 <strong>Kết quả thông minh:</strong> Sắp xếp theo độ liên quan, loại bỏ trùng lặp</li>
            <li>💾 <strong>Lịch sử tìm kiếm:</strong> Lưu và gợi ý các địa chỉ đã chọn gần đây</li>
            <li>🎨 <strong>Giao diện đẹp:</strong> Highlight từ khóa, icon phân loại, badge thông tin</li>
            <li>🗺️ <strong>Tích hợp bản đồ:</strong> Chọn địa chỉ chính xác trên bản đồ Mapbox</li>
            <li>📱 <strong>Responsive:</strong> Hoạt động tốt trên mọi thiết bị</li>
          </ul>

          <h4 style={{ color: '#374151', margin: '16px 0 8px' }}>💡 Cách sử dụng:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Bước 1:</strong> Click vào ô tìm kiếm để xem địa điểm phổ biến hoặc lịch sử</li>
            <li><strong>Bước 2:</strong> Gõ từ khóa (ít nhất 1 ký tự) để xem gợi ý autocomplete</li>
            <li><strong>Bước 3:</strong> Chọn địa chỉ từ danh sách hoặc dùng bản đồ</li>
            <li><strong>Bước 4:</strong> Xem thông tin chi tiết bao gồm tọa độ và thành phần địa chỉ</li>
          </ul>

          <h4 style={{ color: '#374151', margin: '16px 0 8px' }}>🔍 Ví dụ tìm kiếm:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li><code>"H"</code> → Hà Nội, Hồ Chí Minh, Hải Phòng...</li>
            <li><code>"Quận 1"</code> → Quận 1 ở các thành phố</li>
            <li><code>"Sân bay"</code> → Tân Sơn Nhất, Nội Bài...</li>
            <li><code>"123 Nguyễn Huệ"</code> → Địa chỉ cụ thể</li>
          </ul>
        </div>
      </Section>
    </DemoContainer>
  );
};

export default AddressSelectorDemo;
