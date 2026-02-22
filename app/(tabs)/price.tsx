// 시세 탭 화면 — v5 PriceScreen 기반

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
import PriceCard from '@/components/price/PriceCard';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { MOCK_WATCHES } from '@/lib/mockData';
import { usePriceStore } from '@/store/usePriceStore';
import type { WatchWithPrice } from '@/types';

const BRANDS = ['전체', 'Rolex', 'Omega', 'AP', 'Patek', 'Cartier'];

export default function PriceScreen() {
  const router = useRouter();
  const {
    setWatches,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    getFilteredWatches,
  } = usePriceStore();

  // Mock 데이터 로드
  useEffect(() => {
    setWatches(MOCK_WATCHES);
  }, [setWatches]);

  const filtered = getFilteredWatches();

  const handlePressWatch = (watch: WatchWithPrice) => {
    router.push(`/price/${watch.id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="시세" />

      {/* 검색바 */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.sub} />
          <TextInput
            style={styles.searchInput}
            placeholder="브랜드, 모델명, 레퍼런스 검색"
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

      {/* 브랜드 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandFilter}
      >
        {BRANDS.map((brand) => {
          const isActive = selectedBrand === brand;
          return (
            <TouchableOpacity
              key={brand}
              style={[styles.brandChip, isActive && styles.brandChipActive]}
              onPress={() => setSelectedBrand(brand)}
            >
              <Text style={[styles.brandChipText, isActive && styles.brandChipTextActive]}>
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 모델 수 */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length}개 모델</Text>
      </View>

      {/* 시계 목록 */}
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PriceCard watch={item} onPress={() => handlePressWatch(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
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
  brandFilter: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: 6,
    alignItems: 'center',
  },
  brandChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: RADIUS.tag,
    backgroundColor: COLORS.tag,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandChipActive: {
    backgroundColor: COLORS.text,
  },
  brandChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
  },
  brandChipTextActive: {
    color: '#FFFFFF',
  },
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
    flexGrow: 0,
  },
  separator: {
    height: SPACING.sm,
  },
});
