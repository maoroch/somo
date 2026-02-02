
// lib/hooks/useProfileWithCache.ts
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cacheManager, CACHE_KEYS, CACHE_TTL } from '@/lib/cache/cacheManager';

interface UserProfile {
  id: string;
  name?: string;
  full_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  website?: string;
  email?: string;
  created_at: string;
  updated_at?: string;
}

interface UseProfileWithCacheReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useProfileWithCache(): UseProfileWithCacheReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Получаем профиль из кеша или Supabase
  const fetchProfile = useCallback(async (forceRefresh = false) => {
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
      const cacheKey = CACHE_KEYS.PROFILE(user.id);

      // Если не форсируем обновление, пробуем получить из кеша
      if (!forceRefresh) {
        const cached = cacheManager.get<UserProfile>(cacheKey);
        if (cached) {
          setProfile(cached);
          setError(null);
          setLoading(false);
          return;
        }
      }

      // Если нет в кеше, загружаем с Supabase
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      // Сохраняем в кеш
      cacheManager.set(cacheKey, data, CACHE_TTL.PROFILE);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Очистить кеш профиля
  const clearCache = useCallback(() => {
    if (userId) {
      cacheManager.remove(CACHE_KEYS.PROFILE(userId));
      setProfile(null);
    }
  }, [userId]);

  // Загрузить профиль при монтировании компонента
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    error, 
    refetch: () => fetchProfile(true),
    clearCache 
  };
}
