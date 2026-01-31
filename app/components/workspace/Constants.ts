import {
  Home,
  Video,
  FolderOpen,
  Settings,
  User,
  Sparkles,
  MousePointer,
  Type,
  Image as ImageIcon,
  Square,
  Wand2
} from 'lucide-react';
import { ColorScheme } from './Types';

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const MIN_ZOOM = 25;
export const MAX_ZOOM = 200;
export const ZOOM_STEP = 10;
export const ZOOM_SENSITIVITY = 0.001;

export const colors: { dark: ColorScheme; light: ColorScheme } = {
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

export const sidebarItems = [
  { icon: Home, label: 'Home', href: '/', badge: null },
  { icon: Video, label: 'My Videos', href: '/videos', badge: '12' },
  { icon: FolderOpen, label: 'Projects', href: '/projects', badge: null },
  { icon: Sparkles, label: 'AI Studio', href: '/workspace', badge: 'NEW', active: true },
  { icon: User, label: 'Profile', href: '/profile', badge: null },
  { icon: Settings, label: 'Settings', href: '/settings', badge: null },
];

export const tools = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
  { id: 'shape', icon: Square, label: 'Shape' },
  { id: 'ai', icon: Wand2, label: 'AI Generate' },
];