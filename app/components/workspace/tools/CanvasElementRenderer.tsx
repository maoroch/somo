import React, { memo } from 'react';
import { CanvasElement } from '../Types';
import { TextTool } from './TextTool';
import { FrameTool } from './FrameTool';
import { ImageTool } from './ImageTool';
import { VideoTool } from './VideoTool';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: CanvasElement) => void;
}

const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate
}) => {
  switch (element.type) {
    case 'text':
      return (
        <TextTool
          element={element}
          isSelected={isSelected}
          isDarkMode={isDarkMode}
          zoom={zoom}
          onSelect={onSelect}
          onUpdate={onUpdate}
        />
      );
    
    case 'frame':
      return (
        <FrameTool
          element={element}
          isSelected={isSelected}
          isDarkMode={isDarkMode}
          zoom={zoom}
          onSelect={onSelect}
          onUpdate={onUpdate}
        />
      );
    
    case 'image':
      return (
        <ImageTool
          element={element}
          isSelected={isSelected}
          isDarkMode={isDarkMode}
          zoom={zoom}
          onSelect={onSelect}
          onUpdate={onUpdate}
        />
      );
    
    case 'video':
      return (
        <VideoTool
          element={element}
          isSelected={isSelected}
          isDarkMode={isDarkMode}
          zoom={zoom}
          onSelect={onSelect}
          onUpdate={onUpdate}
        />
      );
    
    default:
      return null;
  }
};

// Мемоизация для оптимизации
export default memo(CanvasElementRenderer, (prevProps, nextProps) => {
  const prev = prevProps.element;
  const next = nextProps.element;
  
  return (
    prev.id === next.id &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.rotation === next.rotation &&
    prev.opacity === next.opacity &&
    prev.locked === next.locked &&
    prev.visible === next.visible &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDarkMode === nextProps.isDarkMode &&
    prevProps.zoom === nextProps.zoom &&
    // Для текста проверяем content
    (prev.type !== 'text' || prev.content === (next as any).content) &&
    // Для изображения/видео проверяем src
    (prev.type !== 'image' && prev.type !== 'video' || prev.src === (next as any).src) &&
    // Для фрейма проверяем backgroundColor
    (prev.type !== 'frame' || prev.backgroundColor === (next as any).backgroundColor)
  );
});