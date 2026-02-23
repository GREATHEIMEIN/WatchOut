// 관심 매물 화면 — 찜한 매물 리스트

import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import TradeCard from '@/components/trade/TradeCard';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { requireAuth } from '@/lib/authGuard';

export default function FavoritesScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { favoriteIds, fetchFavorites, toggleFavorite } = useFavoriteStore();
  const { tradeItems, fetchTradePosts } = useTradeStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
      if (tradeItems.length === 0) fetchTradePosts('watch');
    }
  }, [isLoggedIn]);

  // 찜한 시계 매물 필터링
  const favoriteItems = tradeItems.filter((item) => favoriteIds.includes(item.id));

  const handleFavoriteToggle = (tradePostId: number) => {
    if (!requireAuth(router, isLoggedIn, '관심 매물')) return;
    toggleFavorite(tradePostId);
  };

  return (
    <View style={styles.container}>
      <Header title="관심 매물" onBack={() => router.back()} right={<View />} />

      {!isLoggedIn ? (
        // 비로그인 상태
        <View style={styles.centerBox}>
          <Ionicons name="heart-outline" size={44} color={COLORS.border} />
          <Text style={styles.emptyTitle}>로그인이 필요합니다</Text>
          <Text style={styles.emptyDesc}>로그인 후 관심 매물을 관리하세요</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      ) : favoriteItems.length === 0 ? (
        // 빈 상태
        <View style={styles.centerBox}>
          <Ionicons name="heart-outline" size={44} color={COLORS.border} />
          <Text style={styles.emptyTitle}>관심 매물이 없습니다</Text>
          <Text style={styles.emptyDesc}>
            시계거래에서 ❤️를 눌러{'\n'}관심 매물을 추가하세요
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/trade')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>시계거래 보러가기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 관심 매물 목록
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.countText}>{favoriteItems.length}개 관심 매물</Text>
          <View style={styles.gridContainer}>
            {favoriteItems.map((item) => (
              <View key={String(item.id)} style={styles.gridItem}>
                <TradeCard
                  item={item}
                  onPress={() => router.push(`/trade/${item.id}`)}
                  isFavorite={favoriteIds.includes(item.id)}
                  onFavoritePress={() => handleFavoriteToggle(item.id)}
                />
              </View>
            ))}
          </View>
          <View style={{ height: 40 }} />
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
  scrollContent: {
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
    paddingBottom: SPACING.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  gridItem: {
    width: '48%',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.sub,
    textAlign: 'center',
    lineHeight: 20,
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
});
