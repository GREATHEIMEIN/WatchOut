// MY 탭 화면

import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

interface MenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function MyPageScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleCollection = () => {
    if (!isLoggedIn) {
      Alert.alert(
        '로그인 필요',
        '내 컬렉션 기능은 로그인 후 이용 가능합니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인', onPress: () => router.push('/auth/login') },
        ]
      );
      return;
    }
    router.push('/collection');
  };

  const handleAlert = (menu: string) => {
    if (!isLoggedIn) {
      Alert.alert(
        '로그인 필요',
        `${menu} 기능은 로그인 후 이용 가능합니다.`,
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인', onPress: () => router.push('/auth/login') },
        ]
      );
      return;
    }
    Alert.alert('준비 중', `${menu} 기능은 다음 업데이트에서 제공됩니다.`);
  };

  // 활동 메뉴
  const ACTIVITY_MENU: MenuItem[] = [
    {
      label: '내 매물 관리',
      icon: 'pricetag-outline',
      onPress: () => handleAlert('내 매물 관리'),
    },
    {
      label: '매입 신청 내역',
      icon: 'receipt-outline',
      onPress: () => handleAlert('매입 신청 내역'),
    },
    {
      label: '메시지함',
      icon: 'mail-outline',
      onPress: () => handleAlert('메시지함'),
    },
    {
      label: '관심 매물',
      icon: 'heart-outline',
      onPress: () => handleAlert('관심 매물'),
    },
    {
      label: '커뮤니티 내 글',
      icon: 'chatbubble-outline',
      onPress: () => handleAlert('커뮤니티 내 글'),
    },
  ];

  // 설정 메뉴
  const SETTINGS_MENU: MenuItem[] = [
    {
      label: '알림 설정',
      icon: 'notifications-outline',
      onPress: () => handleAlert('알림 설정'),
    },
    {
      label: '언어 설정',
      icon: 'language-outline',
      onPress: () => handleAlert('언어 설정'),
    },
    {
      label: '앱 정보',
      icon: 'information-circle-outline',
      onPress: () => handleAlert('앱 정보'),
    },
    {
      label: isLoggedIn ? '로그아웃' : '로그인',
      icon: 'log-out-outline',
      onPress: async () => {
        if (isLoggedIn) {
          Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            {
              text: '로그아웃',
              style: 'destructive',
              onPress: async () => {
                await logout();
                Alert.alert('로그아웃 완료');
              },
            },
          ]);
        } else {
          router.push('/auth/login');
        }
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="MY" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        {isLoggedIn && user ? (
          <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
            <View style={styles.avatar}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={28} color={COLORS.sub} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.nickname}</Text>
              <Text style={styles.profileLevel}>Lv.{user.level}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={COLORS.sub} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>손님</Text>
              <Text style={styles.profileLevel}>Lv.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.sub} />
          </TouchableOpacity>
        )}

        {/* 내 컬렉션 프로모션 배너 */}
        <TouchableOpacity
          style={styles.collectionBanner}
          onPress={handleCollection}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
            <Text style={{ fontSize: 28 }}>⌚</Text>
            <View>
              <Text style={styles.collectionTitle}>내 컬렉션</Text>
              <Text style={styles.collectionSubtitle}>총 자산가치 확인하기</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.sub} />
        </TouchableOpacity>

        {/* 활동 섹션 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>활동</Text>
          <View style={styles.menuCard}>
            {ACTIVITY_MENU.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < ACTIVITY_MENU.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={20} color={COLORS.text} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 설정 섹션 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuCard}>
            {SETTINGS_MENU.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < SETTINGS_MENU.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={20} color={COLORS.text} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
              </TouchableOpacity>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
    gap: SPACING.base,
  },
  // 프로필 카드
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.base,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 56,
    height: 56,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileLevel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  // 컬렉션 배너
  collectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    backgroundColor: '#FFF4E6',
    borderRadius: RADIUS.card,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  collectionSubtitle: {
    fontSize: 12,
    color: COLORS.sub,
  },
  // 메뉴 섹션
  menuSection: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
    paddingHorizontal: 4,
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
});
