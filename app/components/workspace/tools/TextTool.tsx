import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextElement } from '../Types';

interface TextToolProps {
  element: TextElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: TextElement) => void;
  elementId?: string;
}

export const TextTool: React.FC<TextToolProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate,
  elementId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ АВТОМАТИЧЕСКИ ВХОДИМ В РЕДАКТИРОВАНИЕ ЕСЛИ ТОЛЬКО ЧТО СОЗДАН
  useEffect(() => {
    if (isSelected && isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing, isSelected]);

  // ✅ АВТО-РАЗМЕР TEXTAREA ПРИ ВВОДЕ
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      onUpdate({
        ...element,
        height: textarea.scrollHeight,
      });
    }
  }, [element, onUpdate]);

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [isEditing, adjustTextareaHeight]);

  // ✅ ОБРАБОТЧИК ДВОЙНОГО КЛИКА ДЛЯ РЕДАКТИРОВАНИЯ
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  // ✅ ОБРАБОТЧИК MOUSE DOWN ДЛЯ ПЕРЕМЕЩЕНИЯ
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Если в режиме редактирования - пропускаем
    if (isEditing) return;

    if (e.button === 0) {
      e.stopPropagation();
      onSelect(element.id);
      
      // Только если не в режиме редактирования, начинаем тащить
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x * (zoom / 100),
        y: e.clientY - element.y * (zoom / 100)
      });
    }
  }, [element.id, element.x, element.y, isEditing, onSelect, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const scale = zoom / 100;
    if (isDragging && !isEditing) {
      const newX = (e.clientX - dragStart.x) / scale;
      const newY = (e.clientY - dragStart.y) / scale;
      onUpdate({
        ...element,
        x: newX,
        y: newY
      });
    } else if (isResizing && resizeDirection) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = initialPos.x;
      let newY = initialPos.y;

      if (resizeDirection.includes('e')) newWidth += dx;
      if (resizeDirection.includes('w')) {
        newWidth -= dx;
        newX += dx;
      }
      if (resizeDirection.includes('s')) newHeight += dy;
      if (resizeDirection.includes('n')) {
        newHeight -= dy;
        newY += dy;
      }

      // Минимальный размер
      newWidth = Math.max(newWidth, 50);
      newHeight = Math.max(newHeight, 20);

      onUpdate({
        ...element,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, resizeDirection, dragStart, initialSize, initialPos, element, onUpdate, zoom, isEditing]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  // ✅ ОБРАБОТЧИК ДЛЯ НАЧАЛА РЕСАЙЗА
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    onSelect(element.id);
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: element.width, height: element.height });
    setInitialPos({ x: element.x, y: element.y });
  }, [element.id, element.width, element.height, element.x, element.y, onSelect]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...element,
      content: e.target.value
    });
    adjustTextareaHeight();
  }, [element, onUpdate, adjustTextareaHeight]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (!element.content.trim()) {
      onUpdate({
        ...element,
        content: ''
      });
    }
  }, [element, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      data-element-id={elementId || element.id}
      className="absolute group"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        cursor: isDragging || isResizing ? 'grabbing' : isEditing ? 'text' : 'grab',
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
              className="absolute w-3 h-3 bg-white border-2 rounded-full pointer-events-auto cursor-nwse-resize hover:scale-125 transition-transform"
              style={{
                borderColor: '#4D4AFF',
                cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize',
                [corner.includes('n') ? 'top' : 'bottom']: -6,
                [corner.includes('w') ? 'left' : 'right']: -6,
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, corner)}
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
          className="w-full min-h-full p-2 bg-transparent border-none outline-none resize-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
          style={{
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            color: element.color,
            textAlign: element.textAlign,
            lineHeight: element.lineHeight
          }}
          autoFocus
        />
      ) : (
        <div
          className="w-full h-full p-2 break-words overflow-hidden whitespace-pre-wrap"
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