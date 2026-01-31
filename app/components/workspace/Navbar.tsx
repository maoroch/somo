import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { Tool } from './Types';
import ToolButton from './ToolButton';

interface NavbarProps {
  isDarkMode: boolean;
  activeTool: Tool;
  showSettingsPopup: boolean;
  onToolChange: (tool: Tool) => void;
  onSettingsClick: () => void;
  colors: {
    navbar: string;
    border: string;
    bg: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
  tools: Array<{
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }>;
}

const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  activeTool,
  showSettingsPopup,
  onToolChange,
  onSettingsClick,
  colors,
  tools
}) => {
  return (
    <nav className={`${colors.navbar} ${colors.border} border-b px-4 py-3 flex items-center justify-between z-40 transition-colors duration-300`}>
      {/* Left Section - Logo & Project Name */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
            alt="Somo Logo"
            width={70}
            height={30}
            style={{ height: 'auto' }}
            className="object-contain"
          />
        </Link>
        
        <div className={`h-6 w-px ${colors.border}`}></div>
        
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            defaultValue="Untitled Project"
            className={`px-3 py-1.5 rounded-lg ${colors.bg} ${colors.border} border ${colors.text} text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          />
        </div>
      </div>

      {/* Center Section - Main Tools */}
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id || (tool.id === 'settings' && showSettingsPopup)}
            onClick={() => {
              if (tool.id === 'settings') {
                onSettingsClick();
              } else {
                onToolChange(tool.id as Tool);
              }
            }}
            colors={colors}
          />
        ))}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <div className={`h-6 w-px ${colors.border} mx-2`}></div>
        <div className={`h-6 w-px ${colors.border} mx-2`}></div>

        <button 
          className="px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
            boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
          }}
        >
          <Share2 className="w-4 h-4 inline mr-2" />
          Export
        </button>
      </div>
    </nav>
  );
};

export default memo(Navbar);