import React, { useState, useEffect, useRef } from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';
import { StartScreen } from './StartScreen';
import { GridViewPage } from '../pages/GridViewPage';
import { MyBMWPage } from '../pages/MyBMWPage';
import { PlayerPage } from '../pages/PlayerPage';
import { RadioPage } from '../pages/RadioPage';
import { OnlinePage } from '../pages/OnlinePage';
import { SettingsPage } from '../pages/SettingsPage';
import { GPSPage } from '../pages/GPSPage';
import { NotificationDisplay } from '../../components/NotificationDisplay';
import './Dashboard.css';

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

type PageType = 'grid' | 'mybmw' | 'player' | 'radio' | 'online' | 'settings' | 'gps';
type PlaybackSource = 'radio' | 'online' | null;

export const Dashboard: React.FC = () => {
  const { state } = useVehicleAPI();
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('grid');
  const [mergeStepBackground, setMergeStepBackground] = useState(0);
  const [mergeColor, setMergeColor] = useState<string | null>(null);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [currentOnlineTrack, setCurrentOnlineTrack] = useState<OnlineTrack | null>(null);
  const [playbackSource, setPlaybackSource] = useState<PlaybackSource>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [loadingStationId, setLoadingStationId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Preload car images
  useEffect(() => {
    const img1 = new Image();
    img1.src = '/dcar.png';
    img1.onload = () => setImageLoaded(true);
    const img2 = new Image();
    img2.src = '/lcar.png';
  }, []);

  const handleSelectStation = (station: RadioStation) => {
    // Stop online music if playing
    if (playbackSource === 'online') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentOnlineTrack(null);
    }

    // Prevent multiple simultaneous plays
    if (currentStation?.stationuuid === station.stationuuid && isPlaying) {
      return;
    }

    setCurrentStation(station);
    setPlaybackSource('radio');
    setIsPlaying(true);
    setPlaybackError(null);
    setLoadingStationId(station.stationuuid);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      // Small delay to ensure audio element is reset
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = station.url;
          audioRef.current.play().catch(error => {
            console.error('Playback error:', error);
            setPlaybackError(`Failed to play "${station.name}". This station may not support streaming or have CORS issues.`);
            setIsPlaying(false);
            setLoadingStationId(null);
          });
        }
      }, 100);
    }
  };

  const handleOnlineTrackPlay = (track: OnlineTrack) => {
    // Stop radio if playing
    if (playbackSource === 'radio') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentStation(null);
    }

    setCurrentOnlineTrack(track);
    setPlaybackSource('online');
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.volume = volume / 100;
      audioRef.current.play().catch((err) => console.log('Play error:', err));
    }
  };

  const togglePlayPause = () => {
    if (!currentStation || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => console.error('Playback error:', error));
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  // Clear loading state when audio actually starts playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      setLoadingStationId(null);
    };

    audio.addEventListener('playing', handlePlaying);
    return () => audio.removeEventListener('playing', handlePlaying);
  }, []);

  useEffect(() => {
    if (state.isEngineRunning && !showDashboard) {
      setIsLoading(true);
      setCurrentPage('grid');
      // Wait for image to load only, no artificial delay
      const checkAndShow = () => {
        if (imageLoaded) {
          setIsLoading(false);
          setShowDashboard(true);
        } else {
          setTimeout(checkAndShow, 50);
        }
      };
      checkAndShow();
    } else if (!state.isEngineRunning) {
      setShowDashboard(false);
      setIsLoading(false);
      setCurrentPage('grid');
    }
  }, [state.isEngineRunning, showDashboard, imageLoaded]);

  if (!state.isEngineRunning) {
    return <StartScreen />;
  }

  if (isLoading) {
    return (
      <div className="loading-screen-full">
        <div className="loading-content">
          <div className="loading-title">SmartCarOS</div>
          <div className="spinner" style={{ pointerEvents: 'none' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`carplay-display ${showDashboard ? 'fade-in' : ''}`} style={{
      width: '100%',
      height: '100%',
      backgroundColor: mergeStepBackground >= 3 && mergeColor ? mergeColor : 'transparent',
      transition: mergeStepBackground >= 3 ? 'background-color 2s ease' : 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <audio ref={audioRef} crossOrigin="anonymous" />

      {currentPage === 'grid' && (
        <div className="carplay-content" style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 10
        }}>
          <GridViewPage 
            onNavigateToMyBMW={() => setCurrentPage('mybmw')}
            onNavigateToPlayer={() => setCurrentPage('player')}
            onNavigateToSettings={() => setCurrentPage('settings')}
            onNavigateToGPS={() => setCurrentPage('gps')}
            onMergeStepChange={(step, color) => {
              setMergeStepBackground(step);
              setMergeColor(color);
            }}
          />
        </div>
      )}

      {currentPage === 'mybmw' && (
        <MyBMWPage onBack={() => setCurrentPage('grid')} />
      )}

      {currentPage === 'player' && (
        <PlayerPage
          onBack={() => setCurrentPage('grid')}
          onNavigateToRadio={() => setCurrentPage('radio')}
          onNavigateToOnline={() => setCurrentPage('online')}
          currentStation={currentStation}
          currentOnlineTrack={currentOnlineTrack}
          playbackSource={playbackSource}
          isPlaying={isPlaying}
          volume={volume}
          onTogglePlayPause={togglePlayPause}
          onVolumeChange={handleVolumeChange}
        />
      )}

      {currentPage === 'radio' && (
        <RadioPage
          onBack={() => setCurrentPage('player')}
          onSelectStation={handleSelectStation}
          initialError={playbackError}
          loadingStationId={loadingStationId}
        />
      )}

      {currentPage === 'online' && (
        <OnlinePage 
          onBack={() => setCurrentPage('player')}
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
          onTrackPlay={handleOnlineTrackPlay}
          currentTrack={currentOnlineTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      {currentPage === 'settings' && (
        <SettingsPage onBack={() => setCurrentPage('grid')} />
      )}
      {currentPage === 'gps' && (
        <GPSPage onBack={() => setCurrentPage('grid')} />
      )}
      <NotificationDisplay />
    </div>
  );
};
