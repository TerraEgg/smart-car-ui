import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [defaultModelMode, setDefaultModelMode] = useState<'2D' | '3D'>(() => {
    const saved = localStorage.getItem('defaultModelMode');
    return (saved as '2D' | '3D') || '2D';
  });

  useEffect(() => {
    setIsFadingIn(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('defaultModelMode', defaultModelMode);
  }, [defaultModelMode]);

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onBack();
      setIsFadingOut(false);
    }, animationsEnabled ? 300 : 0);
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
        transition: animationsEnabled ? 'opacity 0.3s ease-out' : 'none',
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

      {/* Settings Content - Stack Layout */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Toggle Animations */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#6b4a5a',
            }}
          >
            Animations
          </div>
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            style={{
              padding: '8px 16px',
              backgroundColor: animationsEnabled ? '#6b4a5a' : 'rgba(107, 74, 90, 0.2)',
              color: animationsEnabled ? '#FFFFFF' : '#6b4a5a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            {animationsEnabled ? 'On' : 'Off'}
          </button>
        </div>

        {/* Default Model Load Mode */}
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
            Default Model Type for myBMW
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            {(['2D', '3D'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDefaultModelMode(mode)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor:
                    defaultModelMode === mode ? '#6b4a5a' : 'rgba(107, 74, 90, 0.1)',
                  color: defaultModelMode === mode ? '#FFFFFF' : '#6b4a5a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Version Section */}
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
            Version
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#666',
            }}
          >
            Smart Car UI v3.2
          </div>
        </div>
      </div>
    </div>
  );
};
