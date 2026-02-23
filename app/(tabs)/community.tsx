// 커뮤니티 리스트 화면

import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import CommunityPostCard from '@/components/community/CommunityPostCard';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useCommunityStore } from '@/store/useCommunityStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { PostCategory } from '@/types';

const CATEGORIES: (PostCategory | '전체')[] = ['전체', '자유', '질문', '후기', '정보'];

export default function CommunityScreen() {
  const router = useRouter();
  const {
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    fetchPosts,
    getFilteredPosts,
  } = useCommunityStore();

  // Supabase에서 커뮤니티 게시글 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = getFilteredPosts();

  return (
    <View style={styles.container}>
      <Header title="커뮤니티" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 카테고리 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabs}
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 게시글 수 */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>{filtered.length}개 게시글</Text>
        </View>

        {/* 로딩 중 */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
          </View>
        )}

        {/* 에러 */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 게시글 리스트 */}
        {!loading && !error && (filtered.length > 0 ? (
          <View style={styles.listContainer}>
            {filtered.map((post, index) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onPress={() => router.push(`/community/${post.id}`)}
                showDivider={index < filtered.length - 1}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={40} color={COLORS.sub} />
            <Text style={styles.emptyText}>게시글이 없습니다</Text>
          </View>
        ))}
      </ScrollView>

      {/* FAB 글쓰기 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          console.log('[Community] 글쓰기 버튼 클릭됨!');
          const { isLoggedIn } = useAuthStore.getState();
          console.log('[Community] 로그인 상태:', isLoggedIn);

          if (!isLoggedIn) {
            console.log('[Community] 비로그인 → 로그인 페이지로 이동');
            router.push('/auth/login');
            return;
          }

          console.log('[Community] 로그인 상태 → /community/write로 이동');
          router.push('/community/write');
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // 카테고리 탭
  categoryTabs: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: RADIUS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.sub,
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 게시글 수
  countRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  // 스크롤
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // 리스트
  listContainer: {
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.card,
  },
  // 빈 상태
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sub,
  },
  // 로딩/에러 상태
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.sub,
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.sub,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.sm,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.button,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
