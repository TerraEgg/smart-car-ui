import React, { useState } from 'react';
import { Radio, ArrowLeft, Settings } from 'lucide-react';
import { useVehicleAPI } from '../../api/VehicleContext';

interface GridViewPageProps {
  onNavigateToMyBMW: () => void;
  onNavigateToPlayer: () => void;
  onNavigateToSettings: () => void;
  onMergeStepChange?: (step: number, color: string | null) => void;
  onBack?: () => void;
}

export const GridViewPage: React.FC<GridViewPageProps> = ({ onNavigateToMyBMW, onNavigateToPlayer, onNavigateToSettings, onMergeStepChange, onBack }) => {
  const { state } = useVehicleAPI();
  const [mergeStep, setMergeStep] = useState(0);
  const [clickedTileColor, setClickedTileColor] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTileClick = (tileColor: string, onNavigate: () => void) => {
    if (mergeStep === 0 && !isAnimating) {
      setIsAnimating(true);
      setClickedTileColor(tileColor);
      
      // Step 0->1: Images/text fade out (0.5s)
      setTimeout(() => {
        setMergeStep(1);
        onMergeStepChange?.(1, tileColor);
      }, 500);
      
      // Step 1->2: Tiles fade to clicked color (0.5s later, 1s total)
      setTimeout(() => {
        setMergeStep(2);
        onMergeStepChange?.(2, null);
      }, 1000);
      
      // Step 2->3: Background fades to clicked color (0.5s later, 1.5s total - after tiles finish)
      setTimeout(() => {
        setMergeStep(3);
        onMergeStepChange?.(3, tileColor);
      }, 1500);
      
      // Step 3->4: Elements disappear and navigate (2s later, 3.5s total - after background fade completes)
      setTimeout(() => {
        setMergeStep(4);
        onMergeStepChange?.(4, null);
        onNavigate();
      }, 3500);
    }
  };

  const handleLargeTileClick = () => {
    handleTileClick('#f0d3dc', onNavigateToMyBMW);
  };

  const handlePlayerTileClick = () => {
    handleTileClick('#ffdfbb', onNavigateToPlayer);
  };

  const handleSettingsTileClick = () => {
    handleTileClick('#bae1ff', onNavigateToSettings);
  };

  // Format time to 12-hour format
  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="dashboard-grid-view" style={{
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 100,
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)')}
          title="Back"
        >
          <ArrowLeft size={24} />
        </button>
      )}

      {/* Weather/Time/Temp Display - Simple Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          left: '0',
          right: '0',
          backgroundColor: 'transparent',
          padding: '4px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
          height: '30px',
          opacity: isAnimating ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* Time on left */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: '400',
            color: '#FFFFFF',
            flex: 1,
          }}
        >
          {formatTime(state.time)}
        </div>

        {/* Temp in middle */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: '400',
            color: '#FFFFFF',
            flex: 1,
            textAlign: 'center',
          }}
        >
          {Math.round(state.outsideTemp)}°C
        </div>

        {/* Weather on right */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: '400',
            color: '#FFFFFF',
            flex: 1,
            textAlign: 'right',
            textTransform: 'capitalize',
          }}
        >
          {state.weather}
        </div>
      </div>

      <div className="dashboard-grid" style={{
        backgroundColor: 'transparent',
        transition: 'none',
        borderRadius: '20px',
        display: mergeStep >= 4 ? 'none' : 'grid'
      }}>
        {/* First row */}
        <div 
          className="tile tile-large" 
          onClick={handleLargeTileClick}
          style={{ 
            backgroundColor: mergeStep >= 2 && clickedTileColor ? clickedTileColor : '#f0d3dc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0',
            overflow: 'hidden',
            gap: '0',
            cursor: isAnimating ? 'default' : 'pointer',
            boxShadow: isAnimating && mergeStep >= 3 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '20px',
            transition: `background-color 0.5s ease`,
            pointerEvents: isAnimating && mergeStep >= 3 ? 'none' : 'auto',
            position: 'relative'
          }}>
          <img 
            src={state.lights !== 'off' ? '/lcar.png' : '/dcar.png'} 
            alt="Car" 
            className="car-image"
            style={{
              width: 'calc(100% * 5 / 7)',
              height: 'calc(100% * 5 / 7)',
              objectFit: 'contain',
              marginLeft: '-70px',
              flexShrink: 0,
              opacity: isAnimating ? 0 : 1,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none'
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: '100%',
            paddingRight: '100px',
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.5s ease'
          }}>
            <div style={{ 
              fontSize: '52px', 
              fontWeight: '300',
              letterSpacing: '-2px',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif'
            }}>
              myBMW
            </div>
          </div>
        </div>

        <div 
          className="tile tile-medium" 
          onClick={handlePlayerTileClick}
          style={{ 
            backgroundColor: mergeStep >= 2 && clickedTileColor ? clickedTileColor : '#ffdfbb',
            transition: `background-color 0.5s ease`,
            boxShadow: isAnimating && mergeStep >= 1 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={{
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            height: '100%'
          }}>
            <Radio size={64} color="#6b4a5a" strokeWidth={1.5} />
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '500',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif'
            }}>
              Player
            </div>
          </div>
        </div>
        
        {/* Second row */}
        <div 
          className="tile tile-medium" 
          style={{ 
            backgroundColor: mergeStep >= 2 && clickedTileColor ? clickedTileColor : '#ffffba',
            transition: `background-color 0.5s ease`,
            boxShadow: isAnimating && mergeStep >= 3 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            pointerEvents: isAnimating && mergeStep >= 3 ? 'none' : 'auto',
          }}
        ></div>
        
        <div 
          className="tile tile-medium" 
          style={{ 
            backgroundColor: mergeStep >= 2 && clickedTileColor ? clickedTileColor : '#baffc9',
            transition: `background-color 0.5s ease`,
            boxShadow: isAnimating && mergeStep >= 3 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            pointerEvents: isAnimating && mergeStep >= 3 ? 'none' : 'auto'
          }}
        ></div>
        
        <div 
          className="tile tile-medium" 
          onClick={handleSettingsTileClick}
          style={{ 
            backgroundColor: mergeStep >= 2 && clickedTileColor ? clickedTileColor : '#bae1ff',
            transition: `background-color 0.5s ease`,
            boxShadow: isAnimating && mergeStep >= 3 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: isAnimating ? 'default' : 'pointer',
            pointerEvents: isAnimating && mergeStep >= 3 ? 'none' : 'auto'
          }}
        >
          <div style={{
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            height: '100%'
          }}>
            <Settings size={64} color="#6b4a5a" strokeWidth={1.5} />
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '500',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif'
            }}>
              Settings
            </div>
          </div>
        </div>
      </div>

      {/* Three dots menu at bottom */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        opacity: mergeStep >= 1 ? 0 : 1,
        transition: 'opacity 1s ease',
        pointerEvents: mergeStep >= 1 ? 'none' : 'auto',
        zIndex: 10
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(107, 74, 90, 0.4)',
        }}></div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(107, 74, 90, 0.4)',
        }}></div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(107, 74, 90, 0.4)',
        }}></div>
      </div>
    </div>
  );
};
