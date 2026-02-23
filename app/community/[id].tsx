// 커뮤니티 게시글 상세 화면

import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { getCategoryColor, getCategoryTextColor } from '@/lib/utils';
import { useCommunityStore } from '@/store/useCommunityStore';

export default function CommunityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts } = useCommunityStore();

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // 게시글 찾기
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <View style={styles.container}>
        <Header title="게시글" onBack={() => router.back()} />
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.sub} />
          <Text style={styles.notFoundText}>게시글을 찾을 수 없습니다</Text>
        </View>
      </View>
    );
  }

  const badgeText = post.pinned ? '공지' : post.category;
  const badgeBgColor = post.pinned ? getCategoryColor('공지') : getCategoryColor(post.category);
  const badgeTextColor = post.pinned ? getCategoryTextColor('공지') : getCategoryTextColor(post.category);

  const handleLike = () => {
    setLiked(!liked);
    Alert.alert('준비 중', '좋아요 기능은 다음 업데이트에서 제공됩니다.');
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    Alert.alert('준비 중', '댓글 기능은 다음 업데이트에서 제공됩니다.');
    setCommentText('');
  };

  return (
    <View style={styles.container}>
      <Header title="" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 카테고리 배지 */}
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
        </View>

        {/* 제목 */}
        <Text style={styles.title}>{post.title}</Text>

        {/* 작성자 정보 */}
        <View style={styles.authorRow}>
          {/* 아바타 placeholder */}
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={COLORS.sub} />
          </View>

          <View style={styles.authorInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.authorLevel}>Lv.5</Text>
            </View>
            <Text style={styles.authorTime}>{post.time}</Text>
          </View>
        </View>

        {/* 본문 (Mock에는 없으므로 placeholder) */}
        <Text style={styles.content}>
          {post.title}에 대한 상세 내용이 여기에 표시됩니다.{'\n\n'}
          실제 앱에서는 Supabase에서 content 필드를 가져와 표시합니다.{'\n\n'}
          현재는 Mock 데이터를 사용하고 있어 본문 내용이 없습니다.
        </Text>

        {/* 좋아요 버튼 */}
        <TouchableOpacity style={styles.likeButton} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? COLORS.red : COLORS.sub}
          />
          <Text style={[styles.likeText, liked && { color: COLORS.red }]}>
            {liked ? post.likes + 1 : post.likes}
          </Text>
        </TouchableOpacity>

        {/* 댓글 섹션 */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>댓글 {post.comments}</Text>
          <View style={styles.commentPlaceholder}>
            <Text style={styles.commentPlaceholderText}>댓글 기능은 다음 업데이트에서 제공됩니다</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 댓글 입력창 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요"
          placeholderTextColor={COLORS.sub}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendComment}
          disabled={!commentText.trim()}
        >
          <Ionicons name="send" size={18} color={commentText.trim() ? COLORS.accent : COLORS.sub} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
    gap: SPACING.base,
  },
  // 카테고리 배지
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // 제목
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 28,
  },
  // 작성자
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  authorLevel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
  },
  authorTime: {
    fontSize: 11,
    color: COLORS.sub,
  },
  // 본문
  content: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  // 좋아요
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  likeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.sub,
  },
  // 댓글 섹션
  commentSection: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  commentPlaceholder: {
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
  },
  commentPlaceholderText: {
    fontSize: 13,
    color: COLORS.sub,
  },
  // 댓글 입력창
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  commentInput: {
    flex: 1,
    maxHeight: 80,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.button,
    fontSize: 14,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  // 404
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.sub,
  },
});
