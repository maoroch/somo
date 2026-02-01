import React, { useState, useCallback, useRef } from 'react';
import { VideoElement } from '../Types';
import { Upload, Play, Pause } from 'lucide-react';

interface VideoToolProps {
  element: VideoElement;
  isSelected: boolean;
  isDarkMode: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onUpdate: (element: VideoElement) => void;
}

export const VideoTool: React.FC<VideoToolProps> = ({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      onUpdate({
        ...element,
        src: url
      });
    }
  }, [element, onUpdate]);

  const togglePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

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
      {/* Video Content */}
      {element.src ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={element.src}
            className="w-full h-full rounded-lg object-cover"
            autoPlay={element.autoPlay}
            loop={element.loop}
            muted={element.muted}
            style={{
              userSelect: 'none',
              pointerEvents: 'none'
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Play/Pause Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={togglePlayPause}
                className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
          )}
        </div>
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
              Upload Video
            </p>
            <label className="mt-2 inline-block cursor-pointer">
              <span className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all">
                Choose File
              </span>
              <input
                type="file"
                accept="video/*"
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
    </div>
  );
};