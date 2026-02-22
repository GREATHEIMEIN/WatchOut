// 시계용품 매물 카드 — 2컬럼 그리드용

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { MockAccessoryItem } from '@/types';

interface AccessoryCardProps {
  item: MockAccessoryItem;
  onPress: () => void;
}

export default function AccessoryCard({ item, onPress }: AccessoryCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* 이미지 영역 */}
      <View style={styles.imageArea}>
        <Ionicons name="cube-outline" size={32} color={COLORS.sub} />
      </View>

      {/* 정보 영역 */}
      <View style={styles.info}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <Text style={styles.condition}>{item.condition}</Text>
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
  info: {
    padding: SPACING.md,
    gap: 2,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.tag,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.sub,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  condition: {
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
