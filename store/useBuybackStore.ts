// 즉시매입 신청 폼 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';
import type { Condition } from '@/types';

interface BuybackFormData {
  brand: string;
  customBrand: string;    // '기타' 선택 시 직접 입력
  model: string;
  ref: string;
  year: string;
  condition: Condition | '';
  kits: string[];
  photos: string[];
  phone: string;
  location: string;
}

interface MyRequest {
  id: number;
  brand: string;
  model: string;
  type: string;
  status: string;
  createdAt: string;
}

const REQUEST_STATUS_LABEL: Record<string, string> = {
  pending: '접수',
  contacted: '검토중',
  visited: '방문완료',
  completed: '완료',
  cancelled: '취소',
};

const REQUEST_STATUS_COLOR: Record<string, string> = {
  pending: '#8E8E93',
  contacted: '#FF9500',
  visited: '#FF9500',
  completed: '#34C759',
  cancelled: '#FF3B30',
};

export { REQUEST_STATUS_LABEL, REQUEST_STATUS_COLOR };

interface BuybackState {
  step: number;
  formData: BuybackFormData;
  done: boolean;
  loading: boolean;
  error: string | null;
  myRequests: MyRequest[];
  myRequestsLoading: boolean;
  setStep: (step: number) => void;
  setFormField: <K extends keyof BuybackFormData>(key: K, value: BuybackFormData[K]) => void;
  toggleKit: (kit: string) => void;
  setDone: (done: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  isStepValid: () => boolean;
  submitRequest: () => Promise<{ success: boolean }>;
  uploadPhotos: (uris: string[]) => Promise<string[]>;
  fetchMyRequests: (userId: string) => Promise<void>;
}

const INITIAL_FORM: BuybackFormData = {
  brand: '',
  customBrand: '',
  model: '',
  ref: '',
  year: '',
  condition: '',
  kits: [],
  photos: [],
  phone: '',
  location: '',
};

export const useBuybackStore = create<BuybackState>((set, get) => ({
  step: 1,
  formData: { ...INITIAL_FORM },
  done: false,
  loading: false,
  error: null,
  myRequests: [],
  myRequestsLoading: false,

  setStep: (step) => set({ step }),

  setFormField: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  toggleKit: (kit) =>
    set((state) => {
      const kits = state.formData.kits.includes(kit)
        ? state.formData.kits.filter((k) => k !== kit)
        : [...state.formData.kits, kit];
      return { formData: { ...state.formData, kits } };
    }),

  setDone: (done) => set({ done }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () => set({ step: 1, formData: { ...INITIAL_FORM }, done: false }),

  isStepValid: () => {
    const { step, formData } = get();
    switch (step) {
      case 1:
        if (formData.brand === '') return false;
        if (formData.brand === '기타' && formData.customBrand.trim() === '') return false;
        return true;
      case 2:
        return formData.model.trim() !== '';
      case 3:
        return formData.condition !== '';
      case 4:
        return true; // 사진은 선택사항
      case 5:
        return formData.phone.trim() !== '';
      default:
        return false;
    }
  },

  /**
   * 내 매입/교환 신청 내역 조회
   */
  fetchMyRequests: async (userId: string) => {
    set({ myRequestsLoading: true });

    try {
      const { data, error } = await supabase
        .from('buyback_requests')
        .select('id, brand, model, type, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const myRequests: MyRequest[] = (data || []).map((req: any) => ({
        id: req.id,
        brand: req.brand,
        model: req.model,
        type: req.type || 'buyback',
        status: req.status,
        createdAt: req.created_at,
      }));

      set({ myRequests, myRequestsLoading: false });
    } catch (error) {
      console.error('fetchMyRequests error:', error);
      set({ myRequestsLoading: false });
    }
  },

  /**
   * Storage에 사진 업로드
   */
  uploadPhotos: async (uris: string[]) => {
    const { user } = useAuthStore.getState();
    const userId = user?.id || 'anonymous';

    const uploadedUrls: string[] = [];

    for (const uri of uris) {
      try {
        const fileName = `${userId}/${Date.now()}_${Math.random()}.jpg`;

        // Note: 실제 이미지 업로드는 expo-image-picker + FormData 필요
        // 현재는 placeholder
        const { data, error } = await supabase.storage
          .from('buyback-images')
          .upload(fileName, uri as any);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from('buyback-images').getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('uploadPhotos error:', error);
      }
    }

    return uploadedUrls;
  },

  /**
   * 즉시매입 신청 제출 (CREATE)
   */
  submitRequest: async () => {
    const { formData } = get();
    const { user } = useAuthStore.getState();

    set({ loading: true, error: null });

    try {
      // 1. formData.photos (이미 업로드된 URL 배열)
      const photoUrls = formData.photos.filter(Boolean);

      // 2. DB INSERT (user_id는 optional, 비회원도 가능)
      const effectiveBrand =
        formData.brand === '기타' ? formData.customBrand : formData.brand;

      const { error } = await supabase.from('buyback_requests').insert({
        user_id: user?.id || null,
        brand: effectiveBrand,
        model: formData.model,
        reference_number: formData.ref || null,
        condition: formData.condition as Condition,
        year: formData.year || null,
        kits: formData.kits.length > 0 ? formData.kits : null,
        photos: photoUrls.length > 0 ? photoUrls : null,
        phone: formData.phone,
        location: formData.location || null,
      });

      if (error) throw error;

      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('submitRequest error:', error);
      set({ error: '신청에 실패했습니다', loading: false });
      return { success: false };
    }
  },
}));
