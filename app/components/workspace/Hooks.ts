import { useEffect, useCallback, useState } from 'react';
import { CanvasElement } from './Types';

export const useCanvasPan = () => {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent, panOffset: { x: number; y: number }) => {
    if (e.button === 1 || (e.button === 0 && (e.metaKey || e.ctrlKey))) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent, setPanOffset: (offset: { x: number; y: number }) => void) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  return { isPanning, handleMouseDown, handleMouseMove, handleMouseUp };
};

export const useKeyboardShortcuts = (
  selectedElement: string | null,
  canvasElements: CanvasElement[],
  setCanvasElements: (elements: CanvasElement[]) => void,
  setSelectedElement: (id: string | null) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          setCanvasElements(canvasElements.filter(el => el.id !== selectedElement));
          setSelectedElement(null);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, canvasElements, setCanvasElements, setSelectedElement]);
};