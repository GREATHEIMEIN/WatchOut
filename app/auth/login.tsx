// 로그인 화면

import { useState } from 'react';
import {
  Alert,
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
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, SPACING, RADIUS } from '@/lib/constants';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    console.log('[Login] 로그인 시도');
    const { error: loginError } = await login(email, password);

    if (loginError) {
      console.log('[Login] 로그인 실패:', loginError);
      setError(loginError);
      return;
    }

    // Success - navigate to Home tab
    console.log('[Login] 로그인 성공 → 홈 탭으로 이동');
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 상단 여백 */}
        <View style={{ height: 60 }} />

        {/* 로고 + 타이틀 */}
        <View style={styles.logoSection}>
          <Ionicons name="watch-outline" size={48} color={COLORS.text} />
          <Text style={styles.appTitle}>WATCHOUT</Text>
          <Text style={styles.appSubtitle}>럭셔리 시계 거래 플랫폼</Text>
        </View>

        {/* 폼 섹션 */}
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
          <Text style={styles.inputLabel}>비밀번호</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="8자 이상 입력"
              placeholderTextColor={COLORS.sub}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.sub}
              />
            </TouchableOpacity>
          </View>

          {/* 에러 메시지 */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!email.trim() || !password.trim() || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim() || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Text>
          </TouchableOpacity>

          {/* 회원가입 링크 */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>계정이 없으신가요?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.signupLink}>회원가입</Text>
            </TouchableOpacity>
          </View>

          {/* 구분선 */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 카카오 로그인 (UI만) */}
          <TouchableOpacity
            style={styles.kakaoButton}
            onPress={() =>
              Alert.alert('준비 중', '카카오 로그인은 다음 업데이트에서 지원됩니다.')
            }
          >
            <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // 로고
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  appSubtitle: {
    fontSize: 13,
    color: COLORS.sub,
    marginTop: 4,
  },
  // 폼
  formSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: 40,
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
  // 비밀번호
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
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
  // 로그인 버튼
  loginButton: {
    paddingVertical: 16,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 회원가입 링크
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.lg,
  },
  signupText: {
    fontSize: 13,
    color: COLORS.sub,
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  // 구분선
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.sub,
  },
  // 카카오 버튼
  kakaoButton: {
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    backgroundColor: '#FEE500',
    alignItems: 'center',
  },
  kakaoButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
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
