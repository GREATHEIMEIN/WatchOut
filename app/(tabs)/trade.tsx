// 시계거래 탭 화면 — 리스트 + 검색 + 필터 + 2컬럼 그리드

import { useEffect } from 'react';
import {
  FlatList,
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
import { MOCK_TRADE_ITEMS, MOCK_ACCESSORY_ITEMS } from '@/lib/mockData';
import { useTradeStore } from '@/store/useTradeStore';
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
    setTradeItems,
    setAccessoryItems,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    getFilteredTradeItems,
    getFilteredAccessoryItems,
  } = useTradeStore();

  // Mock 데이터 로드
  useEffect(() => {
    setTradeItems(MOCK_TRADE_ITEMS);
    setAccessoryItems(MOCK_ACCESSORY_ITEMS);
  }, [setTradeItems, setAccessoryItems]);

  const filteredTrades = getFilteredTradeItems();
  const filteredAccessories = getFilteredAccessoryItems();
  const isWatch = activeTab === 'watch';

  const handlePressWatch = (item: MockTradeItem) => {
    router.push(`/trade/${item.id}`);
  };

  const handlePressAccessory = (item: MockAccessoryItem) => {
    router.push(`/trade/${item.id}`);
  };

  // 시계 목록 렌더러
  const renderTradeItem = ({ item }: { item: MockTradeItem }) => (
    <TradeCard item={item} onPress={() => handlePressWatch(item)} />
  );

  // 용품 목록 렌더러
  const renderAccessoryItem = ({ item }: { item: MockAccessoryItem }) => (
    <AccessoryCard item={item} onPress={() => handlePressAccessory(item)} />
  );

  // 빈 상태
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={40} color={COLORS.sub} />
      <Text style={styles.emptyText}>매물이 없습니다</Text>
    </View>
  );

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

      {/* 2컬럼 그리드 */}
      {isWatch ? (
        <FlatList
          style={{ flex: 1 }}
          data={filteredTrades}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTradeItem}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredAccessories}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderAccessoryItem}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* FAB 매물 등록 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/trade/create')}
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
  // 검색
  searchSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
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
    paddingBottom: SPACING.sm,
    gap: 6,
    alignItems: 'center',
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  // 그리드
  columnWrapper: {
    gap: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
    gap: SPACING.sm,
    flexGrow: 0,
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
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
