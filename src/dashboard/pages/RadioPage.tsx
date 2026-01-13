import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Music, X, Loader } from 'lucide-react';

interface RadioStation {
  stationuuid: string;
  name: string;
  country: string;
  language: string;
  votes: number;
  url: string;
  favicon?: string;
}

interface RadioPageProps {
  onBack: () => void;
  onSelectStation?: (station: RadioStation) => void;
  initialError?: string | null;
  loadingStationId?: string | null;
}

export const RadioPage: React.FC<RadioPageProps> = ({ onBack, onSelectStation, initialError, loadingStationId }) => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSelectingStation, setIsSelectingStation] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [showError, setShowError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [animationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update error when initialError changes from Dashboard
  useEffect(() => {
    if (initialError) {
      setError(initialError);
      setShowError(true);
      
      // Clear previous timeout if it exists
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Auto-dismiss after 2 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setShowError(false);
      }, 2000);
    } else {
      setShowError(false);
    }
  }, [initialError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Pre-load stations on component mount
  useEffect(() => {
    const preloadStations = async () => {
      try {
        const url = `https://de1.api.radio-browser.info/json/stations/search?language=english&limit=50&order=votes&reverse=true`;
        const response = await fetch(url);
        const data = await response.json();
        const sorted = (data as RadioStation[]).sort((a, b) => b.votes - a.votes);
        setStations(sorted);
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error pre-loading radio stations:', error);
        setIsInitialLoad(false);
      }
    };

    preloadStations();
  }, []);

  // Fetch radio stations from Radio Browser API
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        // Search for English language stations, optionally filtered by search query
        const searchParam = searchQuery.trim() ? `&name=${encodeURIComponent(searchQuery)}` : '';
        const url = `https://de1.api.radio-browser.info/json/stations/search?language=english&limit=100&order=votes&reverse=true${searchParam}`;

        const response = await fetch(url);
        const data = await response.json();

        // Sort by votes (popularity) descending
        const sorted = (data as RadioStation[]).sort((a, b) => b.votes - a.votes);
        setStations(sorted);
      } catch (error) {
        console.error('Error fetching radio stations:', error);
        setStations([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch on search query changes (not on initial mount since we pre-loaded)
    if (searchQuery.trim()) {
      const timer = setTimeout(fetchStations, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleBack = () => {
    setIsFadingOut(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setTimeout(() => {
      onBack();
      setIsFadingOut(false);
    }, animationsEnabled ? 300 : 0);
  };

  const handleSelectStation = (station: RadioStation) => {
    // Prevent multiple rapid clicks
    if (isSelectingStation) return;
    setIsSelectingStation(true);
    setError(null);
    setShowError(false);
    
    onSelectStation?.(station);
    
    // Debounce - allow next selection after 500ms
    setTimeout(() => setIsSelectingStation(false), 500);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffdfbb',
        display: 'flex',
        flexDirection: 'column',
        opacity: isFadingOut ? 0 : 1,
        transition: animationsEnabled ? 'opacity 0.3s ease-out' : 'none',
        position: 'relative',
      }}
    >
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Error Toast Notification */}
      {showError && error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#d32f2f',
            color: 'white',
            padding: '16px 24px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideDown 0.3s ease-out',
            fontSize: '14px',
            fontWeight: '500',
            justifyContent: 'center',
          }}
        >
          <span style={{ flex: 1 }}>Failed to play stream</span>
          <button
            onClick={() => {
              setShowError(false);
              if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Keyframe animation for toast */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#6b4a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Title */}
      <div
        style={{
          padding: '30px 20px 0',
          textAlign: 'center',
          color: '#6b4a5a',
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
          }}
        >
          Live Radio
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          padding: '0 20px 20px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Search size={18} color="#6b4a5a" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              color: '#6b4a5a',
              outline: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          />
        </div>
      </div>

      {/* Stations List */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 20px 20px',
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#6b4a5a',
              fontSize: '14px',
            }}
          >
            Loading stations...
          </div>
        ) : stations.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#6b4a5a',
              fontSize: '14px',
            }}
          >
            {isInitialLoad ? 'Searching for radios' : 'No stations found'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stations.map((station) => (
              <button
                key={station.stationuuid}
                onClick={() => handleSelectStation(station)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {loadingStationId === station.stationuuid ? (
                  <Loader size={20} color="#6b4a5a" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Music size={20} color="#6b4a5a" style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b4a5a',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {station.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                    }}
                  >
                    {station.language && station.language.charAt(0).toUpperCase() + station.language.slice(1)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
