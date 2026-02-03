// FrameTool.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { FrameElement } from '../Types';

interface FrameToolProps {
  element: FrameElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: FrameElement) => void;
  autoOpenPopup?: boolean;
  onOpenPopup?: () => void;
}

export const FrameTool: React.FC<FrameToolProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate,
  autoOpenPopup = false,
  onOpenPopup
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialBounds, setInitialBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Автоматически открываем popup при создании нового элемента
  useEffect(() => {
    if (autoOpenPopup && isSelected && !element.videoUrl && onOpenPopup) {
      console.log('Auto-opening popup for new frame element:', element.id);
      onOpenPopup();
    }
  }, [autoOpenPopup, isSelected, element.videoUrl, onOpenPopup, element.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      e.stopPropagation();
      onSelect(element.id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x * (zoom / 100),
        y: e.clientY - element.y * (zoom / 100)
      });
    }
  }, [element.id, element.x, element.y, onSelect, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const scale = zoom / 100;
    if (isDragging && !isResizing) {
      const newX = (e.clientX - dragStart.x) / scale;
      const newY = (e.clientY - dragStart.y) / scale;
      onUpdate({
        ...element,
        x: newX,
        y: newY
      });
    } else if (isResizing && resizeHandle) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      let newX = initialBounds.x;
      let newY = initialBounds.y;
      let newWidth = initialBounds.width;
      let newHeight = initialBounds.height;

      if (resizeHandle.includes('e')) newWidth += dx;
      if (resizeHandle.includes('w')) {
        newWidth -= dx;
        newX += dx;
      }
      if (resizeHandle.includes('s')) newHeight += dy;
      if (resizeHandle.includes('n')) {
        newHeight -= dy;
        newY += dy;
      }

      if (resizeHandle === 'n' || resizeHandle === 's') {
        newWidth = initialBounds.width;
      }
      if (resizeHandle === 'e' || resizeHandle === 'w') {
        newHeight = initialBounds.height;
      }

      newWidth = Math.max(newWidth, 100);
      newHeight = Math.max(newHeight, 100);

      onUpdate({
        ...element,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, initialBounds, element, onUpdate, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    onSelect(element.id);
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBounds({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    });
  }, [element.id, element.x, element.y, element.width, element.height, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenPopup && !element.videoUrl) {
      onOpenPopup();
    }
  }, [onOpenPopup, element.videoUrl]);

  const backgroundColor = element.backgroundColor || (isDarkMode ? '#1e293b' : '#f1f5f9');
  const borderColor = element.borderColor || (isDarkMode ? '#475569' : '#cbd5e1');

  return (
    <div
      className="absolute group"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity || 1,
        cursor: isDragging || isResizing ? 'grabbing' : 'grab',
        willChange: isDragging || isResizing ? 'transform' : 'auto',
        pointerEvents: element.locked ? 'none' : 'auto',
        display: element.visible === false ? 'none' : 'block'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Frame Content */}
      <div
        className="w-full h-full transition-all relative overflow-hidden"
        style={{
          backgroundColor,
          border: `${element.borderWidth || 2}px solid ${borderColor}`,
          borderRadius: element.borderRadius || 8
        }}
      >
        {element.videoUrl ? (
          <video
            className="w-full h-full object-cover"
            src={element.videoUrl}
            controls
            autoPlay
            loop
            muted
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="text-center p-4">
              <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: '#4D4AFF' }} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                AI Video Frame (Double-click to generate)
              </span>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div
          className="absolute inset-0 border-2 pointer-events-none"
          style={{
            borderColor: '#4D4AFF',
            margin: '-2px'
          }}
        >
          {['nw', 'ne', 'sw', 'se', 'n', 'e', 's', 'w'].map(handle => {
            const isCorner = handle.length === 2;
            const position: React.CSSProperties = {};
            
            if (handle.includes('n')) position.top = -6;
            if (handle.includes('s')) position.bottom = -6;
            if (handle.includes('w')) position.left = -6;
            if (handle.includes('e')) position.right = -6;
            
            if (handle === 'n' || handle === 's') {
              position.left = '50%';
              position.transform = 'translateX(-50%)';
            }
            if (handle === 'w' || handle === 'e') {
              position.top = '50%';
              position.transform = 'translateY(-50%)';
            }

            return (
              <div
                key={handle}
                className={`absolute bg-white border-2 pointer-events-auto hover:scale-125 transition-transform ${
                  isCorner ? 'w-3 h-3 rounded-full' : 'w-2 h-2 rounded-sm'
                }`}
                style={{
                  borderColor: '#4D4AFF',
                  cursor: isCorner 
                    ? (handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize')
                    : (handle === 'n' || handle === 's' ? 'ns-resize' : 'ew-resize'),
                  ...position
                }}
                onMouseDown={(e) => handleResizeStart(e, handle)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};