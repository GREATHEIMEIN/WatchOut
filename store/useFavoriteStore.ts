// 관심 매물(찜) 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';

interface FavoriteStore {
  favoriteIds: number[];
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (tradePostId: number) => Promise<void>;
  isFavorite: (tradePostId: number) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favoriteIds: [],
  isLoading: false,

  /**
   * 내 관심 목록 로드 (trade_post_id 배열)
   */
  fetchFavorites: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('trade_post_id')
        .eq('user_id', user.id);

      if (error) throw error;

      set({
        favoriteIds: (data || []).map((f) => f.trade_post_id as number),
        isLoading: false,
      });
    } catch {
      console.warn('fetchFavorites: Supabase 미연결');
      set({ isLoading: false });
    }
  },

  /**
   * 찜 토글 — 즉시 UI 반영 (optimistic update), Supabase 실패 시 로컬 유지
   */
  toggleFavorite: async (tradePostId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const alreadyFav = get().isFavorite(tradePostId);

    // Optimistic update
    set((state) => ({
      favoriteIds: alreadyFav
        ? state.favoriteIds.filter((id) => id !== tradePostId)
        : [...state.favoriteIds, tradePostId],
    }));

    try {
      if (alreadyFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('trade_post_id', tradePostId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, trade_post_id: tradePostId });
        if (error) throw error;
      }
    } catch {
      // Supabase 미연결 시 optimistic update 유지 (로컬 mock 모드)
      console.warn('toggleFavorite: Supabase 미연결, 로컬 상태만 업데이트');
    }
  },

  /**
   * 특정 매물 찜 여부 확인
   */
  isFavorite: (tradePostId: number) => {
    return get().favoriteIds.includes(tradePostId);
  },
}));
