// 알림 생성 헬퍼

import { supabase } from '@/lib/supabase';
import type { NotificationType } from '@/store/useNotificationStore';

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data: Record<string, string> = {},
): Promise<void> => {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      type,
      title,
      body,
      data,
    });
    if (error) throw error;
  } catch (error) {
    console.error('createNotification error:', error);
  }
};
