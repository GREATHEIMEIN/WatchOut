// 커뮤니티 게시글 카드 컴포넌트

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '@/lib/constants';
import { getCategoryColor, getCategoryTextColor } from '@/lib/utils';
import type { MockCommunityPost } from '@/types';

interface CommunityPostCardProps {
  post: MockCommunityPost;
  onPress: () => void;
  showDivider?: boolean;
}

export default function CommunityPostCard({ post, onPress, showDivider = false }: CommunityPostCardProps) {
  // 공지글은 "공지" 배지, 아니면 카테고리 배지
  const badgeText = post.pinned ? '공지' : post.category;
  const badgeBgColor = post.pinned ? getCategoryColor('공지') : getCategoryColor(post.category);
  const badgeTextColor = post.pinned ? getCategoryTextColor('공지') : getCategoryTextColor(post.category);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        {/* 카테고리 배지 */}
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
        </View>

        {/* 제목 */}
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>

        {/* 메타정보 */}
        <View style={styles.meta}>
          <Text style={styles.metaText}>{post.author}</Text>
          <Text style={styles.metaText}>💬 {post.comments}</Text>
          <Text style={styles.metaText}>❤️ {post.likes}</Text>
          <Text style={styles.metaText}>{post.time}</Text>
        </View>
      </TouchableOpacity>

      {/* 구분선 */}
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    gap: 10,
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
