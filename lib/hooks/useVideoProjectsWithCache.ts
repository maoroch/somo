
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cacheManager } from '@/lib/cache/cacheManager';
import { CACHE_KEYS, CACHE_TTL } from '@/lib/cache/cacheManager';


// ============================================
// lib/hooks/useVideoProjectsWithCache.ts
// ============================================

interface VideoProject {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
  category: string;
}

interface UseVideoProjectsWithCacheReturn {
  videos: VideoProject[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

const PAGE_SIZE = 6;

export function useVideoProjectsWithCache(): UseVideoProjectsWithCacheReturn {
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const fetchVideos = useCallback(async (page: number = 0, forceRefresh = false) => {
    try {
      if (page === 0) setLoading(true);

      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('User not authenticated');
        if (page === 0) setLoading(false);
        return;
      }

      setUserId(user.id);
      const cacheKey = CACHE_KEYS.VIDEOS_PAGE(user.id, page);

      // Пробуем кеш для каждой страницы
      if (!forceRefresh && page === 0) {
        const cached = cacheManager.get<VideoProject[]>(cacheKey);
        if (cached) {
          setVideos(cached);
          setError(null);
          setLoading(false);
          return;
        }
      }

      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      // Загружаем с Supabase
      const { data, error: fetchError } = await supabase
        .from('video_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (fetchError) {
        setError(fetchError.message);
        if (page === 0) setLoading(false);
        return;
      }

      const formattedVideos = (data || []).map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url,
        duration: v.duration || '0:00',
        views: v.views || 0,
        likes: v.likes || 0,
        createdAt: formatDate(v.created_at),
        category: v.category || 'Uncategorized'
      }));

      // Сохраняем текущую страницу в кеш
      cacheManager.set(cacheKey, formattedVideos, CACHE_TTL.VIDEOS);

      if (page === 0) {
        setVideos(formattedVideos);
      } else {
        setVideos(prev => [...prev, ...formattedVideos]);
      }

      // Проверяем есть ли ещё видео
      setHasMore(formattedVideos.length === PAGE_SIZE);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (page === 0) setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    await fetchVideos(currentPage + 1);
  }, [currentPage, fetchVideos]);

  const refetch = useCallback(async () => {
    await fetchVideos(0, true);
  }, [fetchVideos]);

  const clearCache = useCallback(() => {
    if (userId) {
      // Очищаем все страницы видео для этого пользователя
      for (let i = 0; i <= currentPage; i++) {
        cacheManager.remove(CACHE_KEYS.VIDEOS_PAGE(userId, i));
      }
      setVideos([]);
      setCurrentPage(0);
      setHasMore(true);
    }
  }, [userId, currentPage]);

  useEffect(() => {
    fetchVideos(0);
  }, []);

  return { 
    videos, 
    loading, 
    error, 
    hasMore,
    currentPage,
    loadMore, 
    refetch,
    clearCache 
  };
}
