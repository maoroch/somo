export type Tool = 'select' | 'text' | 'image' | 'shape' | 'ai';

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