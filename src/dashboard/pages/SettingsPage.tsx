import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useVehicleAPI } from '../../api/VehicleContext';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { state, setWeather } = useVehicleAPI();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    setIsFadingIn(false);
  }, []);

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onBack();
      setIsFadingOut(false);
    }, 300);
  };

  const handleWeatherChange = (weather: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy') => {
    setWeather(weather);
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
          zIndex: 50,
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
          Settings
        </div>
      </div>

      {/* Settings Content - Grid Layout */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          alignContent: 'start',
        }}
      >
        {/* Weather Tile */}
        <div
          style={{
            gridColumn: '1 / -1',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#6b4a5a',
              marginBottom: '12px',
            }}
          >
            Weather
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {(['clear', 'cloudy', 'rainy', 'snowy', 'foggy'] as const).map((weather) => (
              <button
                key={weather}
                onClick={() => handleWeatherChange(weather)}
                style={{
                  padding: '12px',
                  backgroundColor:
                    state.weather === weather ? '#6b4a5a' : 'rgba(107, 74, 90, 0.1)',
                  color: state.weather === weather ? '#FFFFFF' : '#6b4a5a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                }}
              >
                {weather}
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#6b4a5a',
              marginBottom: '12px',
            }}
          >
            About
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#666',
              lineHeight: '1.6',
            }}
          >
            <p>Smart Car UI v1.0</p>
            <p>A modern BMW-inspired dashboard for vehicle control and media management.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
