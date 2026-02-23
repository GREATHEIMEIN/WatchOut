// 프로필 편집 화면

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, uploadAvatar } = useAuthStore();

  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다. 설정에서 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarLoading(true);
      const url = await uploadAvatar(result.assets[0].uri);
      setAvatarLoading(false);
      if (url) {
        setAvatarPreview(url);
      } else {
        Alert.alert('오류', '사진 업로드에 실패했습니다.');
      }
    }
  };

  const handleSave = async () => {
    if (nickname.trim().length < 2) {
      Alert.alert('닉네임 오류', '닉네임은 2자 이상 입력해주세요.');
      return;
    }

    setSaving(true);
    const { success } = await updateProfile(
      nickname.trim(),
      bio.trim() || null,
      avatarPreview,
    );
    setSaving(false);

    if (success) {
      Alert.alert('저장 완료', '프로필이 저장되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('저장 실패', '프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 편집</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* 아바타 영역 */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              {avatarPreview ? (
                <Image source={{ uri: avatarPreview }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-circle" size={88} color={COLORS.sub} />
              )}
              {avatarLoading && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={handlePickAvatar}
              disabled={avatarLoading}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={16} color={COLORS.text} />
              <Text style={styles.avatarButtonText}>사진 변경</Text>
            </TouchableOpacity>
          </View>

          {/* 닉네임 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>닉네임 *</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor={COLORS.sub}
              maxLength={20}
              autoCorrect={false}
            />
            <Text style={styles.fieldHint}>2~20자 이내로 입력해주세요</Text>
          </View>

          {/* 한줄 소개 */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>한줄 소개</Text>
              <Text style={styles.charCount}>{bio.length}/50</Text>
            </View>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="나를 소개해보세요"
              placeholderTextColor={COLORS.sub}
              maxLength={50}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* 저장 버튼 */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>저장</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  // 아바타
  avatarSection: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.base,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tag,
  },
  avatarImage: {
    width: 88,
    height: 88,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.base,
    paddingVertical: 8,
    borderRadius: RADIUS.tag,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  avatarButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  // 입력 필드
  fieldGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.sub,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.sub,
  },
  fieldHint: {
    fontSize: 11,
    color: COLORS.sub,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  bioInput: {
    height: 80,
    paddingTop: 12,
  },
  // 저장 버튼
  saveButton: {
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
