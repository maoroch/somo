import React, { memo } from 'react';
import { Undo, Redo, ZoomIn, ZoomOut, Grid3x3 } from 'lucide-react';

interface CanvasToolbarProps {
  zoom: number;
  showGrid: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  colors: {
    navbar: string;
    border: string;
    bg: string;
    textSecondary: string;
    hover: string;
  };
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  zoom,
  showGrid,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  colors
}) => {
  return (
    <div className={`${colors.navbar} ${colors.border} border-b px-4 py-2.5 flex items-center justify-between`}>
      {/* Left - History */}
      <div className="flex items-center gap-2">
        <button className={`p-2 rounded-lg ${colors.textSecondary} ${colors.hover} transition-all`} title="Undo">
          <Undo className="w-4 h-4" />
        </button>
        <button className={`p-2 rounded-lg ${colors.textSecondary} ${colors.hover} transition-all`} title="Redo">
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Center - Zoom Controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onZoomOut}
          className={`p-2 rounded-lg ${colors.textSecondary} ${colors.hover} transition-all`}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <button
          onClick={onResetZoom}
          className={`px-3 py-1.5 rounded-lg ${colors.bg} ${colors.border} border text-sm font-medium ${colors.hover} transition-all min-w-[60px]`}
        >
          {Math.round(zoom)}%
        </button>
        
        <button 
          onClick={onZoomIn}
          className={`p-2 rounded-lg ${colors.textSecondary} ${colors.hover} transition-all`}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className={`h-4 w-px ${colors.border} mx-2`}></div>

        <button 
          onClick={onToggleGrid}
          className={`p-2 rounded-lg transition-all ${
            showGrid ? 'text-blue-500 bg-blue-500/10' : colors.textSecondary
          } ${!showGrid && colors.hover}`}
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default memo(CanvasToolbar);