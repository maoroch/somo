'use client';
import Link from 'next/link';
import SettingsPopup from '@/app/components/workspace/SettingsPopup';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home,
  Video,
  FolderOpen,
  Settings,
  User,
  Moon,
  Sun,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Type,
  Image as ImageIcon,
  Wand2,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  MousePointer,
  Square,
  Undo,
  Redo
} from 'lucide-react';
import { getInitialTheme, saveTheme, type Theme } from '@/lib/theme-utils';

// Типы
type Tool = 'select' | 'text' | 'image' | 'shape' | 'ai';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  rotation?: number;
  opacity?: number;
}

// Компонент для отдельного элемента на canvas
interface CanvasElementComponentProps {
  element: CanvasElement;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: () => void;
  onUpdate: (element: CanvasElement) => void;
}

const CanvasElementComponent: React.FC<CanvasElementComponentProps> = ({
  element,
  isSelected,
  isDarkMode,
  onSelect,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      onSelect();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x,
        y: e.clientY - element.y
      });
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      onUpdate({
        ...element,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (element.type === 'text') {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...element,
      content: e.target.value
    });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  return (
    <div
      className="absolute group"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: element.opacity,
        transform: `rotate(${element.rotation || 0}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection Border */}
      {isSelected && (
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
              className="absolute w-3 h-3 bg-white border-2 rounded-full"
              style={{
                borderColor: '#4D4AFF',
                [corner.includes('n') ? 'top' : 'bottom']: -6,
                [corner.includes('w') ? 'left' : 'right']: -6,
                cursor: `${corner}-resize`
              }}
            />
          ))}
        </div>
      )}

      {/* Element Content */}
      {element.type === 'text' && (
        isEditing ? (
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
            }}
          />
        ) : (
          <div
            className="w-full h-full p-2 break-words"
            style={{
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
            }}
          >
            {element.content || 'Double click to edit'}
          </div>
        )
      )}

      {element.type === 'shape' && (
        <div
          className="w-full h-full rounded"
          style={{
            backgroundColor: element.color,
          }}
        />
      )}

      {element.type === 'image' && element.src && (
        <img
          src={element.src}
          alt="Canvas element"
          className="w-full h-full object-cover rounded"
          draggable={false}
        />
      )}

      {element.type === 'video' && element.src && (
        <video
          src={element.src}
          className="w-full h-full object-cover rounded"
          controls
        />
      )}
    </div>
  );
};


export default function WorkspacePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
const [showSettingsPopup, setShowSettingsPopup] = useState(false);

// Инициализация темы
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    saveTheme(newTheme);
  };

  // Цветовые схемы
  const colors = {
    dark: {
      bg: 'bg-slate-950',
      sidebar: 'bg-slate-900',
      navbar: 'bg-slate-900',
      canvas: 'bg-slate-800',
      border: 'border-slate-700',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      hover: 'hover:bg-slate-800',
      active: 'bg-slate-800',
    },
    light: {
      bg: 'bg-slate-50',
      sidebar: 'bg-white',
      navbar: 'bg-white',
      canvas: 'bg-white',
      border: 'border-slate-200',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-600',
      hover: 'hover:bg-slate-100',
      active: 'bg-slate-100',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  const sidebarItems = [
    { icon: Home, label: 'Home', href: '/', badge: null },
    { icon: Video, label: 'My Videos', href: '/videos', badge: '12' },
    { icon: FolderOpen, label: 'Projects', href: '/projects', badge: null },
    { icon: Sparkles, label: 'AI Studio', href: '/workspace', badge: 'NEW', active: true },
    { icon: User, label: 'Profile', href: '/profile', badge: null },
    { icon: Settings, label: 'Settings', href: '/settings', badge: null },
  ];

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
    { id: 'shape', icon: Square, label: 'Shape' },
    { id: 'ai', icon: Wand2, label: 'AI Generate' },
  ];

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 25));
  const handleResetZoom = () => setZoom(100);

  // Добавление нового элемента на canvas
  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 300,
      height: type === 'text' ? 50 : 200,
      ...(type === 'text' && {
        content: 'Double click to edit',
        fontSize: 24,
        fontFamily: 'Inter',
        color: isDarkMode ? '#ffffff' : '#000000'
      }),
      ...(type === 'shape' && {
        color: '#4D4AFF'
      }),
      rotation: 0,
      opacity: 1
    };
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElement(newElement.id);
  };

  // Обработка клика по инструменту "Add Text"
  const handleAddText = () => {
    addElement('text');
    setActiveTool('select');
  };

  // Обработка клика по инструменту "Add Shape"
  const handleAddShape = () => {
    addElement('shape');
    setActiveTool('select');
  };

  // Pan функционал
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.metaKey) || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Удаление выбранного элемента
  const deleteSelectedElement = () => {
    if (selectedElement) {
      setCanvasElements(canvasElements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          deleteSelectedElement();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, canvasElements]);

  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${currentColors.bg}`}></div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${currentColors.bg} ${currentColors.text} overflow-hidden transition-colors duration-300`}>
      {/* Top Navbar */}
      <nav className={`${currentColors.navbar} ${currentColors.border} border-b px-4 py-3 flex items-center justify-between z-40 transition-colors duration-300`}>
        {/* Left Section - Logo & Project Name */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Somo Logo"
              width={70}
              height={30}
              className="object-contain"
            />
          </Link>
          
          <div className={`h-6 w-px ${currentColors.border}`}></div>
          
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              defaultValue="Untitled Project"
              className={`px-3 py-1.5 rounded-lg ${currentColors.bg} ${currentColors.border} border ${currentColors.text} text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
          </div>
        </div>

        {/* Center Section - Main Tools */}
{/* Center Section - Main Tools */}
<div className="flex items-center gap-2">
  {tools.map((tool) => (
    <button
      key={tool.id}
      onClick={() => {
        if (tool.id === 'settings') {
          setShowSettingsPopup(true);
          // setActiveTool('select'); // по желанию
        } else {
          setActiveTool(tool.id as Tool);
        }
      }}
      className={`p-2.5 rounded-lg transition-all ${
        (activeTool === tool.id) || (tool.id === 'settings' && showSettingsPopup)
          ? 'text-white'
          : currentColors.textSecondary
      } ${
        !((activeTool === tool.id) || (tool.id === 'settings' && showSettingsPopup))
          ? currentColors.hover
          : ''
      } group relative`}
      style={
        (activeTool === tool.id) || (tool.id === 'settings' && showSettingsPopup)
          ? {
              background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
              boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
            }
          : {}
      }
      title={tool.label}
    >
      <tool.icon className="w-5 h-5" />
      <span
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded 
                   text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                   transition-opacity pointer-events-none 
                   ${currentColors.bg} ${currentColors.border} border`}
      >
        {tool.label}
      </span>
    </button>
  ))}
</div>
        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          
          <div className={`h-6 w-px ${currentColors.border} mx-2`}></div>

          <div className={`h-6 w-px ${currentColors.border} mx-2`}></div>

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

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside 
          className={`${currentColors.sidebar} ${currentColors.border} border-r transition-all duration-300 flex flex-col ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className={`font-bold ${currentColors.text}`}>Navigation</h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1.5 rounded-lg ${currentColors.hover} transition-all ${
                sidebarCollapsed ? 'mx-auto' : ''
              }`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Sidebar Items */}
<nav className="flex-1 px-2 space-y-1">
  {sidebarItems.map((item, i) => {
    // Специальная обработка для Settings
    if (item.href === '/settings') {
      return (
        <button
          key={i}
          onClick={() => setShowSettingsPopup(true)}
          className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
            showSettingsPopup
              ? 'text-white'
              : currentColors.textSecondary
          } ${!showSettingsPopup && currentColors.hover}`}
          style={
            showSettingsPopup
              ? {
                  background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                  boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
                }
              : {}
          }
          title={sidebarCollapsed ? item.label : ''}
        >
          <item.icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    item.badge === 'NEW'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : isDarkMode
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </button>
      );
    }

    // Все остальные пункты остаются как Link
    return (
      <Link
        key={i}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
          item.active
            ? 'text-white'
            : currentColors.textSecondary
        } ${!item.active && currentColors.hover}`}
        style={
          item.active
            ? {
                background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
              }
            : {}
        }
        title={sidebarCollapsed ? item.label : ''}
      >
        <item.icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 font-medium">{item.label}</span>
            {item.badge && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  item.badge === 'NEW'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : isDarkMode
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  })}
</nav>

          {/* Sidebar Footer */}
          <div className={`p-4 ${currentColors.border} border-t`}>
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}>
                👩‍🎨
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${currentColors.text}`}>Alexandra</p>
                  <p className={`text-xs ${currentColors.textTertiary}`}>Pro Plan</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className={`${currentColors.navbar} ${currentColors.border} border-b px-4 py-2.5 flex items-center justify-between`}>
            {/* Left - History */}
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-lg ${currentColors.textSecondary} ${currentColors.hover} transition-all`} title="Undo">
                <Undo className="w-4 h-4" />
              </button>
              <button className={`p-2 rounded-lg ${currentColors.textSecondary} ${currentColors.hover} transition-all`} title="Redo">
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Center - Zoom Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleZoomOut}
                className={`p-2 rounded-lg ${currentColors.textSecondary} ${currentColors.hover} transition-all`}
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleResetZoom}
                className={`px-3 py-1.5 rounded-lg ${currentColors.bg} ${currentColors.border} border text-sm font-medium ${currentColors.hover} transition-all min-w-[60px]`}
              >
                {zoom}%
              </button>
              
              <button 
                onClick={handleZoomIn}
                className={`p-2 rounded-lg ${currentColors.textSecondary} ${currentColors.hover} transition-all`}
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className={`h-4 w-px ${currentColors.border} mx-2`}></div>

              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-all ${
                  showGrid ? 'text-blue-500 bg-blue-500/10' : currentColors.textSecondary
                } ${!showGrid && currentColors.hover}`}
                title="Toggle Grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>


          </div>

          {/* Canvas Container */}
{/* Canvas Container */}
<div
  ref={viewportRef}
  className={`flex-1 overflow-auto ${currentColors.bg}`}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
  onWheel={(e) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? -5 : 5;
      setZoom((prev) => Math.max(25, Math.min(200, prev + delta)));
    } else {
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }}
  style={{ cursor: isPanning ? 'grabbing' : 'default' }}
>
  <div
    className="relative"
    style={{
      minWidth: '100%',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px'
    }}
  >
    <div
      ref={canvasRef}
      className={`relative ${currentColors.canvas} shadow-2xl rounded-lg overflow-hidden`}
      style={{
        width: 1920,
        height: 1080,
        transform: `scale(${zoom / 100}) translate(${panOffset.x / (zoom / 100)}px, ${panOffset.y / (zoom / 100)}px)`,
        transformOrigin: 'center center',
        transition: isPanning ? 'none' : 'transform 0.08s ease-out',
        border: `1px solid ${isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.15)'}`,
      }}
    >
      {/* Grid Background */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDarkMode
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Canvas Elements */}
      {canvasElements.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.2))'
              }}
            >
              <Sparkles className="w-10 h-10" style={{ color: '#4D4AFF' }} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${currentColors.text} mb-2`}>
                Start Creating
              </h3>
              <p className={currentColors.textTertiary}>
                Select a tool from the toolbar to begin
              </p>
            </div>

            <div className="flex gap-3 justify-center mt-6 pointer-events-auto">
              <button
                onClick={() => setActiveTool('ai')}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                  boxShadow: '0 8px 20px rgba(77, 74, 255, 0.3)'
                }}
              >
                <Wand2 className="w-5 h-5 inline mr-2" />
                Generate with AI
              </button>

              <button
                onClick={handleAddText}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentColors.border} border ${currentColors.hover}`}
              >
                <Type className="w-5 h-5 inline mr-2" />
                Add Text
              </button>
            </div>
          </div>
        </div>
      ) : (
        canvasElements.map((element) => (
          <CanvasElementComponent
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            isDarkMode={isDarkMode}
            onSelect={() => setSelectedElement(element.id)}
            onUpdate={(updatedElement) => {
              setCanvasElements(
                canvasElements.map((el) =>
                  el.id === element.id ? updatedElement : el
                )
              );
            }}
          />
        ))
      )}
    </div>
  </div>
</div>
        </div>
      </div>

      

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#475569' : '#cbd5e1'};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#64748b' : '#94a3b8'};
        }
      `}</style>
      <SettingsPopup
  isOpen={showSettingsPopup}
  onClose={() => setShowSettingsPopup(false)}
  isDarkMode={isDarkMode}
  onToggleTheme={toggleTheme}
/>
    </div>
    
  );
  
}