// 포트폴리오 통계 요약 카드

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { PortfolioStats } from '@/types';

interface SummaryCardProps {
  stats: PortfolioStats;
}

export default function SummaryCard({ stats }: SummaryCardProps) {
  const isPositive = stats.totalReturnRate >= 0;

  return (
    <View style={styles.card}>
      {/* 총 보유 시계 */}
      <View style={styles.row}>
        <Text style={styles.label}>보유 시계</Text>
        <Text style={styles.value}>{stats.totalWatches}개</Text>
      </View>

      {/* 총 구매 금액 */}
      <View style={styles.row}>
        <Text style={styles.label}>총 구매 금액</Text>
        <Text style={styles.value}>{formatPrice(stats.totalPurchaseValue)}</Text>
      </View>

      {/* 현재 총 가치 */}
      <View style={styles.row}>
        <Text style={styles.label}>현재 총 가치</Text>
        <Text style={styles.value}>{formatPrice(stats.totalCurrentValue)}</Text>
      </View>

      {/* 총 수익 */}
      <View style={[styles.row, styles.returnRow]}>
        <Text style={styles.returnLabel}>총 수익</Text>
        <View style={styles.returnValueRow}>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={16}
            color={isPositive ? COLORS.green : COLORS.red}
          />
          <Text
            style={[
              styles.returnValue,
              { color: isPositive ? COLORS.green : COLORS.red },
            ]}
          >
            {isPositive ? '+' : ''}
            {formatPrice(stats.totalReturn)}
          </Text>
          <Text
            style={[
              styles.returnRate,
              { color: isPositive ? COLORS.green : COLORS.red },
            ]}
          >
            ({isPositive ? '+' : ''}
            {stats.totalReturnRate.toFixed(2)}%)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  returnRow: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  returnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  returnValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  returnValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  returnRate: {
    fontSize: 13,
    fontWeight: '600',
  },
});
