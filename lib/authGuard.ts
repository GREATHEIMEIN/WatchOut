// 로그인 가드 유틸리티 — 앱 전체에서 일관된 인증 체크에 사용

import { Alert } from 'react-native';
import type { Router } from 'expo-router';

/**
 * 로그인 여부 확인 후, 비로그인 시 Alert + 로그인 화면 유도
 * @returns true (로그인 상태) | false (비로그인 상태)
 */
export const requireAuth = (
  router: Router,
  isLoggedIn: boolean,
  label = '이 기능',
): boolean => {
  if (!isLoggedIn) {
    Alert.alert(
      '로그인 필요',
      `${label}은(는) 로그인 후 이용 가능합니다.`,
      [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.push('/auth/login') },
      ],
    );
    return false;
  }
  return true;
};
