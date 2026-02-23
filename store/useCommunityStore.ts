// 커뮤니티 게시판 상태 관리 Store

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { formatRelativeTime } from '@/lib/format';
import { useAuthStore } from './useAuthStore';
import type { MockCommunityPost, PostCategory } from '@/types';

interface CommunityState {
  // 데이터
  posts: MockCommunityPost[];

  // 필터 상태
  selectedCategory: PostCategory | '전체';
  searchQuery: string;

  // 로딩 & 에러
  loading: boolean;
  error: string | null;

  // 액션
  setPosts: (posts: MockCommunityPost[]) => void;
  setSelectedCategory: (category: PostCategory | '전체') => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Supabase 액션
  fetchPosts: () => Promise<void>;
  createPost: (
    title: string,
    category: PostCategory,
    content: string,
  ) => Promise<{ success: boolean }>;

  // 필터링
  getFilteredPosts: () => MockCommunityPost[];
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  // 초기 상태
  posts: [],
  selectedCategory: '전체',
  searchQuery: '',
  loading: false,
  error: null,

  // 액션
  setPosts: (posts) => set({ posts }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  /**
   * Supabase에서 커뮤니티 게시글 조회
   * community_posts + users LEFT JOIN
   */
  fetchPosts: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`*, users:user_id(nickname, level)`)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const posts: MockCommunityPost[] = (data || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        author: post.users?.nickname || 'Unknown',
        comments: post.comments_count,
        likes: post.likes_count,
        time: formatRelativeTime(post.created_at),
        category: post.category,
        pinned: post.pinned,
      }));

      set({ posts, loading: false });
    } catch (error) {
      console.error('fetchPosts error:', error);
      set({ error: '게시글을 불러올 수 없습니다', loading: false });
    }
  },

  /**
   * 커뮤니티 게시글 작성 (CREATE)
   */
  createPost: async (title, category, content) => {
    const { user } = useAuthStore.getState();
    if (!user) return { success: false };

    set({ loading: true });

    try {
      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        category,
        title,
        content,
      });

      if (error) throw error;

      // 리스트 새로고침
      await get().fetchPosts();
      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('createPost error:', error);
      set({ loading: false });
      return { success: false };
    }
  },

  // 필터링 로직
  getFilteredPosts: () => {
    let filtered = get().posts;
    const { selectedCategory, searchQuery } = get();

    // 1. 카테고리 필터 (공지는 항상 포함)
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory || p.pinned === true,
      );
    }

    // 2. 검색 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q),
      );
    }

    // 3. 정렬 (공지는 항상 맨 위)
    return filtered.sort((a, b) => {
      // 공지글 우선
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // 나머지는 최신순 (Mock에서는 id 역순)
      return b.id - a.id;
    });
  },
}));
