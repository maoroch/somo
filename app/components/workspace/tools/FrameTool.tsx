import React, { useState, useCallback } from 'react';
import { FrameElement } from '../Types';

interface FrameToolProps {
  element: FrameElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: FrameElement) => void;
}

export const FrameTool: React.FC<FrameToolProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialBounds, setInitialBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

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
    if (isDragging && !isResizing) {
      const newX = (e.clientX - dragStart.x) / (zoom / 100);
      const newY = (e.clientY - dragStart.y) / (zoom / 100);
      onUpdate({
        ...element,
        x: newX,
        y: newY
      });
    }
  }, [isDragging, isResizing, element, dragStart, onUpdate, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBounds({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    });
  }, [element]);

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
        opacity: element.opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        willChange: isDragging ? 'transform' : 'auto',
        pointerEvents: element.locked ? 'none' : 'auto',
        display: element.visible === false ? 'none' : 'block'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Frame Content */}
      <div
        className="w-full h-full transition-all"
        style={{
          backgroundColor,
          border: `${element.borderWidth || 2}px solid ${borderColor}`,
          borderRadius: element.borderRadius || 8
        }}
      >
        {/* Frame Label (показывается при наведении) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Frame
          </span>
        </div>
      </div>

      {/* Selection Border */}
      {isSelected && (
        <div
          className="absolute inset-0 border-2 pointer-events-none"
          style={{
            borderColor: '#4D4AFF',
            margin: '-2px'
          }}
        >
          {/* Resize Handles */}
          {['nw', 'ne', 'sw', 'se', 'n', 'e', 's', 'w'].map(handle => {
            const isCorner = handle.length === 2;
            const position: React.CSSProperties = {};
            
            if (handle.includes('n')) position.top = -6;
            if (handle.includes('s')) position.bottom = -6;
            if (handle.includes('w')) position.left = -6;
            if (handle.includes('e')) position.right = -6;
            
            // Центрируем edge handles
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
                  cursor: `${handle}-resize`,
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