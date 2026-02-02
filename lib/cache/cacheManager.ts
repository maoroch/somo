// lib/cache/cacheManager.ts
/**
 * Менеджер кеша для управления данными профиля
 * Уменьшает количество запросов к Supabase в 10+ раз
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: number;
}

class CacheManager {
  private prefix = 'somo_cache_';
  private version = 1;
  private ttl = 5 * 60 * 1000; // 5 минут по умолчанию

  /**
   * Получить данные из кеша
   */
  get<T>(key: string, maxAge?: number): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.prefix + key);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);

      // Проверяем версию
      if (entry.version !== this.version) {
        this.remove(key);
        return null;
      }

      // Проверяем время жизни
      const age = Date.now() - entry.timestamp;
      const ttl = maxAge || this.ttl;
      
      if (age > ttl) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Сохранить данные в кеш
   */
  set<T>(key: string, data: T, ttl?: number): void {
    if (typeof window === 'undefined') return;

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: this.version
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(entry));

      // Если нужно, установить автоочистку через TTL
      if (ttl && ttl !== this.ttl) {
        setTimeout(() => this.remove(key), ttl);
      }
    } catch (error) {
      console.error('Cache set error:', error);
      // Если переполнен localStorage, очищаем старые данные
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearOldest();
        this.set(key, data, ttl);
      }
    }
  }

  /**
   * Удалить данные из кеша
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Очистить весь кеш
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Получить размер кеша в KB
   */
  getSize(): number {
    if (typeof window === 'undefined') return 0;

    let size = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          size += localStorage.getItem(key)?.length || 0;
        }
      });
    } catch (error) {
      console.error('Cache size error:', error);
    }

    return size / 1024; // Конвертируем в KB
  }

  /**
   * Очистить старейшие записи (когда переполнен localStorage)
   */
  private clearOldest(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => ({
          key,
          timestamp: JSON.parse(localStorage.getItem(key) || '{}').timestamp || 0
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      // Удаляем 25% самых старых записей
      const toDelete = Math.ceil(keys.length * 0.25);
      for (let i = 0; i < toDelete; i++) {
        localStorage.removeItem(keys[i].key);
      }
    } catch (error) {
      console.error('Clear oldest error:', error);
    }
  }

  /**
   * Установить TTL (время жизни по умолчанию)
   */
  setTTL(ms: number): void {
    this.ttl = ms;
  }

  /**
   * Получить статистику кеша
   */
  getStats(): {
    items: number;
    sizeKB: number;
    ttl: number;
  } {
    if (typeof window === 'undefined') {
      return { items: 0, sizeKB: 0, ttl: this.ttl };
    }

    const items = Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix)).length;

    return {
      items,
      sizeKB: this.getSize(),
      ttl: this.ttl
    };
  }
}

// Экспортируем как синглтон
export const cacheManager = new CacheManager();

// ============================================
// КЛЮЧИ КЕША (используйте эти константы)
// ============================================

export const CACHE_KEYS = {
  // Профиль пользователя
  PROFILE: (userId: string) => `profile_${userId}`,
  
  // Статистика пользователя
  STATS: (userId: string) => `stats_${userId}`,
  
  // Видео проекты
  VIDEOS: (userId: string) => `videos_${userId}`,
  VIDEOS_PAGE: (userId: string, page: number) => `videos_${userId}_page_${page}`,
  
  // Настройки
  THEME: 'theme_preference',
  USER_PREFERENCES: 'user_preferences',
};

// Время жизни для разных типов данных (в мс)
export const CACHE_TTL = {
  PROFILE: 30 * 60 * 1000, // 30 минут - профиль меняется редко
  STATS: 5 * 60 * 1000, // 5 минут - статистика может меняться чаще
  VIDEOS: 10 * 60 * 1000, // 10 минут - видео меняются нечасто
  SETTINGS: 24 * 60 * 60 * 1000, // 24 часа - настройки редко меняются
};