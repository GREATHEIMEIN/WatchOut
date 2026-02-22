// 시세 상세 화면 — v5 DetailScreen 기반

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice, formatPriceShort, formatPercent } from '@/lib/format';
import { usePriceStore } from '@/store/usePriceStore';

export default function PriceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { watches } = usePriceStore();

  const watch = watches.find((w) => w.id === Number(id));

  if (!watch) {
    return (
      <View style={styles.container}>
        <Header title="시세 상세" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>시계 정보를 찾을 수 없습니다</Text>
        </View>
      </View>
    );
  }

  const isUp = watch.change >= 0;
  const changeColor = isUp ? COLORS.green : COLORS.red;
  const data = watch.history;
  const maxPrice = Math.max(...data);
  const minPrice = Math.min(...data);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <View style={styles.container}>
      <Header
        title={`${watch.brand} ${watch.model}`}
        onBack={() => router.back()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상단 시계 정보 */}
        <View style={styles.heroSection}>
          <View style={styles.imageBox}>
            <Ionicons name="watch-outline" size={48} color={COLORS.sub} />
          </View>
          <Text style={styles.ref}>{watch.referenceNumber}</Text>
          <Text style={styles.heroPrice}>{formatPrice(watch.price)}</Text>
          <View style={styles.changeRow}>
            <Ionicons
              name={isUp ? 'caret-up' : 'caret-down'}
              size={12}
              color={changeColor}
            />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {formatPercent(watch.change)} (이번 주)
            </Text>
          </View>
        </View>

        {/* 6주 시세 차트 */}
        <View style={styles.chartSection}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>6주 시세 추이</Text>
            <View style={styles.chartContainer}>
              {data.map((price, i) => {
                // 높이 비례 계산 (v5 로직: ((p - min) / range) * 60 + 20)
                const barHeight = ((price - minPrice) / priceRange) * 60 + 20;
                const isLast = i === data.length - 1;
                const barColor = isLast ? changeColor : COLORS.tag;
                const label = isLast ? '현재' : `${data.length - i}주전`;

                return (
                  <View key={i} style={styles.barColumn}>
                    <Text style={styles.barLabel}>{formatPriceShort(price)}</Text>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                    <Text style={styles.barWeek}>{label}</Text>
                  </View>
                );
              })}
            </View>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sub,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ref: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: SPACING.sm,
  },
  heroPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartSection: {
    padding: SPACING.base,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 120,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 8,
    color: COLORS.sub,
    marginBottom: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  barWeek: {
    fontSize: 9,
    color: COLORS.sub,
    marginTop: 4,
  },
});
