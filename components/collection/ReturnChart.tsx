// 수익률 간단 차트 (가로 바 차트)

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

interface ReturnChartProps {
  returnRate: number;
}

export default function ReturnChart({ returnRate }: ReturnChartProps) {
  const isPositive = returnRate >= 0;
  const absRate = Math.abs(returnRate);
  const clampedRate = Math.min(absRate, 100); // 최대 100%까지만 표시

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>수익률</Text>
        <View style={styles.rateRow}>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={16}
            color={isPositive ? COLORS.green : COLORS.red}
          />
          <Text
            style={[
              styles.rateText,
              { color: isPositive ? COLORS.green : COLORS.red },
            ]}
          >
            {isPositive ? '+' : ''}
            {returnRate.toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* 바 차트 */}
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${clampedRate}%`,
                backgroundColor: isPositive ? COLORS.green : COLORS.red,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.sub,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '800',
  },
  barContainer: {
    paddingTop: SPACING.sm,
  },
  barBackground: {
    height: 8,
    backgroundColor: COLORS.tag,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
