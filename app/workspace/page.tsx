'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getInitialTheme, saveTheme, type Theme } from '@/lib/theme-utils';
import SettingsPopup from '@/app/components/workspace/SettingsPopup';

// Компоненты
import Navbar from '@/app/components/workspace/Navbar';
import Sidebar from '@/app/components/workspace/Sidebar';
import CanvasToolbar from '@/app/components/workspace/CanvasToolbar';
import Canvas from '@/app/components/workspace/Canvas';
import { CanvasElement } from '@/app/components/workspace/CanvasElement';

// Константы и типы
import { colors, sidebarItems, tools, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/app/components/workspace/Constants';
import { Tool } from '@/app/components/workspace/Types';

// Хуки
import { useCanvasPan, useKeyboardShortcuts } from '@/app/components/workspace/Hooks';

export default function WorkspacePage() {
  // Состояния UI
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  
  // Состояния Canvas
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  
  // Refs
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { isPanning, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasPan();
  useKeyboardShortcuts(selectedElement, canvasElements, setCanvasElements, setSelectedElement);

  // Инициализация темы
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  // Обработчики
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    saveTheme(newTheme);
  }, [isDarkMode]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handlePanOffsetChange = useCallback((newOffset: { x: number; y: number }) => {
    setPanOffset(newOffset);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const addElement = useCallback((type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 300,
      height: type === 'text' ? 50 : 200,
      ...(type === 'text' && {
        content: 'Double click to edit',
        fontSize: 24,
        fontFamily: 'Inter',
        color: isDarkMode ? '#ffffff' : '#000000'
      }),
      ...(type === 'shape' && {
        color: '#4D4AFF'
      }),
      rotation: 0,
      opacity: 1
    };
    setCanvasElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  }, [isDarkMode]);

  const handleAddText = useCallback(() => {
    addElement('text');
    setActiveTool('select');
  }, [addElement]);

  const handleSelectElement = useCallback((id: string) => {
    setSelectedElement(id);
  }, []);

  const handleUpdateElement = useCallback((updatedElement: CanvasElement) => {
    setCanvasElements(prev =>
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    handleMouseDown(e, panOffset);
  }, [handleMouseDown, panOffset]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    handleMouseMove(e, setPanOffset);
  }, [handleMouseMove]);

  // Текущая цветовая схема
  const currentColors = isDarkMode ? colors.dark : colors.light;

  if (!isLoaded) {
    return <div className={`min-h-screen ${currentColors.bg}`}></div>;
  }

  return (
    <div className={`h-screen flex flex-col ${currentColors.bg} ${currentColors.text} overflow-hidden transition-colors duration-300`}>
      {/* Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        activeTool={activeTool}
        showSettingsPopup={showSettingsPopup}
        onToolChange={setActiveTool}
        onSettingsClick={() => setShowSettingsPopup(true)}
        colors={currentColors}
        tools={tools}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          items={sidebarItems}
          isDarkMode={isDarkMode}
          showSettingsPopup={showSettingsPopup}
          onSettingsClick={() => setShowSettingsPopup(true)}
          colors={currentColors}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CanvasToolbar
            zoom={zoom}
            showGrid={showGrid}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onToggleGrid={handleToggleGrid}
            colors={currentColors}
          />

          <Canvas
            ref={viewportRef}
            elements={canvasElements}
            selectedElement={selectedElement}
            zoom={zoom}
            panOffset={panOffset}
            showGrid={showGrid}
            isDarkMode={isDarkMode}
            isPanning={isPanning}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onSelectElement={handleSelectElement}
            onUpdateElement={handleUpdateElement}
            onActivateTool={setActiveTool}
            onAddText={handleAddText}
            onZoomChange={handleZoomChange}
            onPanOffsetChange={handlePanOffsetChange}
            colors={currentColors}
          />
        </div>
      </div>

      {/* Settings Popup */}
      <SettingsPopup
        isOpen={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Стили */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#475569' : '#cbd5e1'};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
}