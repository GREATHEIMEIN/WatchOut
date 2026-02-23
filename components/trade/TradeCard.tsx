// 시계 매물 카드 — 2컬럼 그리드용

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { MockTradeItem } from '@/types';

interface TradeCardProps {
  item: MockTradeItem;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

// 시세 배지 배경/텍스트 색상
const BADGE_COLORS = {
  green: { bg: '#E8F8EE', text: COLORS.green },
  yellow: { bg: '#FFF4E6', text: COLORS.orange },
  red: { bg: '#FEF0F0', text: COLORS.red },
} as const;

export default function TradeCard({ item, onPress, isFavorite = false, onFavoritePress }: TradeCardProps) {
  const badgeColor = BADGE_COLORS[item.badge];
  const isSell = item.type === 'sell';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* 이미지 영역 */}
      <View style={styles.imageArea}>
        <Ionicons name="watch-outline" size={32} color={COLORS.sub} />
        {/* 판매/구매 배지 */}
        <View style={[styles.typeBadge, { backgroundColor: isSell ? COLORS.accent : COLORS.orange }]}>
          <Text style={styles.typeBadgeText}>{isSell ? '판매' : '구매'}</Text>
        </View>
        {/* 시세 배지 */}
        <View style={[styles.priceBadge, { backgroundColor: badgeColor.bg }]}>
          <Text style={[styles.priceBadgeText, { color: badgeColor.text }]}>{item.badgeText}</Text>
        </View>
        {/* 찜 버튼 */}
        {onFavoritePress && (
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onFavoritePress();
            }}
            activeOpacity={0.75}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? COLORS.red : COLORS.sub}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 정보 영역 */}
      <View style={styles.info}>
        <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
        <Text style={styles.model} numberOfLines={1}>{item.model}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.condition} · {item.year} · {item.loc}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {item.author} · {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageArea: {
    height: 120,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  heartBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: SPACING.md,
    gap: 2,
  },
  brand: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.sub,
  },
  model: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  meta: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: 2,
  },
  author: {
    fontSize: 10,
    color: COLORS.sub,
    marginTop: 4,
  },
});
