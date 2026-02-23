// 컬렉션 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { CollectionWithWatch, CollectionInsert, PortfolioStats } from '@/types';

interface CollectionState {
  collections: CollectionWithWatch[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchMyCollection: (userId: string) => Promise<void>;
  addToCollection: (data: CollectionInsert) => Promise<{ success: boolean; error?: string }>;
  updateCollection: (id: number, updates: Partial<CollectionInsert>) => Promise<{ success: boolean }>;
  removeFromCollection: (id: number) => Promise<{ success: boolean }>;
  getStats: () => PortfolioStats;
  setError: (error: string | null) => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  loading: false,
  error: null,

  setError: (error) => set({ error }),

  // 내 컬렉션 조회 (JOIN + 시세 정보)
  fetchMyCollection: async (userId) => {
    set({ loading: true, error: null });
    try {
      // 1. collections LEFT JOIN watches
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select(`
          *,
          watches:watch_id (
            id,
            brand,
            model,
            reference_number,
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (collectionsError) throw collectionsError;

      // 2. 각 시계의 최신 시세 조회
      const collectionsWithPrice: CollectionWithWatch[] = await Promise.all(
        (collectionsData || []).map(async (collection: any) => {
          const watch = collection.watches;

          // 최신 시세 조회
          const { data: latestPrice } = await supabase
            .from('watch_prices')
            .select('price, change_percent')
            .eq('watch_id', watch.id)
            .order('recorded_date', { ascending: false })
            .limit(1)
            .single();

          const currentPrice = latestPrice?.price || null;
          const purchasePrice = collection.purchase_price;

          // 수익률 계산
          let returnRate = null;
          let returnAmount = null;
          if (currentPrice !== null && purchasePrice !== null && purchasePrice > 0) {
            returnAmount = currentPrice - purchasePrice;
            returnRate = (returnAmount / purchasePrice) * 100;
          }

          return {
            id: collection.id,
            userId: collection.user_id,
            watchId: collection.watch_id,
            purchasePrice: collection.purchase_price,
            purchaseDate: collection.purchase_date,
            note: collection.note,
            createdAt: collection.created_at,
            brand: watch.brand,
            model: watch.model,
            referenceNumber: watch.reference_number,
            imageUrl: watch.image_url,
            currentPrice,
            changePercent: latestPrice?.change_percent || null,
            returnRate,
            returnAmount,
          };
        }),
      );

      set({ collections: collectionsWithPrice, loading: false });
    } catch (error: any) {
      console.error('[Collection] fetchMyCollection 에러:', error);
      set({
        error: '컬렉션을 불러올 수 없습니다',
        loading: false,
      });
    }
  },

  // 컬렉션 추가
  addToCollection: async (data) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('collections').insert(data);

      if (error) {
        // UNIQUE 제약 위반 체크
        if (error.code === '23505') {
          set({ loading: false });
          return { success: false, error: '이미 컬렉션에 추가된 시계입니다' };
        }
        throw error;
      }

      // 리스트 새로고침
      await get().fetchMyCollection(data.user_id);
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      console.error('[Collection] addToCollection 에러:', error);
      set({ error: '컬렉션 추가에 실패했습니다', loading: false });
      return { success: false, error: '컬렉션 추가에 실패했습니다' };
    }
  },

  // 컬렉션 수정
  updateCollection: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // 현재 컬렉션 리스트에서 userId 가져오기
      const collection = get().collections.find((c) => c.id === id);
      if (collection) {
        await get().fetchMyCollection(collection.userId);
      }

      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      console.error('[Collection] updateCollection 에러:', error);
      set({ error: '수정에 실패했습니다', loading: false });
      return { success: false };
    }
  },

  // 컬렉션 삭제
  removeFromCollection: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('collections').delete().eq('id', id);

      if (error) throw error;

      // 로컬 상태에서 제거
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error: any) {
      console.error('[Collection] removeFromCollection 에러:', error);
      set({ error: '삭제에 실패했습니다', loading: false });
      return { success: false };
    }
  },

  // 포트폴리오 통계 계산
  getStats: () => {
    const collections = get().collections;

    let totalPurchaseValue = 0;
    let totalCurrentValue = 0;
    let validCount = 0;

    collections.forEach((item) => {
      if (item.purchasePrice !== null && item.currentPrice !== null) {
        totalPurchaseValue += item.purchasePrice;
        totalCurrentValue += item.currentPrice;
        validCount++;
      }
    });

    const totalReturn = totalCurrentValue - totalPurchaseValue;
    const totalReturnRate =
      totalPurchaseValue > 0 ? (totalReturn / totalPurchaseValue) * 100 : 0;

    return {
      totalWatches: collections.length,
      totalPurchaseValue,
      totalCurrentValue,
      totalReturn,
      totalReturnRate,
    };
  },
}));
