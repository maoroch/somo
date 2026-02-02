'use client';

import React, { memo, useState, useCallback } from 'react';
import { CanvasElement, Tool } from './Types';

// Props для рендерера
interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: CanvasElement) => void;
}

// Компонент для рендеринга элемента canvas
const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  // Начало перетаскивания
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      onSelect(element.id);
      setIsDragging(true);
      setDragStart({ x: e.clientX - element.x, y: e.clientY - element.y });
      e.stopPropagation();
    }
  }, [element, onSelect]);

  // Перетаскивание
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    onUpdate({
      ...element,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, element, dragStart, onUpdate]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  // Двойной клик для редактирования текста
  const handleDoubleClick = useCallback(() => {
    if (element.type === 'text') setIsEditing(true);
  }, [element.type]);

const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
  if (element.type === 'text') {
    onUpdate({
      ...element,
      content: e.target.value
    });
  }
}, [element, onUpdate]);


  const handleTextBlur = useCallback(() => setIsEditing(false), []);

  // Рендер по типу
  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return isEditing ? (
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
              lineHeight: element.lineHeight,
              textAlign: element.textAlign,
            }}
          />
        ) : (
          <div
            className="w-full h-full p-2 break-words"
            style={{
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
              lineHeight: element.lineHeight,
              textAlign: element.textAlign,
            }}
            onDoubleClick={handleDoubleClick}
          >
            {element.content || 'Double click to edit'}
          </div>
        );

      case 'image':
        return element.src ? (
          <img
            src={element.src}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : null;

      case 'video':
        return element.src ? (
          <video
            src={element.src}
            className="w-full h-full object-cover"
            controls
          />
        ) : null;

      case 'frame':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.backgroundColor,
              borderColor: element.borderColor,
              borderWidth: element.borderWidth,
              borderRadius: element.borderRadius,
              borderStyle: element.borderWidth ? 'solid' : 'none',
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: element.opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Если выбран, показываем рамку */}
      {isSelected && (
        <div
          className="absolute inset-0 border-2 pointer-events-none"
          style={{ borderColor: isDarkMode ? '#4D4AFF' : '#4D4AFF', margin: '-2px' }}
        />
      )}

      {renderContent()}
    </div>
  );
};

export default memo(CanvasElementRenderer);
