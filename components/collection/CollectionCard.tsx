// 컬렉션 리스트 카드 (PriceCard 패턴 참고)

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { CollectionWithWatch } from '@/types';

interface CollectionCardProps {
  item: CollectionWithWatch;
  onPress: () => void;
}

export default function CollectionCard({ item, onPress }: CollectionCardProps) {
  const returnRate = item.returnRate || 0;
  const returnAmount = item.returnAmount || 0;
  const isPositive = returnRate >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* 시계 이미지 */}
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="watch-outline" size={24} color={COLORS.sub} />
        </View>
      )}

      {/* 정보 */}
      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.model} numberOfLines={1}>
          {item.model}
        </Text>
        <Text style={styles.ref}>{item.referenceNumber}</Text>

        {/* 수익률 */}
        <View style={styles.returnRow}>
          {item.purchasePrice !== null && item.currentPrice !== null ? (
            <>
              <Ionicons
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={14}
                color={isPositive ? COLORS.green : COLORS.red}
              />
              <Text
                style={[
                  styles.returnText,
                  { color: isPositive ? COLORS.green : COLORS.red },
                ]}
              >
                {isPositive ? '+' : ''}
                {returnRate.toFixed(2)}% ({isPositive ? '+' : ''}
                {formatPrice(returnAmount)})
              </Text>
            </>
          ) : (
            <Text style={styles.noPriceText}>시세 정보 없음</Text>
          )}
        </View>
      </View>

      {/* 화살표 */}
      <Ionicons name="chevron-forward" size={20} color={COLORS.sub} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.tag,
  },
  placeholderImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.sub,
  },
  model: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  ref: {
    fontSize: 11,
    color: COLORS.sub,
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  returnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noPriceText: {
    fontSize: 11,
    color: COLORS.sub,
  },
});
