// 시세 데이터 상태 관리

import { create } from 'zustand';
import type { Watch } from '@/types';

interface PriceState {
  watches: Watch[];
  loading: boolean;
  setWatches: (watches: Watch[]) => void;
  setLoading: (loading: boolean) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  watches: [],
  loading: false,
  setWatches: (watches) => set({ watches }),
  setLoading: (loading) => set({ loading }),
}));
