// 즉시매입 신청 폼 상태 관리

import { create } from 'zustand';
import type { Condition } from '@/types';

interface BuybackFormData {
  brand: string;
  model: string;
  ref: string;
  year: string;
  condition: Condition | '';
  kits: string[];
  photos: string[];
  phone: string;
  location: string;
}

interface BuybackState {
  step: number;
  formData: BuybackFormData;
  done: boolean;
  setStep: (step: number) => void;
  setFormField: <K extends keyof BuybackFormData>(key: K, value: BuybackFormData[K]) => void;
  toggleKit: (kit: string) => void;
  setDone: (done: boolean) => void;
  reset: () => void;
  isStepValid: () => boolean;
}

const INITIAL_FORM: BuybackFormData = {
  brand: '',
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

  reset: () => set({ step: 1, formData: { ...INITIAL_FORM }, done: false }),

  isStepValid: () => {
    const { step, formData } = get();
    switch (step) {
      case 1: return formData.brand !== '';
      case 2: return formData.model.trim() !== '';
      case 3: return formData.condition !== '';
      case 4: return true; // 사진은 선택사항
      case 5: return formData.phone.trim() !== '';
      default: return false;
    }
  },
}));
