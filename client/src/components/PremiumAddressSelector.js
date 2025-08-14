import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Map as MapIcon, MapPin, Clock, Star, ChevronDown, Sparkles, Navigation } from 'lucide-react';
import { reverseGeocode, searchCombinedPlaces, searchVietnamesePlaces } from '../services/mapboxService';
import { getAddressSuggestions } from '../services/vietnamAddressService';
import { entranceAnimations, exitAnimations, microAnimations } from '../utils/gsapAnimations';
import Map from './Map';
import MapDebug from './MapDebug';

const PremiumAddressSelector = ({ 
  value = '', 
  onChange, 
  placeholder = 'Nhập địa chỉ hoặc chọn từ gợi ý...',
  disabled = false,
  showMapButton = true,
  onAddressSelect,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Load recent searches and suggestions
  useEffect(() => {
    const loadInitialData = async () => {
      const saved = localStorage.getItem('mymaid_recent_addresses');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading recent searches:', error);
        }
      }
      
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
        setIsFocused(false);
        if (dropdownRef.current) {
          exitAnimations.dropdownOut(dropdownRef.current);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change with debounce
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setShowResults(true);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (!newValue.trim()) {
      setSearchResults([]);
      return;
    }

    if (newValue.trim().length >= 2) {
      setIsSearching(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const result = await searchCombinedPlaces(newValue, null, 8);
          if (result.success) {
            setSearchResults(result.addresses || result.places || []);
          }
        } catch (error) {
          console.error('Lỗi autocomplete:', error);
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

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
    if (inputRef.current) {
      microAnimations.hoverLift(inputRef.current.parentElement);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    if (inputRef.current) {
      microAnimations.hoverReset(inputRef.current.parentElement);
    }
  };

  // Handle select result
  const handleSelectResult = useCallback((result) => {
    setSearchQuery(result.fullName);
    setSearchResults([]);
    setSelectedCoordinates(result.coordinates);
    setShowResults(false);
    
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

    // Success animation
    if (inputRef.current) {
      microAnimations.successPulse(inputRef.current.parentElement);
    }
  }, [onChange, onAddressSelect, saveToRecentSearches]);

  // Handle clear
  const handleClear = () => {
    setSearchQuery('');
    setSelectedCoordinates(null);
    setSearchResults([]);
    setShowResults(false);
    
    if (onChange) {
      onChange('');
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchCombinedPlaces(searchQuery, null, 8);
      if (result.success) {
        setSearchResults(result.addresses || result.places || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Animate dropdown when it appears
  useEffect(() => {
    if (showResults && dropdownRef.current) {
      entranceAnimations.dropdownIn(dropdownRef.current);
    }
  }, [showResults]);

  // Get placeholder icon
  const getPlaceIcon = (type) => {
    switch (type) {
      case 'province': return '🏛️';
      case 'district': return '🏢';
      case 'address': return '🏠';
      case 'poi': return '📍';
      default: return '📍';
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Main Input Container */}
      <div className={`
        relative flex items-center gap-3 p-4 
        bg-white/80 backdrop-blur-xl border border-neutral-200/50
        rounded-2xl shadow-soft transition-all duration-300 ease-smooth
        ${isFocused ? 'border-primary-400/50 shadow-primary bg-white' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-medium hover:border-neutral-300/50'}
      `}>
        {/* Search Icon */}
        <div className={`
          flex items-center justify-center w-5 h-5 transition-colors duration-200
          ${isFocused ? 'text-primary-500' : 'text-neutral-400'}
        `}>
          <Search size={20} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          autoComplete="off"
          className={`
            flex-1 bg-transparent border-none outline-none
            text-neutral-900 placeholder-neutral-400
            text-base font-medium
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="
                p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 
                text-neutral-500 hover:text-neutral-700
                transition-all duration-200 hover:scale-105
              "
              title="Xóa"
            >
              <X size={16} />
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim() || disabled}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm
              transition-all duration-200 hover:scale-105
              ${isSearching || !searchQuery.trim() || disabled
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary'
              }
            `}
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </button>

          {/* Map Button */}
          {showMapButton && (
            <button
              onClick={() => setShowMap(true)}
              disabled={disabled}
              className="
                px-4 py-2 rounded-xl bg-secondary-500 hover:bg-secondary-600 
                text-white font-medium text-sm shadow-secondary
                transition-all duration-200 hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <MapIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      {showResults && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-white/95 backdrop-blur-xl border border-neutral-200/50
            rounded-2xl shadow-luxury overflow-hidden
          "
        >
          {/* Recent searches when no query */}
          {!searchQuery.trim() && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  <Clock size={14} />
                  Tìm kiếm gần đây
                </div>
              </div>
              {recentSearches.map((result, index) => (
                <div
                  key={`recent-${result.id}`}
                  onClick={() => handleSelectResult(result)}
                  className="
                    flex items-center gap-4 p-4 cursor-pointer
                    hover:bg-primary-50/50 transition-all duration-200
                    border-b border-neutral-100/50 last:border-b-0
                  "
                >
                  <div className="
                    w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200
                    flex items-center justify-center text-lg
                  ">
                    {getPlaceIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-900 truncate">
                      {result.name}
                    </div>
                    <div className="text-sm text-neutral-500 truncate">
                      {result.fullName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="
                        inline-flex items-center gap-1 px-2 py-1 
                        bg-neutral-100 rounded-lg text-xs text-neutral-600
                      ">
                        <Clock size={10} />
                        Gần đây
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search results */}
          {searchResults.length > 0 && (
            <div>
              {recentSearches.length > 0 && searchQuery.trim() && (
                <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                    <Search size={14} />
                    Kết quả tìm kiếm
                  </div>
                </div>
              )}
              {searchResults.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="
                    flex items-center gap-4 p-4 cursor-pointer
                    hover:bg-primary-50/50 transition-all duration-200
                    border-b border-neutral-100/50 last:border-b-0
                  "
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-lg
                    ${result.type === 'province' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                      result.type === 'district' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                      'bg-gradient-to-br from-green-100 to-green-200'}
                  `}>
                    {getPlaceIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-900 truncate">
                      {result.name}
                    </div>
                    <div className="text-sm text-neutral-500 truncate">
                      {result.fullName}
                    </div>
                    {result.components && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {result.components.district && (
                          <span className="
                            inline-flex items-center gap-1 px-2 py-1 
                            bg-blue-100 rounded-lg text-xs text-blue-700
                          ">
                            <MapPin size={10} />
                            {result.components.district}
                          </span>
                        )}
                        {result.relevance && (
                          <span className="
                            inline-flex items-center gap-1 px-2 py-1 
                            bg-yellow-100 rounded-lg text-xs text-yellow-700
                          ">
                            <Star size={10} />
                            {Math.round(result.relevance * 100)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading state */}
          {isSearching && searchQuery.trim().length >= 2 && (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
              <div className="font-medium text-neutral-700 mb-1">Đang tìm kiếm...</div>
              <div className="text-sm text-neutral-500">Vui lòng chờ trong giây lát</div>
            </div>
          )}

          {/* No results */}
          {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3 opacity-50">🔍</div>
              <div className="font-medium text-neutral-700 mb-1">Không tìm thấy địa chỉ</div>
              <div className="text-sm text-neutral-500">Thử tìm kiếm với từ khóa khác hoặc sử dụng bản đồ</div>
            </div>
          )}
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="
            w-full max-w-4xl bg-white rounded-3xl shadow-luxury overflow-hidden
            transform transition-all duration-300
          ">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">Chọn địa chỉ trên bản đồ</h3>
              <button
                onClick={() => setShowMap(false)}
                className="
                  p-2 rounded-xl hover:bg-neutral-100 
                  text-neutral-500 hover:text-neutral-700
                  transition-all duration-200
                "
              >
                <X size={24} />
              </button>
            </div>
            <div className="h-96">
              <MapDebug />
              <Map
                initialCenter={[106.6297, 10.8231]}
                initialZoom={12}
                searchable={false}
                height="100%"
                markers={selectedCoordinates ? [{
                  coordinates: selectedCoordinates,
                  title: 'Địa điểm đã chọn',
                  description: 'Click để xác nhận'
                }] : []}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PremiumAddressSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  showMapButton: PropTypes.bool,
  onAddressSelect: PropTypes.func,
  className: PropTypes.string
};

export default PremiumAddressSelector;
