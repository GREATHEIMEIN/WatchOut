// 회원가입 화면

import { useState } from 'react';
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
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, SPACING, RADIUS } from '@/lib/constants';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const isValid =
    email.trim() &&
    password.length >= 8 &&
    password === passwordConfirm &&
    nickname.trim().length >= 2;

  const handleRegister = async () => {
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다');
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    // Nickname validation
    if (nickname.trim().length < 2) {
      setError('닉네임은 2자 이상이어야 합니다');
      return;
    }

    const { error: registerError } = await register(email, password, nickname);

    if (registerError) {
      setError(registerError);
      return;
    }

    // Success
    Alert.alert('가입 완료', '환영합니다! 로그인해주세요.', [
      { text: '확인', onPress: () => router.replace('/auth/login') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Header title="회원가입" onBack={() => router.back()} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 폼 */}
          <View style={styles.formSection}>
            {/* 이메일 */}
            <Text style={styles.inputLabel}>이메일</Text>
            <TextInput
              style={styles.inputField}
              placeholder="example@email.com"
              placeholderTextColor={COLORS.sub}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* 비밀번호 */}
            <Text style={styles.inputLabel}>비밀번호 (8자 이상)</Text>
            <TextInput
              style={styles.inputField}
              placeholder="8자 이상 입력"
              placeholderTextColor={COLORS.sub}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* 비밀번호 확인 */}
            <Text style={styles.inputLabel}>비밀번호 확인</Text>
            <TextInput
              style={styles.inputField}
              placeholder="비밀번호 재입력"
              placeholderTextColor={COLORS.sub}
              secureTextEntry
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
            />

            {/* 닉네임 */}
            <Text style={styles.inputLabel}>닉네임 (2자 이상)</Text>
            <TextInput
              style={styles.inputField}
              placeholder="닉네임 입력"
              placeholderTextColor={COLORS.sub}
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
            />

            {/* 에러 메시지 */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={COLORS.red} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* 가입하기 버튼 */}
            <TouchableOpacity
              style={[styles.submitButton, (!isValid || isLoading) && styles.submitButtonDisabled]}
              onPress={handleRegister}
              disabled={!isValid || isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? '가입 중...' : '가입하기'}
              </Text>
            </TouchableOpacity>

            {/* 둘러보기 버튼 */}
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.browseButtonText}>로그인 없이 둘러보기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingBottom: 40,
  },
  // 폼
  formSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
    marginBottom: 6,
    marginTop: SPACING.md,
  },
  inputField: {
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  // 에러
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    marginTop: SPACING.md,
    backgroundColor: '#FEF0F0',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    flex: 1,
  },
  // 가입 버튼
  submitButton: {
    paddingVertical: 16,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 둘러보기 버튼
  browseButton: {
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.sub,
  },
});
