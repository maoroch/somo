// Canvas.tsx
'use client';

import React, { memo, forwardRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Wand2, Type } from 'lucide-react';
import CanvasElementRenderer from './CanvasElementRenderer';
import VideoGenerationPopup from './popups/VideoGenerationPopup';
import { CanvasElement, Tool, FrameElement } from './Types';
import { ElementFactory } from './tools/ElementFactory';

interface CanvasProps {
  elements: CanvasElement[];
  selectedElement: string | null;
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  isDarkMode: boolean;
  isPanning: boolean;
  activeTool: Tool;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onSelectElement: (id: string) => void;
  onUpdateElement: (element: CanvasElement) => void;
  onActivateTool: (tool: Tool) => void;
  onAddText: () => void;
  onAddElement?: (element: CanvasElement) => void;
  onZoomChange: (zoom: number) => void;
  onPanOffsetChange: (offset: { x: number; y: number }) => void;
  colors: {
    bg: string;
    canvas: string;
    text: string;
    textTertiary: string;
  };
}

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_SENSITIVITY = 0.001;

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
  elements,
  selectedElement,
  zoom,
  panOffset,
  showGrid,
  isDarkMode,
  isPanning,
  activeTool,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onSelectElement,
  onUpdateElement,
  onActivateTool,
  onAddText,
  onAddElement,
  onZoomChange,
  onPanOffsetChange,
  colors
}, viewportRef) => {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [canvasRef, setCanvasRef] = useState<HTMLDivElement | null>(null);
  const [newFrameElements, setNewFrameElements] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupFrameId, setPopupFrameId] = useState<string | null>(null);

  // Отслеживаем размеры viewport
  useEffect(() => {
    const viewport = viewportRef as React.RefObject<HTMLDivElement>;
    if (!viewport.current) return;

    const updateViewportSize = () => {
      if (viewport.current) {
        setViewportSize({
          width: viewport.current.clientWidth,
          height: viewport.current.clientHeight,
        });
      }
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    
    return () => window.removeEventListener('resize', updateViewportSize);
  }, [viewportRef]);

  // Canvas параметры
  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const scale = zoom / 100;

  const centeredPanOffset = {
    x: panOffset.x + (viewportSize.width - canvasWidth * scale) / 2,
    y: panOffset.y + (viewportSize.height - canvasHeight * scale) / 2,
  };

  // Обработка клика на холсте для создания элементов
// В Canvas.tsx внутри handleCanvasClick:
// Canvas.tsx - исправленный handleCanvasClick для frame
const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  if (activeTool === 'text' || activeTool === 'image' || activeTool === 'frame') {
    if (e.target === canvasRef || (e.target as HTMLElement).closest('.canvas-bg')) {
      const rect = canvasRef!.getBoundingClientRect();
      const offsetRect = (viewportRef as React.RefObject<HTMLDivElement>).current?.getBoundingClientRect();
      
      if (!offsetRect) return;

      const clickX = e.clientX - offsetRect.left;
      const clickY = e.clientY - offsetRect.top;

      const canvasX = (clickX - centeredPanOffset.x) / scale;
      const canvasY = (clickY - centeredPanOffset.y) / scale;

      if (canvasX < 0 || canvasY < 0 || canvasX > canvasWidth || canvasY > canvasHeight) {
        return;
      }

      const newElement = ElementFactory.createElement(activeTool, {
        x: canvasX,
        y: canvasY,
        isDarkMode
      });

      if (activeTool === 'frame' && onAddElement) {
        const frameElement = newElement as FrameElement;
        onAddElement(frameElement);
        onSelectElement(frameElement.id);
        
        // ✅ СРАЗУ ОТКРЫВАЕМ POPUP ДЛЯ НОВОГО FRAME
        setTimeout(() => {
          setPopupFrameId(frameElement.id);
          setIsPopupOpen(true);
        }, 50); // Небольшая задержка для плавности
      } 
      else if (activeTool === 'text' && onAddElement) {
        onAddElement(newElement);
        onSelectElement(newElement.id);
        
        // Для текста автоматически включаем редактирование
        setTimeout(() => {
          const textElement = document.querySelector(`[data-element-id="${newElement.id}"]`);
          if (textElement) {
            textElement.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
          }
        }, 100);
      }
      else if (onAddElement) {
        onAddElement(newElement);
        onSelectElement(newElement.id);
      }
    }
  }
}, [activeTool, canvasRef, centeredPanOffset, scale, canvasWidth, canvasHeight, viewportRef, onAddElement, onSelectElement]);  // Очищаем элементы из списка новых, когда они получают видео
useEffect(() => {
  elements.forEach(element => {
    if (element.type === 'frame') {
      const frameElement = element as FrameElement;
      if (frameElement.videoUrl && popupFrameId === frameElement.id) {
        // Если этот frame получил видео и у него открыт popup - закрываем
        setIsPopupOpen(false);
        setPopupFrameId(null);
      }
    }
  });
}, [elements, popupFrameId]);

  // Обработчик для открытия popup из FrameTool
  const handleOpenPopup = useCallback(() => {
    if (selectedElement) {
      const element = elements.find(el => el.id === selectedElement);
      if (element?.type === 'frame') {
        const frameElement = element as FrameElement;
        if (!frameElement.videoUrl) {
          setPopupFrameId(frameElement.id);
          setIsPopupOpen(true);
        }
      }
    }
  }, [selectedElement, elements]);

  // Обработчик для закрытия popup
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setPopupFrameId(null);
  }, []);

  // Обработчик генерации видео
  const handleGenerateVideo = useCallback((data: { prompt: string; duration: number; style: string }) => {
    console.log('Generating video for frame:', popupFrameId, 'with data:', data);
    
    if (popupFrameId) {
      const element = elements.find(el => el.id === popupFrameId);
      if (element?.type === 'frame') {
        const frameElement = element as FrameElement;
        // Обновляем элемент с сгенерированным видео
        const updatedElement: FrameElement = {
          ...frameElement,
          videoUrl: `https://example.com/generated-video-${Date.now()}.mp4`
        };
        
        onUpdateElement(updatedElement);
        
        // Закрываем popup
        setTimeout(() => {
          setIsPopupOpen(false);
          setPopupFrameId(null);
        }, 1000);
      }
    }
  }, [popupFrameId, elements, onUpdateElement]);

  // Обработка wheel для зума и паннинга
  useEffect(() => {
    const viewport = viewportRef as React.RefObject<HTMLDivElement>;
    if (!viewport.current) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      let dx = e.deltaX;
      let dy = e.deltaY;

      if (e.deltaMode === 1) {
        dx *= 16;
        dy *= 16;
      } else if (e.deltaMode === 2) {
        dx *= window.innerHeight;
        dy *= window.innerHeight;
      }

      if (e.ctrlKey || e.metaKey) {
        const rect = viewport.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const canvasX = (mouseX - centeredPanOffset.x) / scale;
        const canvasY = (mouseY - centeredPanOffset.y) / scale;

        const zoomFactor = Math.exp(-dy * ZOOM_SENSITIVITY);
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
        const newScale = newZoom / 100;

        const newCenteredPanX = mouseX - canvasX * newScale;
        const newCenteredPanY = mouseY - canvasY * newScale;

        const originalPanX = newCenteredPanX - (viewportSize.width - canvasWidth * newScale) / 2;
        const originalPanY = newCenteredPanY - (viewportSize.height - canvasHeight * newScale) / 2;

        onZoomChange(newZoom);
        onPanOffsetChange({ x: originalPanX, y: originalPanY });
      } else {
        onPanOffsetChange({
          x: panOffset.x - dx,
          y: panOffset.y - dy,
        });
      }
    };

    viewport.current.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.current?.removeEventListener('wheel', handleWheel);
  }, [zoom, panOffset, viewportRef, onZoomChange, onPanOffsetChange, viewportSize, centeredPanOffset.x, centeredPanOffset.y, scale]);

  // Изменяем курсор в зависимости от активного инструмента
  const getCursorStyle = () => {
    if (isPanning) return 'grabbing';
    if (activeTool === 'text') return 'text';
    if (activeTool === 'image' || activeTool === 'frame') return 'crosshair';
    return 'default';
  };

  return (
    <>
      <div
        ref={viewportRef}
        className={`flex-1 overflow-hidden ${colors.bg}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: getCursorStyle() }}
      >
        <div className="relative" style={{ minWidth: '100%', minHeight: '100%' }}>
          <div
            ref={setCanvasRef}
            className={`relative canvas-bg ${colors.canvas} shadow-2xl rounded-lg overflow-hidden`}
            onClick={handleCanvasClick}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              transform: `translate(${centeredPanOffset.x}px, ${centeredPanOffset.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              border: `1px solid ${isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.15)'}`,
              cursor: getCursorStyle(),
            }}
          >
            {/* Grid */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: isDarkMode
                    ? 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)'
                    : 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            )}

            {/* Canvas Elements */}
            {elements.length === 0 ? (
              <div 
                className="absolute pointer-events-none"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '480px' }}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(77, 74, 255,0.2), rgba(3,0,186,0.2))' }}
                  >
                    <Sparkles className="w-10 h-10" style={{ color: '#4D4AFF' }} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>Start Creating</h3>
                    <p className={colors.textTertiary}>Select a tool from the toolbar to begin</p>
                  </div>
                  <div className="flex gap-3 justify-center mt-6 pointer-events-auto">
                    <button
                      onClick={() => onActivateTool('ai')}
                      className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #4D4AFF, #0300BA)', boxShadow: '0 8px 20px rgba(77,74,255,0.3)' }}
                    >
                      <Wand2 className="w-5 h-5 inline mr-2" /> Generate with AI
                    </button>
                    <button
                      onClick={onAddText}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all border hover:bg-slate-100 dark:hover:bg-slate-800`}
                    >
                      <Type className="w-5 h-5 inline mr-2" /> Add Text
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              elements.map((el) => {
                // Определяем, является ли это новым frame элементом без видео
                const isNewFrameElement = el.type === 'frame' && 
                                         newFrameElements.includes(el.id) && 
                                         !(el as FrameElement).videoUrl;

                return (
                  <CanvasElementRenderer
                    key={el.id}
                    element={el}
                    isSelected={selectedElement === el.id}
                    isDarkMode={isDarkMode}
                    zoom={zoom}
                    onSelect={onSelectElement}
                    onUpdate={onUpdateElement}
                    elementId={el.id}
                    // Передаем autoOpenPopup только для новых frame элементов без видео
                    autoOpenPopup={isNewFrameElement}
                    onOpenPopup={handleOpenPopup}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Popup для генерации видео */}
      <VideoGenerationPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onGenerate={handleGenerateVideo}
        selectedFrameId={popupFrameId}
      />
    </>
  );
});

Canvas.displayName = 'Canvas';

export default memo(Canvas);