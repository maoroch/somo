import React, { memo } from 'react';

interface ToolButtonProps {
  tool: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  };
  isActive: boolean;
  onClick: () => void;
  colors: {
    textSecondary: string;
    hover: string;
    bg: string;
    border: string;
  };
}

const ToolButton: React.FC<ToolButtonProps> = ({ tool, isActive, onClick, colors }) => {
  const Icon = tool.icon;
  
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg transition-all ${
        isActive ? 'text-white' : colors.textSecondary
      } ${!isActive ? colors.hover : ''} group relative`}
      style={
        isActive
          ? {
              background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
              boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
            }
          : {}
      }
      title={tool.label}
    >
      <Icon className="w-5 h-5" />
      <span
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded 
                   text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                   transition-opacity pointer-events-none 
                   ${colors.bg} ${colors.border} border`}
      >
        {tool.label}
      </span>
    </button>
  );
};

export default memo(ToolButton);