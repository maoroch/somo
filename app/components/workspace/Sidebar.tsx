import React, { memo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge: string | null;
  active?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  items: SidebarItem[];
  isDarkMode: boolean;
  showSettingsPopup: boolean;
  onSettingsClick: () => void;
  showProjectsPopup: boolean;
  onProjectsClick: () => void;
  colors: {
    sidebar: string;
    border: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    hover: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  items,
  isDarkMode,
  showSettingsPopup,
  onSettingsClick,
  showProjectsPopup,
  onProjectsClick,
  colors
}) => {
  return (
    <aside 
      className={`${colors.sidebar} ${colors.border} border-r transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <h2 className={`font-bold ${colors.text}`}>Navigation</h2>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg ${colors.hover} transition-all ${
            collapsed ? 'mx-auto' : ''
          }`}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 px-2 space-y-1">
        {items.map((item, i) => {
          // Projects
          if (item.href === '/projects') {
            return (
              <button
                key={i}
                onClick={onProjectsClick}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  showProjectsPopup ? 'text-white' : colors.textSecondary
                } ${!showProjectsPopup && colors.hover}`}
                style={
                  showProjectsPopup
                    ? {
                        background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                        boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
                      }
                    : {}
                }
                title={collapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && (
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

          // Settings
          if (item.href === '/settings') {
            return (
              <button
                key={i}
                onClick={onSettingsClick}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  showSettingsPopup ? 'text-white' : colors.textSecondary
                } ${!showSettingsPopup && colors.hover}`}
                style={
                  showSettingsPopup
                    ? {
                        background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                        boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
                      }
                    : {}
                }
                title={collapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && (
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

          // Все остальные пункты — Link
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                item.active ? 'text-white' : colors.textSecondary
              } ${!item.active && colors.hover}`}
              style={
                item.active
                  ? {
                      background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                      boxShadow: '0 4px 12px rgba(77, 74, 255, 0.3)'
                    }
                  : {}
              }
              title={collapsed ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
              {!collapsed && (
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
      <div className={`p-4 ${colors.border} border-t`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}>
            👩‍🎨
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className={`text-sm font-semibold ${colors.text}`}>Alexandra</p>
              <p className={`text-xs ${colors.textTertiary}`}>Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);