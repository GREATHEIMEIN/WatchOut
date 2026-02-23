// 시계거래 탭 화면 — 리스트 + 검색 + 필터 + 2컬럼 그리드

import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import TradeCard from '@/components/trade/TradeCard';
import AccessoryCard from '@/components/trade/AccessoryCard';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { ItemType, MockTradeItem, MockAccessoryItem } from '@/types';

const TABS: { key: ItemType; label: string }[] = [
  { key: 'watch', label: '시계' },
  { key: 'accessory', label: '시계용품' },
];

const TRADE_BRANDS = ['전체', 'Rolex', 'Omega', 'AP', 'Patek Philippe', 'Cartier', 'IWC', 'Panerai'];

const ACCESSORY_CATEGORIES = ['전체', '스트랩/브레이슬릿', '와인더/보관함', '공구/도구', '보호필름/케이스'];

export default function TradeScreen() {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    fetchTradePosts,
    getFilteredTradeItems,
    getFilteredAccessoryItems,
  } = useTradeStore();

  // Supabase에서 매물 데이터 로드
  useEffect(() => {
    fetchTradePosts(activeTab);
  }, [activeTab]);

  const filteredTrades = getFilteredTradeItems();
  const filteredAccessories = getFilteredAccessoryItems();
  const isWatch = activeTab === 'watch';

  const handlePressWatch = (item: MockTradeItem) => {
    router.push(`/trade/${item.id}`);
  };

  const handlePressAccessory = (item: MockAccessoryItem) => {
    router.push(`/trade/${item.id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="시계거래" />

      {/* 탭 */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 검색바 */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={COLORS.sub} />
            <TextInput
              style={styles.searchInput}
              placeholder={isWatch ? '브랜드, 모델명, 레퍼런스 검색' : '용품명 검색'}
              placeholderTextColor={COLORS.sub}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.sub} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 필터 — 시계 탭: 브랜드 / 용품 탭: 카테고리 */}
        {isWatch ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {TRADE_BRANDS.map((brand) => {
              const active = selectedBrand === brand;
              return (
                <TouchableOpacity
                  key={brand}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setSelectedBrand(brand)}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {brand}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {ACCESSORY_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* 매물 수 */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {isWatch ? filteredTrades.length : filteredAccessories.length}개 매물
          </Text>
        </View>

        {/* 로딩 중 */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>매물을 불러오는 중...</Text>
          </View>
        )}

        {/* 에러 */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchTradePosts(activeTab)}
            >
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2컬럼 그리드 */}
        {!loading && !error && (isWatch ? (
          filteredTrades.length > 0 ? (
            <View style={styles.gridContainer}>
              {filteredTrades.map((item) => (
                <View key={String(item.id)} style={styles.gridItem}>
                  <TradeCard item={item} onPress={() => handlePressWatch(item)} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={40} color={COLORS.sub} />
              <Text style={styles.emptyText}>매물이 없습니다</Text>
            </View>
          )
        ) : (
          filteredAccessories.length > 0 ? (
            <View style={styles.gridContainer}>
              {filteredAccessories.map((item) => (
                <View key={String(item.id)} style={styles.gridItem}>
                  <AccessoryCard item={item} onPress={() => handlePressAccessory(item)} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={40} color={COLORS.sub} />
              <Text style={styles.emptyText}>매물이 없습니다</Text>
            </View>
          )
        ))}
      </ScrollView>

      {/* FAB 매물 등록 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          console.log('[Trade] 매물 등록 버튼 클릭됨!');
          const { isLoggedIn } = useAuthStore.getState();
          console.log('[Trade] 로그인 상태:', isLoggedIn);

          if (!isLoggedIn) {
            console.log('[Trade] 비로그인 → 로그인 페이지로 이동');
            router.push('/auth/login');
            return;
          }

          console.log('[Trade] 로그인 상태 → /trade/create로 이동');
          router.push('/trade/create');
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>매물 등록</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // 탭
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.sub,
  },
  tabTextActive: {
    fontWeight: '700',
    color: COLORS.text,
  },
  // 스크롤
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // 검색
  searchSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.tag,
    borderRadius: RADIUS.button,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    padding: 0,
  },
  // 필터
  filterRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
    gap: 6,
  },
  filterChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: RADIUS.tag,
    backgroundColor: COLORS.tag,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: COLORS.text,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  // 매물 수
  countRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  // 그리드
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  gridItem: {
    width: '48%',
  },
  // 빈 상태
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sub,
  },
  // 로딩/에러 상태
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.sub,
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.sub,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.sm,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.button,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
