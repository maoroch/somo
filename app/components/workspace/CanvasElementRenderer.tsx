// CanvasElementRenderer.tsx
'use client';

import React, { memo } from 'react';
import { CanvasElement, FrameElement, TextElement, ImageElement, VideoElement } from './Types';
import { FrameTool } from './tools/FrameTool';
import { TextTool } from './tools/TextTool';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: CanvasElement) => void;
  elementId?: string;
  autoOpenPopup?: boolean;
  onOpenPopup?: () => void;
}

const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate,
  elementId,
  autoOpenPopup = false,
  onOpenPopup
}) => {
  switch (element.type) {
    case 'frame':
      return (
    <FrameTool
      element={element as FrameElement}
      isSelected={isSelected}
      isDarkMode={isDarkMode}
      zoom={zoom}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onOpenPopup={onOpenPopup}
    />

      );
    
    case 'text':
      return (
        <TextTool
          element={element as TextElement}
          isSelected={isSelected}
          isDarkMode={isDarkMode}
          zoom={zoom}
          onSelect={onSelect}
          onUpdate={onUpdate}
          elementId={elementId}
        />
      );
    
    case 'image':
      return (
        <div
          className="absolute"
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `rotate(${element.rotation || 0}deg)`,
            opacity: element.opacity || 1,
            cursor: 'grab',
            userSelect: 'none',
            display: element.visible === false ? 'none' : 'block'
          }}
          onMouseDown={(e) => {
            if (e.button === 0) {
              onSelect(element.id);
              e.stopPropagation();
            }
          }}
        >
          {element.src ? (
            <img
              src={element.src}
              alt={element.alt || ''}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-500 dark:text-gray-400">No image</span>
            </div>
          )}
          
          {isSelected && (
            <div
              className="absolute inset-0 border-2 pointer-events-none"
              style={{ 
                borderColor: '#4D4AFF', 
                margin: '-2px' 
              }}
            />
          )}
        </div>
      );
    
    case 'video':
      return (
        <div
          className="absolute"
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `rotate(${element.rotation || 0}deg)`,
            opacity: element.opacity || 1,
            cursor: 'grab',
            userSelect: 'none',
            display: element.visible === false ? 'none' : 'block'
          }}
          onMouseDown={(e) => {
            if (e.button === 0) {
              onSelect(element.id);
              e.stopPropagation();
            }
          }}
        >
          {element.src ? (
            <video
              src={element.src}
              className="w-full h-full object-cover"
              controls
              autoPlay={element.autoPlay || false}
              loop={element.loop || false}
              muted={element.muted || false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-500 dark:text-gray-400">No video</span>
            </div>
          )}
          
          {isSelected && (
            <div
              className="absolute inset-0 border-2 pointer-events-none"
              style={{ 
                borderColor: '#4D4AFF', 
                margin: '-2px' 
              }}
            />
          )}
        </div>
      );
    
    default:
      return null;
  }
};

export default memo(CanvasElementRenderer);