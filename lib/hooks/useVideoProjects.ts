
// lib/hooks/useVideoProjects.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

interface UseVideoProjectsReturn {
  videos: VideoProject[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVideoProjects(): UseVideoProjectsReturn {
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('User not authenticated');
        return;
      }

      // Пытаемся получить видео проекты
      const { data, error: fetchError } = await supabase
        .from('video_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        // Если таблицы нет или нет видео, используем пустой массив
        setVideos([]);
        setError(null);
        return;
      }

      const mappedVideos = (data || []).map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail_url,
        duration: video.duration || '0:00',
        views: video.views || 0,
        likes: video.likes || 0,
        createdAt: formatDate(video.created_at),
        category: video.category || 'Uncategorized'
      }));

      setVideos(mappedVideos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, loading, error, refetch: fetchVideos };
}
