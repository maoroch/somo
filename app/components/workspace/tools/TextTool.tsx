import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextElement } from '../Types';

interface TextToolProps {
  element: TextElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: TextElement) => void;
}

export const TextTool: React.FC<TextToolProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !isEditing) {
      e.stopPropagation();
      onSelect(element.id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x * (zoom / 100),
        y: e.clientY - element.y * (zoom / 100)
      });
    }
  }, [element.id, element.x, element.y, isEditing, onSelect, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = (e.clientX - dragStart.x) / (zoom / 100);
      const newY = (e.clientY - dragStart.y) / (zoom / 100);
      onUpdate({
        ...element,
        x: newX,
        y: newY
      });
    }
  }, [isDragging, element, dragStart, onUpdate, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...element,
      content: e.target.value
    });
  }, [element, onUpdate]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (!element.content.trim()) {
      onUpdate({
        ...element,
        content: 'Double click to edit'
      });
    }
  }, [element, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }, []);

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
        cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab',
        willChange: isDragging ? 'transform' : 'auto',
        pointerEvents: element.locked ? 'none' : 'auto',
        display: element.visible === false ? 'none' : 'block'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection Border */}
      {isSelected && !isEditing && (
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
              className="absolute w-3 h-3 bg-white border-2 rounded-full pointer-events-auto cursor-pointer hover:scale-125 transition-transform"
              style={{
                borderColor: '#4D4AFF',
                [corner.includes('n') ? 'top' : 'bottom']: -6,
                [corner.includes('w') ? 'left' : 'right']: -6,
              }}
            />
          ))}
        </div>
      )}

      {/* Text Content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={element.content}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-2 bg-transparent border-none outline-none resize-none"
          style={{
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            color: element.color,
            textAlign: element.textAlign,
            lineHeight: element.lineHeight
          }}
        />
      ) : (
        <div
          className="w-full h-full p-2 break-words overflow-hidden"
          style={{
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            color: element.color,
            textAlign: element.textAlign,
            lineHeight: element.lineHeight
          }}
        >
          {element.content || 'Double click to edit'}
        </div>
      )}
    </div>
  );
};