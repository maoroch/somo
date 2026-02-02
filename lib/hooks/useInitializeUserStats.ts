// lib/hooks/useInitializeUserStats.ts
// Этот хук автоматически создаёт запись в user_stats если её нет
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useInitializeUserStats() {
  useEffect(() => {
    const initializeStats = async () => {
      try {
        const supabase = createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return;

        // Проверяем, есть ли статистика
        const { data: stats } = await supabase
          .from('user_stats')
          .select('id')
          .eq('user_id', user.id)
          .single();

        // Если нет, создаём
        if (!stats) {
          await supabase.from('user_stats').insert({
            user_id: user.id,
            videos: 0,
            total_views: 0,
            followers: 0,
            likes: 0
          });
        }
      } catch (err) {
        console.error('Error initializing user stats:', err);
      }
    };

    initializeStats();
  }, []);
}