// lib/hooks/useProfileUpdate.ts
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseProfileUpdateReturn {
  updating: boolean;
  error: string | null;
  updateProfile: (updates: Record<string, any>) => Promise<void>;
}

export function useProfileUpdate(): UseProfileUpdateReturn {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (updates: Record<string, any>) => {
    try {
      setUpdating(true);
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('User not authenticated');
        return;
      }

      // Добавляем updated_at автоматически
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUpdating(false);
    }
  };

  return { updating, error, updateProfile };
}
