'use client';
// ============================================
// lib/hooks/useUserStatsWithCache.ts
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cacheManager } from '@/lib/cache/cacheManager';
import { CACHE_KEYS, CACHE_TTL } from '@/lib/cache/cacheManager';
interface UserStats {
  videos: number;
  totalViews: number;
  followers: number;
  likes: number;
}

interface UseUserStatsWithCacheReturn {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useUserStatsWithCache(): UseUserStatsWithCacheReturn {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const cacheKey = CACHE_KEYS.STATS(user.id);

      // Пробуем кеш
      if (!forceRefresh) {
        const cached = cacheManager.get<UserStats>(cacheKey);
        if (cached) {
          setStats(cached);
          setError(null);
          setLoading(false);
          return;
        }
      }

      // Загружаем с Supabase
      const { data, error: fetchError } = await supabase
        .from('user_stats')
        .select('videos, total_views, followers, likes')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // Если записи нет, используем значения по умолчанию
        const defaultStats: UserStats = {
          videos: 0,
          totalViews: 0,
          followers: 0,
          likes: 0
        };
        cacheManager.set(cacheKey, defaultStats, CACHE_TTL.STATS);
        setStats(defaultStats);
        setError(null);
        setLoading(false);
        return;
      }

      const formattedStats: UserStats = {
        videos: data?.videos || 0,
        totalViews: data?.total_views || 0,
        followers: data?.followers || 0,
        likes: data?.likes || 0
      };

      // Сохраняем в кеш
      cacheManager.set(cacheKey, formattedStats, CACHE_TTL.STATS);
      setStats(formattedStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    if (userId) {
      cacheManager.remove(CACHE_KEYS.STATS(userId));
      setStats(null);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { 
    stats, 
    loading, 
    error, 
    refetch: () => fetchStats(true),
    clearCache 
  };
}
