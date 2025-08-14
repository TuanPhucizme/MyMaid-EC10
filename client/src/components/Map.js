import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import { MapPin, Search, Navigation, X } from 'lucide-react';
import { geocodeAddress, searchPlaces } from '../services/mapboxService';

// Thiết lập Mapbox access token
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  MAPBOX_TOKEN: MAPBOX_ACCESS_TOKEN ? 'Đã có' : 'Chưa có',
  TOKEN_LENGTH: MAPBOX_ACCESS_TOKEN ? MAPBOX_ACCESS_TOKEN.length : 0
});

if (!MAPBOX_ACCESS_TOKEN) {
  console.error('❌ Mapbox access token không được tìm thấy!');
  console.error('Vui lòng kiểm tra REACT_APP_MAPBOX_ACCESS_TOKEN trong .env file.');
  console.error('Và restart development server.');
} else {
  console.log('✅ Mapbox access token đã được tìm thấy');
}

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  outline: none;
  
  &:focus {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
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

const SearchResults = styled.div`
  position: absolute;
  top: 70px;
  left: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
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

const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Marker = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background: #ef4444;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transform: translate(-50%, -100%);
  
  &:hover {
    transform: translate(-50%, -100%) scale(1.1);
  }
`;

const Map = ({ 
  initialCenter = [106.6297, 10.8231], // Hồ Chí Minh
  initialZoom = 10,
  markers = [],
  onMarkerClick,
  onMapClick,
  searchable = true,
  height = '400px'
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Khởi tạo bản đồ
  useEffect(() => {
    if (map.current) return;

    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('Không thể khởi tạo bản đồ: thiếu access token');
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCenter,
        zoom: initialZoom,
        language: 'vi'
      });
    } catch (error) {
      console.error('Lỗi khởi tạo Mapbox:', error);
      return;
    }

    // Thêm navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Thêm fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Xử lý sự kiện click trên bản đồ
    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    // Xử lý sự kiện load bản đồ
    map.current.on('load', () => {
      console.log('Bản đồ đã được tải thành công');
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom, onMapClick]);

  // Thêm markers khi markers thay đổi
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Xóa markers cũ
    const existingMarkers = document.querySelectorAll('.mapbox-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Thêm markers mới
    markers.forEach((marker, index) => {
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.innerHTML = `
        <div style="
          width: 30px; 
          height: 30px; 
          background: #ef4444; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        "></div>
      `;

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(marker, index));
      }

      new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                  ${marker.title || 'Địa điểm'}
                </h3>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  ${marker.description || marker.coordinates.join(', ')}
                </p>
              </div>
            `)
        )
        .addTo(map.current);
    });
  }, [markers, onMarkerClick]);

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
        
        // Di chuyển bản đồ đến kết quả
        map.current.flyTo({
          center: result.coordinates,
          zoom: 15
        });
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
    
    // Di chuyển bản đồ đến địa điểm được chọn
    map.current.flyTo({
      center: result.coordinates,
      zoom: 15
    });
  };

  // Lấy vị trí hiện tại của người dùng
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          // Di chuyển bản đồ đến vị trí người dùng
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
        },
        (error) => {
          console.error('Lỗi lấy vị trí:', error);
          alert('Không thể lấy vị trí hiện tại');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị');
    }
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Fallback UI khi không có access token
  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <MapContainer style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
          <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>Bản đồ không khả dụng</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Mapbox access token không được tìm thấy
          </p>
          <div style={{ 
            padding: '0.75rem 1rem', 
            background: '#fef3c7', 
            border: '1px solid #f59e0b',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            💡 Vui lòng kiểm tra file .env và restart development server
          </div>
        </div>
      </MapContainer>
    );
  }

  return (
    <MapContainer ref={mapContainer} style={{ height }}>
      {searchable && (
        <>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Tìm kiếm địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchButton 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search size={16} />
              )}
              Tìm
            </SearchButton>
          </SearchContainer>

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
        </>
      )}

      <MapControls>
        <ControlButton onClick={getUserLocation} title="Vị trí hiện tại">
          <Navigation size={20} />
        </ControlButton>
      </MapControls>
    </MapContainer>
  );
};

export default Map;
