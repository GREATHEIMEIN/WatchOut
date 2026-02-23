// 시세 데이터 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { WatchWithPrice } from '@/types';

interface PriceState {
  watches: WatchWithPrice[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedBrand: string;
  setWatches: (watches: WatchWithPrice[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedBrand: (brand: string) => void;
  fetchWatches: () => Promise<void>;
  getFilteredWatches: () => WatchWithPrice[];
}

export const usePriceStore = create<PriceState>((set, get) => ({
  watches: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedBrand: '전체',
  setWatches: (watches) => set({ watches }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),

  /**
   * Supabase에서 시세 데이터 조회
   * watches + watch_prices LEFT JOIN
   * 각 모델의 최신 가격 + 변동률 + 최근 6주 히스토리
   */
  fetchWatches: async () => {
    set({ loading: true, error: null });

    try {
      // 1. watches 테이블 조회
      const { data: watches, error: watchesError } = await supabase
        .from('watches')
        .select('*')
        .order('brand', { ascending: true });

      if (watchesError) throw watchesError;
      if (!watches) {
        set({ watches: [], loading: false });
        return;
      }

      // 2. 각 watch의 최신 가격 + 히스토리 조회
      const watchesWithPrice: WatchWithPrice[] = await Promise.all(
        watches.map(async (watch) => {
          // 최신 가격 조회
          const { data: latestPrice } = await supabase
            .from('watch_prices')
            .select('price, change_percent')
            .eq('watch_id', watch.id)
            .order('recorded_date', { ascending: false })
            .limit(1)
            .single();

          // 최근 6주 히스토리 조회
          const { data: history } = await supabase
            .from('watch_prices')
            .select('price')
            .eq('watch_id', watch.id)
            .order('recorded_date', { ascending: false })
            .limit(6);

          return {
            id: watch.id,
            brand: watch.brand,
            model: watch.model,
            referenceNumber: watch.reference_number,
            imageUrl: watch.image_url,
            category: watch.category,
            caseSizeMm: watch.case_size_mm,
            createdAt: watch.created_at,
            price: latestPrice?.price || 0,
            change: latestPrice?.change_percent || 0,
            history: history ? history.map((h) => h.price).reverse() : [],
          };
        }),
      );

      set({ watches: watchesWithPrice, loading: false });
    } catch (error) {
      console.error('fetchWatches error:', error);
      set({
        error: '시세 데이터를 불러올 수 없습니다',
        loading: false,
      });
    }
  },

  getFilteredWatches: () => {
    const { watches, searchQuery, selectedBrand } = get();
    let filtered = watches;

    // 브랜드 필터
    if (selectedBrand !== '전체') {
      filtered = filtered.filter((w) => w.brand === selectedBrand);
    }

    // 검색어 필터 (브랜드, 모델, 레퍼런스)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.brand.toLowerCase().includes(q) ||
          w.model.toLowerCase().includes(q) ||
          w.referenceNumber.toLowerCase().includes(q),
      );
    }

    return filtered;
  },
}));
