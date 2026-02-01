import { CanvasElement, TextElement, FrameElement, ImageElement, VideoElement, ElementType } from '../Types';

export class ElementFactory {
  /**
   * Создает новый элемент указанного типа с дефолтными настройками
   */
  static createElement(
    type: ElementType,
    options: {
      x?: number;
      y?: number;
      isDarkMode?: boolean;
    } = {}
  ): CanvasElement {
    const { x = 100, y = 100, isDarkMode = true } = options;
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const baseElement = {
      id,
      x,
      y,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
    };

    switch (type) {
      case 'text':
        return {
          ...baseElement,
          type: 'text',
          width: 300,
          height: 80,
          content: 'Double click to edit',
          fontSize: 24,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 400,
          color: isDarkMode ? '#ffffff' : '#000000',
          textAlign: 'left',
          lineHeight: 1.4,
        } as TextElement;

      case 'frame':
        return {
          ...baseElement,
          type: 'frame',
          width: 400,
          height: 300,
          backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
          borderColor: isDarkMode ? '#475569' : '#cbd5e1',
          borderWidth: 2,
          borderRadius: 8,
          children: [],
        } as FrameElement;

      case 'image':
        return {
          ...baseElement,
          type: 'image',
          width: 400,
          height: 300,
          src: '',
          alt: 'Canvas image',
          fit: 'cover',
        } as ImageElement;

      case 'video':
        return {
          ...baseElement,
          type: 'video',
          width: 640,
          height: 360,
          src: '',
          autoPlay: false,
          loop: false,
          muted: true,
        } as VideoElement;

      default:
        throw new Error(`Unknown element type: ${type}`);
    }
  }

  /**
   * Клонирует элемент с новым ID и смещением
   */
  static cloneElement(element: CanvasElement, offset = 20): CanvasElement {
    const newId = `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...element,
      id: newId,
      x: element.x + offset,
      y: element.y + offset,
    };
  }

  /**
   * Обновляет размеры элемента с сохранением пропорций
   */
  static resizeElement(
    element: CanvasElement,
    newWidth: number,
    newHeight: number,
    maintainAspectRatio = false
  ): CanvasElement {
    if (maintainAspectRatio) {
      const aspectRatio = element.width / element.height;
      if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }
    }

    return {
      ...element,
      width: Math.max(20, newWidth),
      height: Math.max(20, newHeight),
    };
  }

  /**
   * Перемещает элемент на указанное смещение
   */
  static moveElement(element: CanvasElement, deltaX: number, deltaY: number): CanvasElement {
    return {
      ...element,
      x: element.x + deltaX,
      y: element.y + deltaY,
    };
  }

  /**
   * Поворачивает элемент на указанный угол
   */
  static rotateElement(element: CanvasElement, deltaRotation: number): CanvasElement {
    return {
      ...element,
      rotation: (element.rotation + deltaRotation) % 360,
    };
  }

  /**
   * Изменяет прозрачность элемента
   */
  static setOpacity(element: CanvasElement, opacity: number): CanvasElement {
    return {
      ...element,
      opacity: Math.max(0, Math.min(1, opacity)),
    };
  }

  /**
   * Блокирует/разблокирует элемент
   */
  static toggleLock(element: CanvasElement): CanvasElement {
    return {
      ...element,
      locked: !element.locked,
    };
  }

  /**
   * Показывает/скрывает элемент
   */
  static toggleVisibility(element: CanvasElement): CanvasElement {
    return {
      ...element,
      visible: !element.visible,
    };
  }

  /**
   * Проверяет, находится ли точка внутри элемента
   */
  static containsPoint(element: CanvasElement, x: number, y: number): boolean {
    return (
      x >= element.x &&
      x <= element.x + element.width &&
      y >= element.y &&
      y <= element.y + element.height
    );
  }

  /**
   * Получает границы элемента
   */
  static getBounds(element: CanvasElement) {
    return {
      left: element.x,
      top: element.y,
      right: element.x + element.width,
      bottom: element.y + element.height,
      centerX: element.x + element.width / 2,
      centerY: element.y + element.height / 2,
    };
  }
}