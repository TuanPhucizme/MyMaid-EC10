import React, { useState } from 'react';
import styled from 'styled-components';
import Map from '../components/Map';
import AddressSelector from '../components/AddressSelector';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const DemoSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const MapDemoPage = () => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [markers, setMarkers] = useState([]);

  const handleAddressSelect = ({ address, coordinates }) => {
    setSelectedAddress(address);
    setSelectedCoordinates(coordinates);
    
    // Thêm marker mới
    setMarkers([{
      coordinates,
      title: 'Địa điểm đã chọn',
      description: address
    }]);
  };

  const handleMapClick = (coordinates) => {
    setSelectedCoordinates(coordinates);
    setMarkers([{
      coordinates,
      title: 'Điểm được chọn',
      description: `Tọa độ: ${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`
    }]);
  };

  return (
    <Container>
      <Content>
        <Header>
          <Title>🗺️ Mapbox Demo</Title>
          <Subtitle>Test các component map và địa chỉ</Subtitle>
        </Header>

        <DemoSection>
          <SectionTitle>📍 Address Selector</SectionTitle>
          <AddressSelector
            value={selectedAddress}
            onChange={setSelectedAddress}
            onAddressSelect={handleAddressSelect}
            placeholder="Nhập địa chỉ hoặc chọn trên bản đồ..."
          />
          
          {selectedAddress && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-800">Địa chỉ đã chọn:</p>
              <p className="text-green-700">{selectedAddress}</p>
              {selectedCoordinates && (
                <p className="text-sm text-green-600 mt-1">
                  Tọa độ: {selectedCoordinates[1].toFixed(6)}, {selectedCoordinates[0].toFixed(6)}
                </p>
              )}
            </div>
          )}
        </DemoSection>

        <DemoSection>
          <SectionTitle>🗺️ Interactive Map</SectionTitle>
          <Map
            initialCenter={[106.6297, 10.8231]} // Hồ Chí Minh
            initialZoom={12}
            markers={markers}
            onMapClick={handleMapClick}
            height="500px"
          />
        </DemoSection>

        <DemoSection>
          <SectionTitle>📊 Thông tin</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Địa chỉ:</h3>
              <p className="text-gray-600">{selectedAddress || 'Chưa chọn'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tọa độ:</h3>
              <p className="text-gray-600">
                {selectedCoordinates 
                  ? `${selectedCoordinates[1].toFixed(6)}, ${selectedCoordinates[0].toFixed(6)}`
                  : 'Chưa chọn'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Số markers:</h3>
              <p className="text-gray-600">{markers.length}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Trạng thái:</h3>
              <p className="text-gray-600">
                {selectedAddress && selectedCoordinates ? '✅ Hoàn tất' : '⏳ Chưa hoàn tất'}
              </p>
            </div>
          </div>
        </DemoSection>
      </Content>
    </Container>
  );
};

export default MapDemoPage;
