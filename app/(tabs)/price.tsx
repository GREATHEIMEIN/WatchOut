// 시세 탭 화면 — v5 PriceScreen 기반

import { useEffect } from 'react';
import {
  ActivityIndicator,
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
import { usePriceStore } from '@/store/usePriceStore';
import type { WatchWithPrice } from '@/types';

const BRANDS = ['전체', 'Rolex', 'Omega', 'AP', 'Patek', 'Cartier'];

export default function PriceScreen() {
  const router = useRouter();
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    fetchWatches,
    getFilteredWatches,
  } = usePriceStore();

  // Supabase에서 데이터 로드
  useEffect(() => {
    fetchWatches();
  }, []);

  const filtered = getFilteredWatches();

  const handlePressWatch = (watch: WatchWithPrice) => {
    router.push(`/price/${watch.id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="시세" />

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

        {/* 로딩 중 */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>시세 데이터를 불러오는 중...</Text>
          </View>
        )}

        {/* 에러 */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchWatches}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 데이터 없음 */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="watch-outline" size={48} color={COLORS.sub} />
            <Text style={styles.emptyText}>시세 데이터가 없습니다</Text>
          </View>
        )}

        {/* 시계 목록 */}
        {!loading && !error && filtered.length > 0 && (
          <View style={styles.listContainer}>
            {filtered.map((item, index) => (
              <View key={String(item.id)}>
                <PriceCard watch={item} onPress={() => handlePressWatch(item)} />
                {index < filtered.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}
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
    paddingBottom: 100,
  },
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
  brandFilter: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
    gap: 6,
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
    paddingBottom: SPACING.sm,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sub,
  },
});
