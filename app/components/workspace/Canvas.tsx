import React, { memo, forwardRef, useEffect } from 'react';
import { Sparkles, Wand2, Type } from 'lucide-react';
import CanvasElementComponent, { CanvasElement } from './CanvasElement';
import { Tool } from './Types';

interface CanvasProps {
  elements: CanvasElement[];
  selectedElement: string | null;
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  isDarkMode: boolean;
  isPanning: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onSelectElement: (id: string) => void;
  onUpdateElement: (element: CanvasElement) => void;
  onActivateTool: (tool: Tool) => void;
  onAddText: () => void;
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
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onSelectElement,
  onUpdateElement,
  onActivateTool,
  onAddText,
  onZoomChange,
  onPanOffsetChange,
  colors
}, viewportRef) => {
  
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
        // Зум
        const rect = viewport.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const canvasX = (mouseX - panOffset.x) / (zoom / 100);
        const canvasY = (mouseY - panOffset.y) / (zoom / 100);
        
        const zoomFactor = Math.exp(-dy * ZOOM_SENSITIVITY);
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
        
        const newPanX = mouseX - canvasX * (newZoom / 100);
        const newPanY = mouseY - canvasY * (newZoom / 100);
        
        onZoomChange(newZoom);
        onPanOffsetChange({ x: newPanX, y: newPanY });
      } else {
        // Паннинг
        onPanOffsetChange({
          x: panOffset.x - dx,
          y: panOffset.y - dy,
        });
      }
    };

    viewport.current.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.current?.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, panOffset, viewportRef, onZoomChange, onPanOffsetChange]);

  return (
    <div
      ref={viewportRef}
      className={`flex-1 overflow-hidden ${colors.bg}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      <div
        className="relative"
        style={{
          minWidth: '100%',
          minHeight: '100%',
        }}
      >
        <div
          className={`relative ${colors.canvas} shadow-2xl rounded-lg overflow-hidden`}
          style={{
            width: 1920,
            height: 1080,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
            border: `1px solid ${isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.15)'}`,
          }}
        >
          {/* Grid Background */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: isDarkMode
                  ? 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
                  : 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {/* Canvas Elements */}
{elements.length === 0 ? (
  <div 
    className="absolute pointer-events-none"
    style={{
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: '480px'
    }}
  >
    <div className="text-center space-y-4">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.2))'
                  }}
                >
                  <Sparkles className="w-10 h-10" style={{ color: '#4D4AFF' }} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
                    Start Creating
                  </h3>
                  <p className={colors.textTertiary}>
                    Select a tool from the toolbar to begin
                  </p>
                </div>

                <div className="flex gap-3 justify-center mt-6 pointer-events-auto">
                  <button
                    onClick={() => onActivateTool('ai')}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                      boxShadow: '0 8px 20px rgba(77, 74, 255, 0.3)'
                    }}
                  >
                    <Wand2 className="w-5 h-5 inline mr-2" />
                    Generate with AI
                  </button>

                  <button
                    onClick={onAddText}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all border hover:bg-slate-100 dark:hover:bg-slate-800`}
                  >
                    <Type className="w-5 h-5 inline mr-2" />
                    Add Text
                  </button>
                </div>
              </div>
            </div>
          ) : (
            elements.map((element) => (
              <CanvasElementComponent
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                isDarkMode={isDarkMode}
                onSelect={onSelectElement}
                onUpdate={onUpdateElement}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default memo(Canvas);