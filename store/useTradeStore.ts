// 시계거래 상태 관리

import { create } from 'zustand';
import type { MockTradeItem, MockAccessoryItem, ItemType, TradeType, Condition } from '@/types';

type SortOption = 'latest' | 'price_low' | 'price_high';
type StatusFilter = 'all' | 'active' | 'reserved' | 'sold';

interface TradeFormData {
  itemType: ItemType;
  type: TradeType;
  brand: string;
  model: string;
  referenceNumber: string;
  year: string;
  condition: Condition | '';
  kit: string[];
  category: string;
  title: string;
  price: string;
  method: string;
  location: string;
  description: string;
  photos: string[];
}

const INITIAL_FORM: TradeFormData = {
  itemType: 'watch',
  type: 'sell',
  brand: '',
  model: '',
  referenceNumber: '',
  year: '',
  condition: '',
  kit: [],
  category: '',
  title: '',
  price: '',
  method: '',
  location: '',
  description: '',
  photos: [],
};

interface TradeState {
  // 데이터
  tradeItems: MockTradeItem[];
  accessoryItems: MockAccessoryItem[];

  // 탭
  activeTab: ItemType;

  // 시계 필터
  searchQuery: string;
  selectedBrand: string;
  selectedStatus: StatusFilter;
  sortOption: SortOption;

  // 시계용품 필터
  selectedCategory: string;

  // 로딩
  loading: boolean;

  // 매물 등록 폼
  formData: TradeFormData;

  // 액션
  setTradeItems: (items: MockTradeItem[]) => void;
  setAccessoryItems: (items: MockAccessoryItem[]) => void;
  setActiveTab: (tab: ItemType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedBrand: (brand: string) => void;
  setSelectedStatus: (status: StatusFilter) => void;
  setSortOption: (option: SortOption) => void;
  setSelectedCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;

  // 폼 액션
  setFormField: <K extends keyof TradeFormData>(key: K, value: TradeFormData[K]) => void;
  toggleFormKit: (kit: string) => void;
  resetForm: () => void;
  isFormValid: () => boolean;

  // 필터링된 결과
  getFilteredTradeItems: () => MockTradeItem[];
  getFilteredAccessoryItems: () => MockAccessoryItem[];
}

export const useTradeStore = create<TradeState>((set, get) => ({
  tradeItems: [],
  accessoryItems: [],
  activeTab: 'watch',
  searchQuery: '',
  selectedBrand: '전체',
  selectedStatus: 'all',
  sortOption: 'latest',
  selectedCategory: '전체',
  loading: false,
  formData: { ...INITIAL_FORM },

  setTradeItems: (tradeItems) => set({ tradeItems }),
  setAccessoryItems: (accessoryItems) => set({ accessoryItems }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setSortOption: (sortOption) => set({ sortOption }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setLoading: (loading) => set({ loading }),

  // 폼 액션
  setFormField: (key, value) =>
    set((state) => ({ formData: { ...state.formData, [key]: value } })),

  toggleFormKit: (kit) =>
    set((state) => {
      const kits = state.formData.kit.includes(kit)
        ? state.formData.kit.filter((k) => k !== kit)
        : [...state.formData.kit, kit];
      return { formData: { ...state.formData, kit: kits } };
    }),

  resetForm: () => set({ formData: { ...INITIAL_FORM } }),

  isFormValid: () => {
    const { formData } = get();
    if (formData.itemType === 'watch') {
      return formData.brand !== '' && formData.model !== '' && formData.price !== '';
    }
    return formData.title !== '' && formData.category !== '' && formData.price !== '';
  },

  // 시계 필터링
  getFilteredTradeItems: () => {
    const { tradeItems, searchQuery, selectedBrand, selectedStatus, sortOption } = get();
    let filtered = [...tradeItems];

    // 브랜드 필터
    if (selectedBrand !== '전체') {
      filtered = filtered.filter((t) => t.brand === selectedBrand);
    }

    // 상태 필터
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((t) => (t.status ?? 'active') === selectedStatus);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.brand.toLowerCase().includes(q) ||
          t.model.toLowerCase().includes(q) ||
          t.ref.toLowerCase().includes(q),
      );
    }

    // 정렬
    switch (sortOption) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
      default:
        break;
    }

    return filtered;
  },

  // 시계용품 필터링
  getFilteredAccessoryItems: () => {
    const { accessoryItems, searchQuery, selectedCategory } = get();
    let filtered = accessoryItems;

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.title.toLowerCase().includes(q));
    }

    return filtered;
  },
}));
