import React, { useState, memo, useCallback } from 'react';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  rotation?: number;
  opacity?: number;
}

interface CanvasElementComponentProps {
  element: CanvasElement;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: (id: string) => void;
  onUpdate: (element: CanvasElement) => void;
}

const CanvasElementComponent: React.FC<CanvasElementComponentProps> = ({
  element,
  isSelected,
  isDarkMode,
  onSelect,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      onSelect(element.id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x,
        y: e.clientY - element.y
      });
      e.stopPropagation();
    }
  }, [element.id, element.x, element.y, onSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      onUpdate({
        ...element,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, element, dragStart, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (element.type === 'text') {
      setIsEditing(true);
    }
  }, [element.type]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...element,
      content: e.target.value
    });
  }, [element, onUpdate]);

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <div
      className="absolute group"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: element.opacity,
        transform: `rotate(${element.rotation || 0}deg)`,
        willChange: isDragging ? 'transform' : 'auto'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
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
          {['nw', 'ne', 'sw', 'se'].map(corner => (
            <div
              key={corner}
              className="absolute w-3 h-3 bg-white border-2 rounded-full"
              style={{
                borderColor: '#4D4AFF',
                [corner.includes('n') ? 'top' : 'bottom']: -6,
                [corner.includes('w') ? 'left' : 'right']: -6,
                cursor: `${corner}-resize`
              }}
            />
          ))}
        </div>
      )}

      {/* Element Content */}
      {element.type === 'text' && (
        isEditing ? (
          <textarea
            autoFocus
            value={element.content}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            className="w-full h-full p-2 bg-transparent border-none outline-none resize-none"
            style={{
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
            }}
          />
        ) : (
          <div
            className="w-full h-full p-2 break-words"
            style={{
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
            }}
          >
            {element.content || 'Double click to edit'}
          </div>
        )
      )}

      {element.type === 'shape' && (
        <div
          className="w-full h-full rounded"
          style={{
            backgroundColor: element.color,
          }}
        />
      )}

      {element.type === 'image' && element.src && (
        <img
          src={element.src}
          alt="Canvas element"
          className="w-full h-full object-cover rounded"
          draggable={false}
        />
      )}

      {element.type === 'video' && element.src && (
        <video
          src={element.src}
          className="w-full h-full object-cover rounded"
          controls
        />
      )}
    </div>
  );
};

// Мемоизация компонента для предотвращения лишних ререндеров
export default memo(CanvasElementComponent, (prevProps, nextProps) => {
  return (
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.x === nextProps.element.x &&
    prevProps.element.y === nextProps.element.y &&
    prevProps.element.width === nextProps.element.width &&
    prevProps.element.height === nextProps.element.height &&
    prevProps.element.content === nextProps.element.content &&
    prevProps.element.color === nextProps.element.color &&
    prevProps.element.rotation === nextProps.element.rotation &&
    prevProps.element.opacity === nextProps.element.opacity &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDarkMode === nextProps.isDarkMode
  );
});