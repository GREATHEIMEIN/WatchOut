// 인증 상태 관리

import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, nickname: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  updateProfile: (nickname: string, bio: string | null, avatarUrl: string | null) => Promise<{ success: boolean }>;
  uploadAvatar: (imageUri: string) => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoggedIn: false,
  isLoading: false,

  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setSession: (session) => set({ session }),

  // 앱 시작 시 세션 복원
  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        // Fetch user profile from public.users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          user: profile,
          isLoggedIn: true,
        });
      }
    } catch (error) {
      console.error('Session restore failed:', error);
    } finally {
      set({ isLoading: false });
    }

    // Listen to auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
      if (!session) {
        set({ user: null, isLoggedIn: false });
      }
    });
  },

  // 회원가입
  register: async (email, password, nickname) => {
    set({ isLoading: true });
    try {
      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname }, // Metadata
        },
      });

      if (error) throw error;

      // 2. Profile auto-created by trigger (00001_create_tables.sql)
      // But we need to update nickname
      if (data.user) {
        await supabase
          .from('users')
          .update({ nickname })
          .eq('id', data.user.id);
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || '회원가입 실패' };
    } finally {
      set({ isLoading: false });
    }
  },

  // 로그인 (테스트용 더미 로그인)
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      console.log('[Auth] 로그인 시도:', email);

      // Supabase 로그인 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        console.log('[Auth] Supabase 로그인 성공');
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          session: data.session,
          user: profile,
          isLoggedIn: true,
        });

        return { error: null };
      }

      // Supabase 로그인 실패 시 더미 유저로 로그인 처리
      console.log('[Auth] Supabase 로그인 실패 → 더미 유저로 로그인');
      const dummyUser: User = {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        email: email,
        nickname: '테스트유저',
        level: 1,
        avatarUrl: null,
        role: 'user',
        bio: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set({
        session: null,
        user: dummyUser,
        isLoggedIn: true,
      });

      return { error: null };
    } catch (error: any) {
      console.error('[Auth] 로그인 에러:', error);
      // 에러 발생해도 더미 유저로 로그인
      const dummyUser: User = {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        email: email,
        nickname: '테스트유저',
        level: 1,
        avatarUrl: null,
        role: 'user',
        bio: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set({
        session: null,
        user: dummyUser,
        isLoggedIn: true,
      });

      return { error: null };
    } finally {
      set({ isLoading: false });
    }
  },

  // 로그아웃
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isLoggedIn: false });
  },

  // 프로필 업데이트
  updateProfile: async (nickname, bio, avatarUrl) => {
    const { user } = get();
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('users')
        .update({ nickname, bio, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      set({ user: { ...user, nickname, bio, avatarUrl } });
      return { success: true };
    } catch (error) {
      console.error('updateProfile error:', error);
      return { success: false };
    }
  },

  // 아바타 이미지 업로드
  uploadAvatar: async (imageUri) => {
    const { user } = get();
    if (!user) return null;

    try {
      const fileName = `${user.id}/avatar.jpg`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, imageUri as any, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('uploadAvatar error:', error);
      return null;
    }
  },
}));
