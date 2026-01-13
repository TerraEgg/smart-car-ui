import React, { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer } from 'lucide-react';
import { useVehicleAPI } from '../../api/VehicleContext';
import { useNotifications } from '../../api/NotificationContext';

interface HeatPageProps {
  onBack: () => void;
}

export const HeatPage: React.FC<HeatPageProps> = ({ onBack }) => {
  const { state, setInsideTemp, setSeatHeat } = useVehicleAPI();
  const { showNotification } = useNotifications();
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

  const handleSeatHeatClick = (seat: 'driver' | 'passenger', level: number) => {
    setSeatHeat(seat, level as 0 | 1 | 2 | 3);
  };

  const getHeatColor = (level: number): string => {
    switch (level) {
      case 0:
        return '#e5e5e5';
      case 1:
        return '#ffd4a3';
      case 2:
        return '#ffb366';
      case 3:
        return '#ff6b6b';
      default:
        return '#e5e5e5';
    }
  };

  const getSeatHeatLevel = (seat: 'driver' | 'passenger'): number => {
    return state.seatHeat[seat] || 0;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#c5ffba',
        display: 'flex',
        flexDirection: 'column',
        opacity: isFadingOut ? 0 : isFadingIn ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        position: 'relative',
        borderRadius: '0 0 20px 0px',
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
          Heat Settings
        </div>
      </div>

      {/* Content Grid */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gridTemplateRows: 'auto auto auto',
          gap: '16px',
          alignContent: 'start',
        }}
      >
        {/* Air Conditioning Control */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            gridColumn: '1 / 2',
            gridRow: '1 / 2',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          >
            A/C Temperature
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="range"
              min="15"
              max="30"
              step="0.5"
              value={state.insideTemp}
              onChange={(e) => setInsideTemp(Number(e.target.value))}
              style={{
                flex: 1,
                height: '6px',
                cursor: 'pointer',
              }}
            />
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b4a5a',
                minWidth: '35px',
              }}
            >
              {Math.round(state.insideTemp)}°
            </div>
          </div>
        </div>

        {/* Driver Seat Heat */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            gridColumn: '1 / 2',
            gridRow: '2 / 3',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          >
            Driver Seat
          </div>
          <div
            style={{
              display: 'flex',
              gap: '6px',
            }}
          >
            {[0, 1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => handleSeatHeatClick('driver', level)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: getSeatHeatLevel('driver') === level ? '2px solid #6b4a5a' : '1px solid #ccc',
                  backgroundColor: getSeatHeatLevel('driver') === level ? getHeatColor(level) : '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b4a5a',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (getSeatHeatLevel('driver') !== level) {
                    e.currentTarget.style.backgroundColor = getHeatColor(level) + '40';
                  }
                }}
                onMouseLeave={(e) => {
                  if (getSeatHeatLevel('driver') !== level) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
              >
                {level === 0 ? 'Off' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Passenger Seat Heat */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '140px',
            overflow: 'hidden',
            gridColumn: '1 / 2',
            gridRow: '3 / 4',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          >
            Passenger Seat
          </div>
          <div
            style={{
              display: 'flex',
              gap: '6px',
            }}
          >
            {[0, 1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => handleSeatHeatClick('passenger', level)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: getSeatHeatLevel('passenger') === level ? '2px solid #6b4a5a' : '1px solid #ccc',
                  backgroundColor: getSeatHeatLevel('passenger') === level ? getHeatColor(level) : '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b4a5a',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (getSeatHeatLevel('passenger') !== level) {
                    e.currentTarget.style.backgroundColor = getHeatColor(level) + '40';
                  }
                }}
                onMouseLeave={(e) => {
                  if (getSeatHeatLevel('passenger') !== level) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
              >
                {level === 0 ? 'Off' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Car Image Preview with Clickable Overlay */}
        <div
          id="heat-image-container"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
            maxHeight: '450px',
            gridColumn: '2 / 3',
            gridRow: '1 / 4',
            position: 'relative',
            userSelect: 'none',
          }}
        >
          <img
            src="/hc.png"
            style={{
              maxHeight: '100%',
              maxWidth: '90%',
              borderRadius: '8px',
              objectFit: 'contain',
              marginTop: '0px',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            alt="Heated Seats"
          />
          {/* Passenger Seat Clickable Area */}
          <div
            onClick={() => handleSeatHeatClick('passenger', (getSeatHeatLevel('passenger') + 1) % 4)}
            style={{
              position: 'absolute',
              left: '20.7%',
              top: '12.7%',
              width: '25.4%',
              height: '20.7%',
              cursor: 'pointer',
              zIndex: 10,
            }}
            title="Click to adjust Passenger Seat Heat"
          />
          {/* Driver Seat Clickable Area */}
          <div
            onClick={() => handleSeatHeatClick('driver', (getSeatHeatLevel('driver') + 1) % 4)}
            style={{
              position: 'absolute',
              left: '57.3%',
              top: '12.4%',
              width: '26.7%',
              height: '20.7%',
              cursor: 'pointer',
              zIndex: 10,
            }}
            title="Click to adjust Driver Seat Heat"
          />
        </div>
      </div>
    </div>
  );
};
