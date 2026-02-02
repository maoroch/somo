
// lib/hooks/useUploadAvatar.ts
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseUploadAvatarReturn {
  uploading: boolean;
  error: string | null;
  uploadAvatar: (file: File) => Promise<string | null>;
}

export function useUploadAvatar(): UseUploadAvatarReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('User not authenticated');
        return null;
      }

      // Проверяем размер файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return null;
      }

      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return null;
      }

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Загружаем файл в Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        return null;
      }

      // Получаем публичный URL
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = publicUrl.publicUrl;

      // Обновляем профиль с новым URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
        return null;
      }

      setError(null);
      return avatarUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, uploadAvatar };
}