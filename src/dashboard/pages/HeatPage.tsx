import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useVehicleAPI } from '../../api/VehicleContext';

interface HeatPageProps {
  onBack: () => void;
}

export const HeatPage: React.FC<HeatPageProps> = ({ onBack }) => {
  const { state, setInsideTemp, setSeatHeat } = useVehicleAPI();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [animationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    setIsFadingIn(false);
  }, []);

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onBack();
      setIsFadingOut(false);
    }, animationsEnabled ? 300 : 0);
  };

  const handleSeatHeatClick = (seat: 'driver' | 'passenger', level: number) => {
    setSeatHeat(seat, level as 0 | 1 | 2 | 3);
  };

  const getHeatColor = (level: number): string => {
    switch (level) {
      case 0:
        return '#c5ffba';
      case 1:
        return '#ffd4a3';
      case 2:
        return '#ffb366';
      case 3:
        return '#ff6b6b';
      default:
        return '#c5ffba';
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
        transition: animationsEnabled ? 'opacity 0.3s ease-out' : 'none',
        position: 'relative',
        borderRadius: '0 0 20px 0px',
      }}
    >
      {/* Slider Styling */}
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          accent-color: #c5ffba;
          background: linear-gradient(to right, #c5ffba 0%, #c5ffba 100%);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c5ffba;
          cursor: pointer;
          border: 2px solid #6b4a5a;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: linear-gradient(to right, #c5ffba 0%, #ffffff 100%);
          height: 6px;
          border-radius: 3px;
          border: none;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c5ffba;
          cursor: pointer;
          border: 2px solid #6b4a5a;
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }
        input[type="range"]::-moz-range-progress {
          background-color: #c5ffba;
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 16px',
          backgroundColor: '#ffffff',
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
          display: 'flex',
          gap: '16px',
          alignContent: 'start',
          maxWidth: '100%',
        }}
      >
        {/* Left Column - Controls */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: '0',
          }}
        >
          {/* Air Conditioning Control */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderLeft: '4px solid #c5ffba',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
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
                gap: '12px',
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
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#6b4a5a',
                  minWidth: '50px',
                  textAlign: 'center',
                }}
              >
                {Math.round(state.insideTemp)}°
              </div>
            </div>
          </div>

          {/* Driver Seat Heat */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderLeft: '4px solid #c5ffba',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
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
                gap: '8px',
              }}
            >
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSeatHeatClick('driver', level)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: getSeatHeatLevel('driver') === level ? getHeatColor(level) : '#e8f5e9',
                    color: getSeatHeatLevel('driver') === level ? '#2d5016' : '#6b4a5a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (getSeatHeatLevel('driver') !== level) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
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
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderLeft: '4px solid #c5ffba',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
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
                gap: '8px',
              }}
            >
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSeatHeatClick('passenger', level)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: getSeatHeatLevel('passenger') === level ? getHeatColor(level) : '#e8f5e9',
                    color: getSeatHeatLevel('passenger') === level ? '#2d5016' : '#6b4a5a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (getSeatHeatLevel('passenger') !== level) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {level === 0 ? 'Off' : level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Car Image Preview with Clickable Overlay */}
        <div
          id="heat-image-container"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderLeft: '4px solid #c5ffba',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            minWidth: '280px',
            maxWidth: '350px',
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
