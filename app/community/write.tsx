// 커뮤니티 글쓰기 화면

import { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useCommunityStore } from '@/store/useCommunityStore';
import type { PostCategory } from '@/types';

const CATEGORIES: PostCategory[] = ['자유', '질문', '후기', '정보'];

export default function CommunityWriteScreen() {
  const router = useRouter();

  const [category, setCategory] = useState<PostCategory | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isValid = category && title.trim() && content.trim();

  // 로그인 체크
  useEffect(() => {
    const { isLoggedIn } = useAuthStore.getState();
    if (!isLoggedIn) {
      Alert.alert(
        '로그인 필요',
        '글쓰기는 로그인 후 이용 가능합니다.',
        [
          { text: '취소', onPress: () => router.back() },
          { text: '로그인', onPress: () => router.replace('/auth/login') },
        ]
      );
    }
  }, []);

  const handleSubmit = async () => {
    if (!isValid) {
      console.log('[Write] 폼 유효성 검사 실패');
      return;
    }

    console.log('[Write] 게시글 등록 시작:', { title, category, contentLength: content.length });

    const { createPost } = useCommunityStore.getState();
    const { success } = await createPost(title, category as PostCategory, content);

    console.log('[Write] 등록 결과:', success);

    if (success) {
      Alert.alert('등록 완료', '게시글이 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            console.log('[Write] 커뮤니티 리스트로 돌아가기');
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert('등록 실패', '게시글 작성 중 문제가 발생했습니다.');
    }
  };

  const handleImagePress = () => {
    Alert.alert('준비 중', '이미지 첨부는 다음 업데이트에서 지원됩니다.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="글쓰기"
        onBack={() => router.back()}
        right={
          <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
            <Text style={[styles.submitText, !isValid && styles.submitTextDisabled]}>
              등록
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 카테고리 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>카테고리 *</Text>
          <View style={styles.categoryButtons}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextActive]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 제목 입력 */}
        <View style={styles.section}>
          <Text style={styles.label}>제목 *</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            placeholderTextColor={COLORS.sub}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* 본문 입력 */}
        <View style={styles.section}>
          <Text style={styles.label}>내용 *</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요"
            placeholderTextColor={COLORS.sub}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />
          <Text style={styles.charCount}>
            {content.length} / 2000
          </Text>
        </View>

        {/* 이미지 첨부 */}
        <View style={styles.section}>
          <Text style={styles.label}>이미지 (선택)</Text>
          <View style={styles.imageSlots}>
            <TouchableOpacity
              style={styles.imageSlot}
              onPress={handleImagePress}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={24} color={COLORS.sub} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageSlot}
              onPress={handleImagePress}
              activeOpacity={0.7}
            >
              <Text style={styles.imageSlotText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageSlot}
              onPress={handleImagePress}
              activeOpacity={0.7}
            >
              <Text style={styles.imageSlotText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 등록 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>등록하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    gap: SPACING.xl,
    paddingBottom: 100,
  },
  // 섹션
  section: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
  },
  // 카테고리
  categoryButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  categoryButtonActive: {
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: COLORS.tag,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.sub,
  },
  categoryButtonTextActive: {
    fontWeight: '700',
    color: COLORS.text,
  },
  // 제목
  titleInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
  },
  // 본문
  contentInput: {
    height: 200,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: COLORS.sub,
  },
  // 이미지
  imageSlots: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  imageSlot: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },
  imageSlotText: {
    fontSize: 24,
    color: COLORS.sub,
  },
  // 하단 바
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Header 우측 등록 텍스트
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
  },
  submitTextDisabled: {
    color: COLORS.sub,
  },
});
