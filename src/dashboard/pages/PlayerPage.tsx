import React, { useState, useEffect } from 'react';
import { Radio, Wifi, ArrowLeft, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface RadioStation {
  stationuuid: string;
  name: string;
  country: string;
  language: string;
  votes: number;
  url: string;
  favicon?: string;
}

interface OnlineTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  image: string;
  isLocal?: boolean;
}

interface PlayerPageProps {
  onBack: () => void;
  onNavigateToRadio?: () => void;
  onNavigateToOnline?: () => void;
  currentStation?: RadioStation | null;
  currentOnlineTrack?: OnlineTrack | null;
  playbackSource?: 'radio' | 'online' | null;
  isPlaying?: boolean;
  volume?: number;
  onTogglePlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({
  onBack,
  onNavigateToRadio,
  onNavigateToOnline,
  currentStation,
  currentOnlineTrack,
  playbackSource,
  isPlaying = false,
  volume = 70,
  onTogglePlayPause,
  onVolumeChange,
}) => {
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

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffdfbb',
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
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Now Playing Section */}
      {(currentStation || currentOnlineTrack) && (
        <div
          style={{
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            margin: '80px 20px 0',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            {playbackSource === 'radio' ? <Radio size={20} color="#6b4a5a" /> : <Music size={20} color="#6b4a5a" />}
            <div>
              <div style={{ fontSize: '12px', color: '#999' }}>Now Playing</div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#6b4a5a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                }}
              >
                {playbackSource === 'radio' ? currentStation?.name : currentOnlineTrack?.title}
              </div>
              {playbackSource === 'online' && currentOnlineTrack?.artist && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '300px',
                  }}
                >
                  {currentOnlineTrack.artist}
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <button
              onClick={onTogglePlayPause}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b4a5a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500',
              }}
            >
              {isPlaying ? (
                <>
                  <Pause size={16} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={16} />
                  Play
                </>
              )}
            </button>
          </div>

          {/* Volume Control */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {volume === 0 ? (
              <VolumeX size={18} color="#6b4a5a" />
            ) : (
              <Volume2 size={18} color="#6b4a5a" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange?.(Number(e.target.value))}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: '#ddd',
                outline: 'none',
                cursor: 'pointer',
                accentColor: '#6b4a5a',
              }}
            />
            <span style={{ fontSize: '12px', color: '#999', minWidth: '30px' }}>
              {volume}%
            </span>
          </div>
        </div>
      )}

      {/* Media Selection Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {/* Radio Button */}
        <button
          onClick={onNavigateToRadio}
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Radio size={64} color="#6b4a5a" strokeWidth={1.5} />
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          >
            Radio
          </div>
        </button>

        {/* Online Button */}
        <button
          onClick={onNavigateToOnline}
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Wifi size={64} color="#6b4a5a" strokeWidth={1.5} />
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6b4a5a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          >
            Online
          </div>
        </button>
      </div>
    </div>
  );
};
