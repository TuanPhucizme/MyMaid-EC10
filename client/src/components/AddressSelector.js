import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { MapPin, Search, X, Map as MapIcon } from 'lucide-react';
import { geocodeAddress, searchPlaces, reverseGeocode } from '../services/mapboxService';
import Map from './Map';
import MapDebug from './MapDebug';

const Container = styled.div`
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const MapButton = styled.button`
  padding: 12px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #059669;
  }
`;

const ClearButton = styled.button`
  padding: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: #dc2626;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultName = styled.div`
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ResultAddress = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const MapModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const MapModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MapModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MapModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const MapModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const MapModalBody = styled.div`
  flex: 1;
  min-height: 400px;
`;

const AddressSelector = ({ 
  value = '', 
  onChange, 
  placeholder = 'Nhập địa chỉ...',
  disabled = false,
  showMapButton = true,
  onAddressSelect
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  // Tìm kiếm địa chỉ
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await geocodeAddress(searchQuery, 'VN');
      if (result.success) {
        setSearchResults([{
          id: 'search-result',
          name: 'Kết quả tìm kiếm',
          fullName: result.placeName,
          coordinates: result.coordinates
        }]);
      } else {
        setSearchResults([]);
        alert(result.message);
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      alert('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Xử lý khi chọn kết quả tìm kiếm
  const handleSelectResult = (result) => {
    setSearchQuery(result.fullName);
    setSearchResults([]);
    setSelectedCoordinates(result.coordinates);
    
    if (onChange) {
      onChange(result.fullName);
    }
    
    if (onAddressSelect) {
      onAddressSelect({
        address: result.fullName,
        coordinates: result.coordinates
      });
    }
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Xử lý khi thay đổi giá trị input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Xóa kết quả tìm kiếm khi người dùng thay đổi input
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  };

  // Xóa địa chỉ
  const handleClear = () => {
    setSearchQuery('');
    setSelectedCoordinates(null);
    setSearchResults([]);
    
    if (onChange) {
      onChange('');
    }
  };

  // Xử lý khi click trên bản đồ
  const handleMapClick = (coordinates) => {
    setSelectedCoordinates(coordinates);
  };

  // Xác nhận địa chỉ từ bản đồ
  const handleConfirmMapSelection = async () => {
    if (selectedCoordinates) {
      try {
        const result = await reverseGeocode(selectedCoordinates[0], selectedCoordinates[1]);
        if (result.success) {
          setSearchQuery(result.address);
          setShowMap(false);
          
          if (onChange) {
            onChange(result.address);
          }
          
          if (onAddressSelect) {
            onAddressSelect({
              address: result.address,
              coordinates: selectedCoordinates
            });
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        alert('Có lỗi xảy ra khi xác định địa chỉ');
      }
    }
  };

  return (
    <Container>
      <InputContainer>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        
        <SearchButton 
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim() || disabled}
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Search size={16} />
          )}
          Tìm
        </SearchButton>
        
        {showMapButton && (
          <MapButton onClick={() => setShowMap(true)} disabled={disabled}>
            <MapIcon size={16} />
            Bản đồ
          </MapButton>
        )}
        
        {searchQuery && (
          <ClearButton onClick={handleClear} title="Xóa">
            <X size={16} />
          </ClearButton>
        )}
      </InputContainer>

      {searchResults.length > 0 && (
        <SearchResults>
          {searchResults.map((result) => (
            <SearchResultItem
              key={result.id}
              onClick={() => handleSelectResult(result)}
            >
              <ResultName>{result.name}</ResultName>
              <ResultAddress>{result.fullName}</ResultAddress>
            </SearchResultItem>
          ))}
        </SearchResults>
      )}

      {showMap && (
        <MapModal>
          <MapModalContent>
            <MapModalHeader>
              <MapModalTitle>Chọn địa chỉ trên bản đồ</MapModalTitle>
              <MapModalClose onClick={() => setShowMap(false)}>
                <X size={20} />
              </MapModalClose>
            </MapModalHeader>
            <MapModalBody>
              <MapDebug />
              <Map
                initialCenter={[106.6297, 10.8231]} // Hồ Chí Minh
                initialZoom={12}
                onMapClick={handleMapClick}
                searchable={false}
                height="400px"
                markers={selectedCoordinates ? [{
                  coordinates: selectedCoordinates,
                  title: 'Địa điểm đã chọn',
                  description: 'Click để xác nhận'
                }] : []}
              />
            </MapModalBody>
            <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMap(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmMapSelection}
                disabled={!selectedCoordinates}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: selectedCoordinates ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  cursor: selectedCoordinates ? 'pointer' : 'not-allowed'
                }}
              >
                Xác nhận
              </button>
            </div>
          </MapModalContent>
        </MapModal>
      )}
    </Container>
  );
};

export default AddressSelector;
