// 시세 카드 컴포넌트 — v5 PriceScreen 카드 기반

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SparkLine from '@/components/price/SparkLine';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice, formatPercent } from '@/lib/format';
import type { WatchWithPrice } from '@/types';

interface PriceCardProps {
  watch: WatchWithPrice;
  onPress: () => void;
}

const PriceCard = ({ watch, onPress }: PriceCardProps) => {
  const isUp = watch.change >= 0;
  const changeColor = isUp ? COLORS.green : COLORS.red;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* 시계 이미지 placeholder */}
      <View style={styles.imageBox}>
        <Ionicons name="watch-outline" size={24} color={COLORS.sub} />
      </View>

      {/* 브랜드 + 모델 / 레퍼런스 */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {watch.brand} {watch.model}
        </Text>
        <Text style={styles.ref}>{watch.referenceNumber}</Text>
      </View>

      {/* 스파크라인 */}
      <SparkLine data={watch.history} width={50} height={22} color={changeColor} />

      {/* 가격 + 변동률 */}
      <View style={styles.priceBox}>
        <Text style={styles.price}>{formatPrice(watch.price)}</Text>
        <View style={styles.changeRow}>
          <Ionicons
            name={isUp ? 'caret-up' : 'caret-down'}
            size={10}
            color={changeColor}
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {formatPercent(watch.change)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PriceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  imageBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  ref: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: 2,
  },
  priceBox: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
