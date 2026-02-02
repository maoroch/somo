
// lib/hooks/useUserStats.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserStats {
  videos: number;
  totalViews: number;
  followers: number;
  likes: number;
}

interface UseUserStatsReturn {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('User not authenticated');
        return;
      }

      // Пытаемся получить статистику
      const { data, error: fetchError } = await supabase
        .from('user_stats')
        .select('videos, total_views, followers, likes')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // Если нет статистики, используем значения по умолчанию
        setStats({
          videos: 0,
          totalViews: 0,
          followers: 0,
          likes: 0
        });
        return;
      }

      setStats({
        videos: data?.videos || 0,
        totalViews: data?.total_views || 0,
        followers: data?.followers || 0,
        likes: data?.likes || 0
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}