import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

interface GPSPageProps {
  onBack: () => void;
}

interface LocationResult {
  lat: number;
  lon: number;
  name: string;
}

export const GPSPage: React.FC<GPSPageProps> = ({ onBack }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsFadingIn(false);
  }, []);

  useEffect(() => {
    // Initialize map only once
    if (!mapContainerRef.current || mapRef.current) return;

    // Load Leaflet CSS and JS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map(mapContainerRef.current).setView([-33.8688, 151.2093], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
    };
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onBack();
      setIsFadingOut(false);
    }, 300);
  };

  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(
        data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          name: item.display_name,
        }))
      );
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchWithDebounce = (query: string) => {
    setSearchQuery(query);
    setShowSearch(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const handleSelectLocation = (location: LocationResult) => {
    if (mapRef.current) {
      const L = (window as any).L;
      mapRef.current.setView([location.lat, location.lon], 15);
      L.marker([location.lat, location.lon])
        .addTo(mapRef.current)
        .bindPopup(location.name)
        .openPopup();
    }
    setSearchResults([]);
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#bae1ff',
        display: 'flex',
        flexDirection: 'column',
        opacity: isFadingOut ? 0 : isFadingIn ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#6b4a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Search Bar - Always visible */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: showSearch ? '350px' : '80px',
          zIndex: 1000,
          transition: 'width 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            alignItems: 'center',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
            <Search size={18} color="#6b4a5a" />
            {showSearch && (
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => handleSearchWithDebounce(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#6b4a5a',
                  backgroundColor: 'transparent',
                  paddingRight: '28px',
                }}
              />
            )}
            {showSearch && isLoading && (
              <div
                style={{
                  position: 'absolute',
                  right: '8px',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(107, 74, 90, 0.2)',
                  borderTop: '2px solid #6b4a5a',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            )}
            {!showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: '12px',
                  color: '#6b4a5a',
                  fontWeight: '500',
                }}
              >
                Search
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && showSearch && (
            <div
              style={{
                marginTop: '8px',
                maxHeight: '200px',
                overflow: 'auto',
                borderTop: '1px solid #e0e0e0',
                paddingTop: '8px',
              }}
            >
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '4px',
                    backgroundColor: 'rgba(107, 74, 90, 0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#6b4a5a',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(107, 74, 90, 0.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(107, 74, 90, 0.05)')
                  }
                >
                  {result.name.length > 50
                    ? result.name.substring(0, 50) + '...'
                    : result.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
