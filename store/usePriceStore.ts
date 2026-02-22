// 시세 데이터 상태 관리

import { create } from 'zustand';
import type { WatchWithPrice } from '@/types';

interface PriceState {
  watches: WatchWithPrice[];
  loading: boolean;
  searchQuery: string;
  selectedBrand: string;
  setWatches: (watches: WatchWithPrice[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedBrand: (brand: string) => void;
  getFilteredWatches: () => WatchWithPrice[];
}

export const usePriceStore = create<PriceState>((set, get) => ({
  watches: [],
  loading: false,
  searchQuery: '',
  selectedBrand: '전체',
  setWatches: (watches) => set({ watches }),
  setLoading: (loading) => set({ loading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),
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
