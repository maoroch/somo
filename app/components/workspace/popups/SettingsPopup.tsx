// components/SettingsPopup.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X, Moon, Sun, Monitor, Globe, Bell, Lock } from 'lucide-react';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function SettingsPopup({
  isOpen,
  onClose,
  isDarkMode,
  onToggleTheme,
}: SettingsPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Закрытие по Esc и клику вне
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Inline styles based on theme
  const bgGradient = isDarkMode 
    ? 'bg-gradient-to-b from-slate-900 to-slate-950' 
    : 'bg-gradient-to-b from-slate-50 to-white';
  
  const border = isDarkMode ? 'border-slate-700/50' : 'border-slate-200/80';
  const text = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textTertiary = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const headerBorder = isDarkMode ? 'border-slate-800/80' : 'border-slate-200/80';
  const footerBg = isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50/60';
  const shadow = isDarkMode ? 'shadow-2xl' : 'shadow-xl';
  
  const buttonBase = isDarkMode 
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
    : 'bg-slate-100 hover:bg-slate-200 text-slate-700';
  
  const activeButton = isDarkMode
    ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-sm'
    : 'bg-indigo-100 border-indigo-300 text-indigo-900 shadow-sm';
  
  const inactiveButton = isDarkMode
    ? 'bg-slate-800/40 hover:bg-slate-700/60 border-transparent'
    : 'bg-slate-100 hover:bg-slate-200 border-transparent';
  
  const newButton = isDarkMode
    ? 'from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600'
    : 'from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className={`
          relative w-full max-w-md mx-4 sm:mx-6 
          rounded-2xl overflow-hidden
          border ${border}
          ${bgGradient}
          ${shadow}
          animate-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${headerBorder}`}>
          <h2 className={`text-lg font-semibold ${text}`}>Settings</h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-200'} text-slate-400 hover:${textSecondary}`}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 space-y-6 ${textSecondary}`}>
          {/* Theme */}
          <div className="space-y-3">
            <div className={`flex items-center gap-2 text-sm font-medium ${text}`}>
              <Monitor size={18} />
              <span>Appearance</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Light', icon: Sun, value: false },
                { label: 'Dark', icon: Moon, value: true },
                { label: 'System', icon: Monitor, value: null as any },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.value !== null && item.value !== isDarkMode) {
                      onToggleTheme();
                    }
                  }}
                  className={`
                    flex flex-col items-center gap-2 py-3 px-4 rounded-xl text-sm border
                    transition-all duration-200
                    ${item.value === isDarkMode ? activeButton : inactiveButton}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Другие секции */}
          <div className={`space-y-4 pt-2 border-t ${headerBorder}`}>
            <SettingRow 
              icon={Globe} 
              label="Language" 
              value="English" 
              isDarkMode={isDarkMode}
            />
            <SettingRow 
              icon={Bell} 
              label="Notifications" 
              value="Enabled" 
              isDarkMode={isDarkMode}
            />
            <SettingRow 
              icon={Lock} 
              label="Privacy" 
              value="Public profile" 
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${headerBorder} ${footerBg} flex justify-end gap-3`}>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-lg ${buttonBase} transition-colors`}
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${newButton} text-white font-medium transition-all shadow-sm hover:shadow-md`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Вспомогательный компонент
function SettingRow({
  icon: Icon,
  label,
  value,
  isDarkMode,
}: {
  icon: any;
  label: string;
  value: string;
  isDarkMode: boolean;
}) {
  const textTertiary = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  
  return (
    <div className={`flex items-center justify-between py-1.5 ${textTertiary}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} className={textSecondary} />
        <span>{label}</span>
      </div>
      <span className="text-sm">{value}</span>
    </div>
  );
}