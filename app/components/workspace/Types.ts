export type Tool = 'select' | 'text' | 'image' | 'frame' | 'ai';

export type Theme = 'light' | 'dark';

export interface ColorScheme {
  bg: string;
  sidebar: string;
  navbar: string;
  canvas: string;
  border: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  hover: string;
  active: string;
}


// Базовый интерфейс для всех элементов canvas
export interface BaseCanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
  visible?: boolean;
}

// Текстовый элемент
export interface TextElement extends BaseCanvasElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
}

// Изображение
export interface ImageElement extends BaseCanvasElement {
  type: 'image';
  src: string;
  alt?: string;
  fit?: 'cover' | 'contain' | 'fill';
}

// Фрейм (контейнер)
export interface FrameElement extends BaseCanvasElement {
  type: 'frame';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  children?: string[]; // ID дочерних элементов
}

// Видео
export interface VideoElement extends BaseCanvasElement {
  type: 'video';
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}


// Объединенный тип для всех элементов
export type CanvasElement = TextElement | ImageElement | VideoElement | FrameElement;
export type ElementType = CanvasElement['type'];
