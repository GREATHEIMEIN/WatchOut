// 내 게시글 목록 화면

import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCommunityStore } from '@/store/useCommunityStore';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/format';
import { getCategoryColor, getCategoryTextColor } from '@/lib/utils';

export default function MyPostsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { myPosts, myPostsLoading, fetchMyPosts } = useCommunityStore();

  useEffect(() => {
    if (user) fetchMyPosts(user.id);
  }, []);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 게시글</Text>
        <View style={{ width: 26 }} />
      </View>

      {myPostsLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={COLORS.sub} />
        </View>
      ) : myPosts.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="chatbubble-outline" size={44} color={COLORS.border} />
          <Text style={styles.emptyTitle}>작성한 게시글이 없습니다</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/community/write')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>글쓰기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {myPosts.map((post, index) => (
            <View key={post.id}>
              <TouchableOpacity
                style={styles.postRow}
                onPress={() => router.push(`/community/${post.id}`)}
                activeOpacity={0.7}
              >
                {/* 카테고리 배지 */}
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                  <Text style={[styles.categoryText, { color: getCategoryTextColor(post.category) }]}>
                    {post.category}
                  </Text>
                </View>
                {/* 제목 */}
                <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                {/* 메타 */}
                <View style={styles.postMeta}>
                  <Text style={styles.metaText}>💬 {post.commentsCount}</Text>
                  <Text style={styles.metaText}>❤️ {post.likesCount}</Text>
                  <Text style={styles.metaText}>{formatRelativeTime(post.createdAt)}</Text>
                </View>
              </TouchableOpacity>
              {index < myPosts.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: 15,
    color: COLORS.sub,
  },
  ctaButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
    paddingVertical: 11,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    padding: SPACING.lg,
  },
  postRow: {
    paddingVertical: SPACING.md,
    gap: 5,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  postMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.sub,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
