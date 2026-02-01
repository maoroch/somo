import React, { useState, useCallback } from 'react';
import { ImageElement } from '../Types';
import { Upload } from 'lucide-react';

interface ImageToolProps {
  element: ImageElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: ImageElement) => void;
}

export const ImageTool: React.FC<ImageToolProps> = ({
  element,
  isSelected,
  isDarkMode,
  zoom,
  onSelect,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        onUpdate({
          ...element,
          src
        });
      };
      reader.readAsDataURL(file);
    }
  }, [element, onUpdate]);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        handleMouseUp();
        setIsHovered(false);
      }}
    >
      {/* Image Content */}
      {element.src ? (
        <img
          src={element.src}
          alt={element.alt || 'Canvas image'}
          className="w-full h-full rounded-lg"
          style={{
            objectFit: element.fit || 'cover',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
      ) : (
        <div
          className={`w-full h-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-600 hover:border-slate-500' 
              : 'bg-slate-100/50 border-slate-300 hover:border-slate-400'
          }`}
        >
          <Upload className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <div className="text-center">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Upload Image
            </p>
            <label className="mt-2 inline-block cursor-pointer">
              <span className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
                Choose File
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          </div>
        </div>
      )}

      {/* Selection Border */}
      {isSelected && (
        <div
          className="absolute inset-0 border-2 pointer-events-none"
          style={{
            borderColor: '#4D4AFF',
            margin: '-2px',
            borderRadius: '8px'
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

      {/* Replace Image Button (показывается при наведении на заполненное изображение) */}
      {element.src && isHovered && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <label className="cursor-pointer">
            <span className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Replace Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              onClick={(e) => e.stopPropagation()}
            />
          </label>
        </div>
      )}
    </div>
  );
};