// 교환거래 신청 폼 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';

interface ExchangeFormData {
  // Step 1 — 내 시계
  myBrand: string;
  myCustomBrand: string;    // '기타' 선택 시 직접 입력
  myModel: string;
  myCondition: string;      // 'S' | 'A' | 'B' | 'C'
  // Step 2 — 원하는 시계
  wantedBrand: string;
  wantedCustomBrand: string;
  wantedModel: string;
  wantedCondition: string;
  wantedNote: string;
  // Step 3 — 사진 + 상세
  photos: string[];
  year: string;
  kits: string;             // '풀세트' | '풀박스' | '시계만'
  note: string;
  // Step 4 — 연락처
  phone: string;
  kakaoId: string;
  contactMethod: string;    // '전화' | '문자' | '카카오톡'
  agreePrivacy: boolean;
}

interface ExchangeState {
  step: number;
  formData: ExchangeFormData;
  done: boolean;
  loading: boolean;
  error: string | null;
  setStep: (step: number) => void;
  setFormField: <K extends keyof ExchangeFormData>(key: K, value: ExchangeFormData[K]) => void;
  setDone: (done: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  isStepValid: () => boolean;
  submitRequest: () => Promise<{ success: boolean }>;
  uploadPhotos: (uris: string[]) => Promise<string[]>;
}

const INITIAL_FORM: ExchangeFormData = {
  myBrand: '',
  myCustomBrand: '',
  myModel: '',
  myCondition: '',
  wantedBrand: '',
  wantedCustomBrand: '',
  wantedModel: '',
  wantedCondition: '',
  wantedNote: '',
  photos: [],
  year: '',
  kits: '',
  note: '',
  phone: '',
  kakaoId: '',
  contactMethod: '전화',
  agreePrivacy: false,
};

export const useExchangeStore = create<ExchangeState>((set, get) => ({
  step: 1,
  formData: { ...INITIAL_FORM },
  done: false,
  loading: false,
  error: null,

  setStep: (step) => set({ step }),

  setFormField: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  setDone: (done) => set({ done }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () => set({ step: 1, formData: { ...INITIAL_FORM }, done: false, error: null }),

  isStepValid: () => {
    const { step, formData } = get();
    switch (step) {
      case 1:
        // 내 시계: 브랜드 + 모델 + 컨디션 필수
        if (formData.myBrand === '') return false;
        if (formData.myBrand === '기타' && formData.myCustomBrand.trim() === '') return false;
        if (formData.myModel.trim() === '') return false;
        return formData.myCondition !== '';
      case 2:
        // 원하는 시계: 브랜드 + 모델 필수
        if (formData.wantedBrand === '') return false;
        if (formData.wantedBrand === '기타' && formData.wantedCustomBrand.trim() === '') return false;
        return formData.wantedModel.trim() !== '';
      case 3:
        // 사진+상세: 선택사항 → 항상 통과
        return true;
      case 4:
        // 연락처 + 개인정보 동의 필수
        return formData.phone.trim() !== '' && formData.agreePrivacy;
      default:
        return false;
    }
  },

  /**
   * Storage에 사진 업로드 (buyback-images 버킷 공유 사용)
   */
  uploadPhotos: async (uris: string[]) => {
    const { user } = useAuthStore.getState();
    const userId = user?.id || 'anonymous';

    const uploadedUrls: string[] = [];

    for (const uri of uris) {
      try {
        const fileName = `${userId}/${Date.now()}_${Math.random()}.jpg`;
        const { error } = await supabase.storage
          .from('buyback-images')
          .upload(fileName, uri as any, { upsert: true, contentType: 'image/jpeg' });

        if (error) throw error;

        const { data } = supabase.storage.from('buyback-images').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      } catch (err) {
        console.error('exchange uploadPhotos error:', err);
      }
    }

    return uploadedUrls;
  },

  /**
   * 교환거래 신청 제출
   */
  submitRequest: async () => {
    const { formData } = get();
    const { user } = useAuthStore.getState();

    set({ loading: true, error: null });

    try {
      const effectiveMyBrand =
        formData.myBrand === '기타' ? formData.myCustomBrand : formData.myBrand;
      const effectiveWantedBrand =
        formData.wantedBrand === '기타' ? formData.wantedCustomBrand : formData.wantedBrand;

      const { error } = await supabase.from('buyback_requests').insert({
        user_id: user?.id || null,
        type: 'exchange',
        brand: effectiveMyBrand,
        model: formData.myModel,
        condition: formData.myCondition,
        year: formData.year || null,
        kits: formData.kits ? [formData.kits] : null,
        photos: formData.photos.length > 0 ? formData.photos : null,
        phone: formData.phone,
        kakao_id: formData.kakaoId || null,
        contact_method: formData.contactMethod,
        wanted_brand: effectiveWantedBrand,
        wanted_model: formData.wantedModel,
        wanted_condition: formData.wantedCondition || null,
        wanted_note: formData.wantedNote || null,
      });

      if (error) throw error;

      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('exchange submitRequest error:', error);
      set({ error: '신청에 실패했습니다', loading: false });
      return { success: false };
    }
  },
}));
