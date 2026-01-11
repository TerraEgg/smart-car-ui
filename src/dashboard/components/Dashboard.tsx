import React, { useState, useEffect } from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';
import { StartScreen } from './StartScreen';
import { GridViewPage } from '../pages/GridViewPage';
import { MyBMWPage } from '../pages/MyBMWPage';
import './Dashboard.css';

type PageType = 'grid' | 'mybmw' | 'player';

export const Dashboard: React.FC = () => {
  const { state } = useVehicleAPI();
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('grid');
  const [mergeStepBackground, setMergeStepBackground] = useState(0);
  const [mergeColor, setMergeColor] = useState<string | null>(null);

  // Preload car images
  useEffect(() => {
    const img1 = new Image();
    img1.src = '/dcar.png';
    img1.onload = () => setImageLoaded(true);
    const img2 = new Image();
    img2.src = '/lcar.png';
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
      transition: mergeStepBackground >= 3 ? 'background-color 2s ease' : 'none'
    }}>
      {currentPage === 'grid' && (
        <div className="carplay-content" style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}>
          <GridViewPage 
            onNavigateToMyBMW={() => setCurrentPage('mybmw')}
            onNavigateToPlayer={() => setCurrentPage('player')}
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
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f2d2dc' }}>
          <div>Player Page (Coming Soon)</div>
        </div>
      )}
    </div>
  );
};
