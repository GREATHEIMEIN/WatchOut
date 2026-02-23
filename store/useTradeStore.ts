// 시계거래 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { formatRelativeTime } from '@/lib/format';
import { useAuthStore } from './useAuthStore';
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

interface MyTradeItem {
  id: number;
  brand: string;
  model: string;
  price: number;
  status: string;
  itemType: string;
  type: string;
  images: string[] | null;
  createdAt: string;
}

interface TradeState {
  // 데이터
  tradeItems: MockTradeItem[];
  accessoryItems: MockAccessoryItem[];
  myTrades: MyTradeItem[];
  myTradesLoading: boolean;

  // 탭
  activeTab: ItemType;

  // 시계 필터
  searchQuery: string;
  selectedBrand: string;
  selectedStatus: StatusFilter;
  sortOption: SortOption;

  // 시계용품 필터
  selectedCategory: string;

  // 로딩 & 에러
  loading: boolean;
  error: string | null;

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
  setError: (error: string | null) => void;

  // Supabase 액션
  fetchTradePosts: (itemType: ItemType) => Promise<void>;
  fetchMyTrades: (userId: string) => Promise<void>;
  createTradePost: () => Promise<{ success: boolean; error?: string }>;
  uploadImages: (uris: string[]) => Promise<string[]>;

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
  myTrades: [],
  myTradesLoading: false,
  activeTab: 'watch',
  searchQuery: '',
  selectedBrand: '전체',
  selectedStatus: 'all',
  sortOption: 'latest',
  selectedCategory: '전체',
  loading: false,
  error: null,
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
  setError: (error) => set({ error }),

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

  /**
   * 내 매물 조회 (userId 기준)
   */
  fetchMyTrades: async (userId: string) => {
    set({ myTradesLoading: true });

    try {
      const { data, error } = await supabase
        .from('trade_posts')
        .select('id, brand, model, price, status, item_type, type, images, created_at')
        .eq('user_id', userId)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const myTrades: MyTradeItem[] = (data || []).map((post: any) => ({
        id: post.id,
        brand: post.brand || '',
        model: post.model || '',
        price: post.price,
        status: post.status,
        itemType: post.item_type,
        type: post.type,
        images: post.images,
        createdAt: post.created_at,
      }));

      set({ myTrades, myTradesLoading: false });
    } catch (error) {
      console.error('fetchMyTrades error:', error);
      set({ myTradesLoading: false });
    }
  },

  /**
   * Supabase에서 매물 조회
   * trade_posts + users LEFT JOIN
   */
  fetchTradePosts: async (itemType: ItemType) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('trade_posts')
        .select(`*, users:user_id(nickname, level, avatar_url)`)
        .eq('item_type', itemType)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const items = (data || []).map((post: any) => ({
        id: post.id,
        brand: post.brand || '',
        model: post.model || '',
        ref: post.reference_number || '',
        price: post.price,
        condition: post.condition || 'A',
        year: post.year || '',
        loc: post.location || '',
        kit: post.kit || '',
        badge: 'green' as const,
        badgeText: '시세',
        type: post.type,
        author: post.users?.nickname || 'Unknown',
        time: formatRelativeTime(post.created_at),
        description: post.description,
        method: post.method || '직거래',
        authorLevel: post.users?.level || 1,
        authorRating: 4.8,
        views: post.views,
        status: post.status,
        title: post.title || '',
        category: '워치와인더',
        userId: post.user_id,
      }));

      if (itemType === 'watch') {
        set({ tradeItems: items, loading: false });
      } else {
        set({ accessoryItems: items, loading: false });
      }
    } catch (error) {
      console.error('fetchTradePosts error:', error);
      set({ error: '매물을 불러올 수 없습니다', loading: false });
    }
  },

  /**
   * Storage에 이미지 업로드
   */
  uploadImages: async (uris: string[]) => {
    const { user } = useAuthStore.getState();
    if (!user) return [];

    const uploadedUrls: string[] = [];

    for (const uri of uris) {
      try {
        const fileName = `${user.id}/${Date.now()}_${Math.random()}.jpg`;

        // Note: Supabase storage.upload는 React Native에서 직접 지원하지 않음
        // expo-image-picker로 선택한 이미지는 별도 처리 필요
        // 현재는 placeholder로 구현
        const { data, error } = await supabase.storage
          .from('trade-images')
          .upload(fileName, uri as any);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from('trade-images').getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('uploadImages error:', error);
      }
    }

    return uploadedUrls;
  },

  /**
   * 매물 등록 (CREATE)
   */
  createTradePost: async () => {
    const { formData } = get();
    const { user } = useAuthStore.getState();

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' };
    }

    set({ loading: true, error: null });

    try {
      // 1. formData.photos (이미 업로드된 URL 배열)
      const imageUrls = formData.photos.filter(Boolean);

      // 2. DB INSERT
      const { error } = await supabase.from('trade_posts').insert({
        user_id: user.id,
        type: formData.type,
        item_type: formData.itemType,
        brand: formData.itemType === 'watch' ? formData.brand : null,
        model: formData.itemType === 'watch' ? formData.model : null,
        reference_number: formData.referenceNumber || null,
        title: formData.itemType === 'accessory' ? formData.title : null,
        price: parseInt(formData.price),
        condition: formData.condition || null,
        year: formData.year || null,
        kit: formData.kit.join(', ') || null,
        description: formData.description,
        images: imageUrls.length > 0 ? imageUrls : null,
        location: formData.location || null,
        method: formData.method || '직거래',
      });

      if (error) throw error;

      // 3. 폼 리셋 + 리스트 새로고침
      get().resetForm();
      await get().fetchTradePosts(formData.itemType);

      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('createTradePost error:', error);
      set({ error: '매물 등록에 실패했습니다', loading: false });
      return { success: false, error: '매물 등록에 실패했습니다' };
    }
  },
}));
