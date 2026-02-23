// MY 탭 화면 — 리디자인 v2

import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { requireAuth } from '@/lib/authGuard';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

export default function MyPageScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { totalUnread, fetchChatRooms } = useChatStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchChatRooms();
    }
  }, [isLoggedIn]);
  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="MY" dark />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 프로필 카드 */}
        {isLoggedIn && user ? (
          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                {user.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person-circle" size={64} color={COLORS.sub} />
                )}
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileName}>{user.nickname}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>Lv.{user.level}</Text>
                  </View>
                </View>
                <Text style={styles.profileBio} numberOfLines={2}>
                  {user.bio ?? '소개를 입력해주세요'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/mypage/edit-profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.editButtonText}>프로필 편집</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginCard}>
            <Ionicons name="person-circle-outline" size={52} color={COLORS.sub} />
            <Text style={styles.loginTitle}>로그인이 필요합니다</Text>
            <Text style={styles.loginSub}>로그인하고 모든 기능을 이용하세요</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>로그인하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 나의 활동 섹션 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>나의 활동</Text>
          <View style={styles.menuCard}>

            {/* 채팅 */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => requireAuth(router, isLoggedIn, '채팅') && router.push('/chat')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="chatbox-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>채팅</Text>
              </View>
              <View style={styles.menuItemRight}>
                {totalUnread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>
                      {totalUnread > 99 ? '99+' : String(totalUnread)}
                    </Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => requireAuth(router, isLoggedIn, '내 컬렉션') && router.push('/collection')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="watch-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>내 컬렉션</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => requireAuth(router, isLoggedIn, '내 매물') && router.push('/mypage/my-trades')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="pricetag-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>내 매물</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => requireAuth(router, isLoggedIn, '내 게시글') && router.push('/mypage/my-posts')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="chatbubble-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>내 게시글</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => requireAuth(router, isLoggedIn, '매입/교환 내역') && router.push('/mypage/my-requests')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="receipt-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>매입/교환 내역</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => requireAuth(router, isLoggedIn, '관심 매물') && router.push('/mypage/favorites')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="heart-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>관심 매물</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

          </View>
        </View>

        {/* 설정 섹션 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuCard}>

            {/* 알림 설정 — 설정 페이지로 이동 */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => router.push('/mypage/notification-settings')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>알림 설정</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => Alert.alert('이용약관', 'WATCHOUT 이용약관 페이지는 준비 중입니다.')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="document-text-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>이용약관</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => Alert.alert('개인정보처리방침', '개인정보처리방침 페이지는 준비 중입니다.')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>개인정보처리방침</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => Alert.alert('앱 정보', 'WATCHOUT v1.0.0\n럭셔리 시계 시세 · 매입 · 거래 플랫폼')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="information-circle-outline" size={22} color={COLORS.text} />
                <Text style={styles.menuItemText}>앱 정보</Text>
              </View>
              <Text style={styles.versionText}>v1.0.0</Text>
            </TouchableOpacity>

            {isLoggedIn ? (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
                  <Text style={[styles.menuItemText, { color: COLORS.red }]}>로그아웃</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/auth/login')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name="log-in-outline" size={22} color={COLORS.accent} />
                  <Text style={[styles.menuItemText, { color: COLORS.accent }]}>로그인하기</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
              </TouchableOpacity>
            )}

          </View>
        </View>

        <View style={{ height: 100 }} />
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
    padding: SPACING.lg,
    gap: SPACING.base,
  },
  // 프로필 카드 (로그인)
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    gap: SPACING.md,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  levelBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileBio: {
    fontSize: 13,
    color: COLORS.sub,
    lineHeight: 18,
  },
  editButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  // 로그인 유도 카드
  loginCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  loginSub: {
    fontSize: 13,
    color: COLORS.sub,
  },
  loginButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 메뉴 공통
  menuSection: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.sub,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: SPACING.base,
    minHeight: 52,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  versionText: {
    fontSize: 13,
    color: COLORS.sub,
  },
});
