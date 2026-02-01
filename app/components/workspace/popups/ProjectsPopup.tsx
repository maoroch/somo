// components/ProjectsPopup.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X, FolderOpen, Clock, Star, Users, Trash2 } from 'lucide-react';

interface ProjectsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;           // ← добавлено
}

export default function ProjectsPopup({
  isOpen,
  onClose,
  isDarkMode,
}: ProjectsPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Цвета в зависимости от темы (аналогично остальному приложению)
  const colors = {
    dark: {
      bg: 'bg-gradient-to-b from-slate-900 to-slate-950',
      border: 'border-slate-700/50',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      card: 'bg-slate-800/40 hover:bg-slate-700/60',
      button: 'bg-slate-800 hover:bg-slate-700 text-slate-300',
      newButton: 'from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400',
      shadow: 'shadow-2xl',
    },
    light: {
      bg: 'bg-gradient-to-b from-slate-50 to-white',
      border: 'border-slate-200/80',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-500',
      card: 'bg-white/80 hover:bg-slate-50/90 shadow-sm',
      button: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
      newButton: 'from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500',
      shadow: 'shadow-xl',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

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

  // Мок-данные проектов
  const mockProjects = [
    { id: 1, name: 'Promo Video 2025', updated: '2 hours ago', starred: true, collaborators: 3 },
    { id: 2, name: 'Social Media Reel', updated: 'Yesterday', starred: false, collaborators: 1 },
    { id: 3, name: 'Product Launch Teaser', updated: '3 days ago', starred: true, collaborators: 4 },
    { id: 4, name: 'Old Draft Project', updated: '1 week ago', starred: false, collaborators: 0 },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className={`
          relative w-full max-w-lg mx-4 sm:mx-6 
          rounded-2xl overflow-hidden
          border ${currentColors.border}
          ${currentColors.bg}
          ${currentColors.shadow}
          animate-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className={`text-lg font-semibold ${currentColors.text}`}>Projects</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close projects"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {mockProjects.length === 0 ? (
            <div className={`text-center py-12 ${currentColors.textTertiary}`}>
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No projects yet</p>
              <p className="text-sm mt-2">Create your first project to get started</p>
            </div>
          ) : (
            mockProjects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center justify-between p-4 rounded-xl ${currentColors.card} transition-colors group cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${currentColors.text} group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors`}>
                      {project.name}
                    </p>
                    <p className={`text-xs ${currentColors.textTertiary} mt-0.5`}>
                      Updated {project.updated}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {project.starred && (
                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                  )}
                  {project.collaborators > 0 && (
                    <div className={`flex items-center gap-1 ${currentColors.textTertiary} text-xs`}>
                      <Users className="w-3.5 h-3.5" />
                      {project.collaborators}
                    </div>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t border-slate-200 dark:border-slate-800/80 ${isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50/40'} flex justify-between items-center`}>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-lg ${currentColors.button} transition-colors`}
          >
            Close
          </button>
          <button
            className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${currentColors.newButton} text-white font-medium transition-all shadow-sm hover:shadow-md`}
          >
            New Project
          </button>
        </div>
      </div>
    </div>
  );
}