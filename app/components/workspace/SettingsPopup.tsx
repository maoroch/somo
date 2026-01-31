// components/SettingsPopup.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X, Moon, Sun, Monitor, Globe, Bell, Lock, LogOut } from 'lucide-react';

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

  // Закрытие по клику вне окна / по Esc
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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
    >
      <div
        className={`
          relative w-full max-w-md mx-4 sm:mx-6 
          rounded-2xl shadow-2xl overflow-hidden
          border border-slate-700/50
          bg-gradient-to-b from-slate-900 to-slate-950
          animate-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-300">
          {/* Theme */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
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
                    if (item.value !== null) {
                      // Здесь можно добавить логику system preference
                      // пока просто переключаем dark/light
                      onToggleTheme();
                    }
                  }}
                  className={`
                    flex flex-col items-center gap-2 py-3 px-4 rounded-xl text-sm
                    transition-all duration-200
                    ${
                      (item.value === isDarkMode) ||
                      (item.value === null && !isDarkMode && !isDarkMode) // можно улучшить
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm'
                        : 'bg-slate-800/40 hover:bg-slate-700/60 border border-transparent'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Другие секции (можно расширять) */}
          <div className="space-y-4 pt-2 border-t border-slate-800/60">
            <SettingRow icon={Globe} label="Language" value="English" />
            <SettingRow icon={Bell} label="Notifications" value="Enabled" />
            <SettingRow icon={Lock} label="Privacy" value="Public profile" />
          </div>
        </div>


      </div>
    </div>
  );
}

// Вспомогательный компонент для строк настроек
function SettingRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-slate-400" />
        <span>{label}</span>
      </div>
      <span className="text-slate-400 text-sm">{value}</span>
    </div>
  );
}