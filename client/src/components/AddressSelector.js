import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Map as MapIcon, MapPin, Clock, Star, ChevronDown, Sparkles } from 'lucide-react';
import { reverseGeocode, searchCombinedPlaces, searchVietnamesePlaces } from '../services/mapboxService';
import { getAddressSuggestions } from '../services/vietnamAddressService';
import { entranceAnimations, exitAnimations, microAnimations } from '../utils/gsapAnimations';
import Map from './Map';
import MapDebug from './MapDebug';

// Keyframes for animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
  transition: all 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #9ca3af;
    font-style: italic;
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 8px;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.2s ease-out;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const SearchResultItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-left: 4px solid #3b82f6;
    transform: translateX(2px);
  }

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 12px 12px;
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ResultIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: ${props => {
    switch (props.type) {
      case 'address': return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
      case 'poi': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'place': return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
      default: return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'address': return '#1e40af';
      case 'poi': return '#d97706';
      case 'place': return '#059669';
      default: return '#6b7280';
    }
  }};
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.4;
`;

const ResultAddress = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 6px;
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #9ca3af;
`;

const ResultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: #f1f5f9;
  border-radius: 4px;
  font-weight: 500;
`;

const NoResults = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: #6b7280;

  .icon {
    font-size: 32px;
    margin-bottom: 8px;
    opacity: 0.5;
  }

  .title {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 12px;
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 12px;
`;

const LoadingText = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const LoadingSubtext = styled.div`
  font-size: 12px;
  opacity: 0.8;
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
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const containerRef = useRef(null);

  // Tìm kiếm địa chỉ với autocomplete
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchVietnamesePlaces(searchQuery, null, 5);
      if (result.success) {
        setSearchResults(result.places);
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

  // Debounce cho autocomplete
  const debounceTimeout = useRef(null);

  // Load recent searches from localStorage and suggestions
  useEffect(() => {
    const loadInitialData = async () => {
      // Load recent searches
      const saved = localStorage.getItem('mymaid_recent_addresses');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading recent searches:', error);
        }
      }

      // Load popular suggestions if no recent searches
      if (!saved) {
        try {
          const suggestions = await getAddressSuggestions();
          if (suggestions.success && suggestions.suggestions) {
            setRecentSearches(suggestions.suggestions.slice(0, 3));
          }
        } catch (error) {
          console.error('Error loading address suggestions:', error);
        }
      }
    };

    loadInitialData();
  }, []);

  // Save to recent searches
  const saveToRecentSearches = useCallback((address) => {
    const newRecent = [address, ...recentSearches.filter(item => item.id !== address.id)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('mymaid_recent_addresses', JSON.stringify(newRecent));
  }, [recentSearches]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete khi gõ với debounce
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setShowResults(true);

    if (onChange) {
      onChange(newValue);
    }

    // Xóa timeout cũ
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Xóa kết quả tìm kiếm cũ nếu input trống
    if (!newValue.trim()) {
      setSearchResults([]);
      return;
    }

    // Chỉ tìm kiếm khi có ít nhất 2 ký tự và sau 300ms
    if (newValue.trim().length >= 2) {
      setIsSearching(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          // Sử dụng tìm kiếm kết hợp cho kết quả tốt hơn
          const result = await searchCombinedPlaces(newValue, null, 8);
          if (result.success) {
            setSearchResults(result.addresses || result.places || []);
          }
        } catch (error) {
          console.error('Lỗi autocomplete:', error);
          // Fallback về tìm kiếm Mapbox thông thường
          try {
            const fallbackResult = await searchVietnamesePlaces(newValue, null, 8);
            if (fallbackResult.success) {
              setSearchResults(fallbackResult.places || []);
            }
          } catch (fallbackError) {
            console.error('Lỗi fallback search:', fallbackError);
          }
        } finally {
          setIsSearching(false);
        }
      }, 300);
    }
  }, [onChange]);

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Xử lý khi chọn kết quả tìm kiếm
  const handleSelectResult = useCallback((result) => {
    setSearchQuery(result.fullName);
    setSearchResults([]);
    setSelectedCoordinates(result.coordinates);
    setShowResults(false);

    // Save to recent searches
    saveToRecentSearches(result);

    if (onChange) {
      onChange(result.fullName);
    }

    if (onAddressSelect) {
      onAddressSelect({
        address: result.fullName,
        coordinates: result.coordinates,
        components: result.components,
        formattedAddress: result.formattedAddress
      });
    }
  }, [onChange, onAddressSelect, saveToRecentSearches]);

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
    console.log('📍 Địa điểm được chọn từ bản đồ:', coordinates);
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
              coordinates: selectedCoordinates,
              components: result.components,
              formattedAddress: result.formattedAddress
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
    <Container ref={containerRef}>
      <InputContainer>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowResults(true)}
          disabled={disabled}
          autoComplete="off"
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

      {showResults && (
        <SearchResults>
          {/* Recent searches when no query */}
          {!searchQuery.trim() && recentSearches.length > 0 && (
            <>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  <Clock size={14} />
                  Tìm kiếm gần đây
                </div>
              </div>
              {recentSearches.map((result) => (
                <SearchResultItem
                  key={`recent-${result.id}`}
                  onClick={() => handleSelectResult(result)}
                >
                  <ResultHeader>
                    <ResultIcon type={result.type}>
                      {result.icon || '📍'}
                    </ResultIcon>
                    <ResultContent>
                      <ResultName>{result.name}</ResultName>
                      <ResultAddress>{result.fullName}</ResultAddress>
                      <ResultMeta>
                        <ResultBadge>
                          <Clock size={10} />
                          Gần đây
                        </ResultBadge>
                      </ResultMeta>
                    </ResultContent>
                  </ResultHeader>
                </SearchResultItem>
              ))}
            </>
          )}

          {/* Search results */}
          {searchResults.length > 0 && (
            <>
              {recentSearches.length > 0 && searchQuery.trim() && (
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                    <Search size={14} />
                    Kết quả tìm kiếm
                  </div>
                </div>
              )}
              {searchResults.map((result) => (
                <SearchResultItem
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                >
                  <ResultHeader>
                    <ResultIcon type={result.type}>
                      {result.icon || '📍'}
                    </ResultIcon>
                    <ResultContent>
                      <ResultName>{result.name}</ResultName>
                      <ResultAddress>{result.fullName}</ResultAddress>
                      {result.components && (
                        <ResultMeta>
                          {result.components.district && (
                            <ResultBadge>
                              <MapPin size={10} />
                              {result.components.district}
                            </ResultBadge>
                          )}
                          {result.components.city && (
                            <ResultBadge>
                              {result.components.city}
                            </ResultBadge>
                          )}
                          {result.relevance && (
                            <ResultBadge>
                              <Star size={10} />
                              {Math.round(result.relevance * 100)}%
                            </ResultBadge>
                          )}
                        </ResultMeta>
                      )}
                    </ResultContent>
                  </ResultHeader>
                </SearchResultItem>
              ))}
            </>
          )}

          {/* No results */}
          {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
            <NoResults>
              <div className="icon">🔍</div>
              <div className="title">Không tìm thấy địa chỉ</div>
              <div className="subtitle">Thử tìm kiếm với từ khóa khác hoặc sử dụng bản đồ</div>
            </NoResults>
          )}
        </SearchResults>
      )}

      {/* Loading state */}
      {isSearching && searchQuery.trim().length >= 2 && showResults && (
        <SearchResults>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Đang tìm kiếm...</LoadingText>
            <LoadingSubtext>Vui lòng chờ trong giây lát</LoadingSubtext>
          </LoadingContainer>
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
              
              {/* Thông báo hướng dẫn */}
              {!selectedCoordinates && (
                <div style={{
                  padding: '12px 16px',
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  margin: '0 20px 16px 20px',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  💡 <strong>Hướng dẫn:</strong> Click vào bản đồ để chọn địa điểm chính xác
                </div>
              )}
              
              {/* Thông báo đã chọn */}
              {selectedCoordinates && (
                <div style={{
                  padding: '12px 16px',
                  background: '#d1fae5',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  margin: '0 20px 16px 20px',
                  fontSize: '14px',
                  color: '#065f46'
                }}>
                  ✅ <strong>Đã chọn địa điểm:</strong> {selectedCoordinates[1].toFixed(6)}, {selectedCoordinates[0].toFixed(6)}
                </div>
              )}
              
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

AddressSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  showMapButton: PropTypes.bool,
  onAddressSelect: PropTypes.func
};

AddressSelector.defaultProps = {
  value: '',
  onChange: null,
  placeholder: 'Nhập địa chỉ...',
  disabled: false,
  showMapButton: true,
  onAddressSelect: null
};

export default AddressSelector;
