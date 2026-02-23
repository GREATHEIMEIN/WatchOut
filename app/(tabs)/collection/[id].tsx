// 컬렉션 상세 화면

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import ReturnChart from '@/components/collection/ReturnChart';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import { useCollectionStore } from '@/store/useCollectionStore';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { collections, removeFromCollection } = useCollectionStore();

  const [item, setItem] = useState(() =>
    collections.find((c) => c.id === parseInt(id)),
  );

  useEffect(() => {
    const found = collections.find((c) => c.id === parseInt(id));
    setItem(found);
  }, [collections, id]);

  const handleDelete = () => {
    Alert.alert(
      '컬렉션 삭제',
      '이 시계를 컬렉션에서 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const { success } = await removeFromCollection(parseInt(id));
            if (success) {
              Alert.alert('삭제 완료', '', [
                { text: '확인', onPress: () => router.back() },
              ]);
            } else {
              Alert.alert('오류', '삭제에 실패했습니다');
            }
          },
        },
      ],
    );
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Header title="컬렉션 상세" onBack={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </View>
    );
  }

  const hasPrice = item.purchasePrice !== null && item.currentPrice !== null;
  const returnAmount = item.returnAmount || 0;
  const returnRate = item.returnRate || 0;
  const isPositive = returnRate >= 0;

  return (
    <View style={styles.container}>
      <Header title="컬렉션 상세" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 시계 이미지 */}
        <View style={styles.imageSection}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="watch-outline" size={80} color={COLORS.sub} />
            </View>
          )}
        </View>

        {/* 시계 정보 */}
        <View style={styles.section}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.model}>{item.model}</Text>
          <Text style={styles.ref}>{item.referenceNumber}</Text>
        </View>

        {/* 가격 비교 */}
        {hasPrice && (
          <>
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>구매 금액</Text>
                <Text style={styles.priceValue}>
                  {formatPrice(item.purchasePrice!)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>현재 시세</Text>
                <Text style={styles.priceValue}>
                  {formatPrice(item.currentPrice!)}
                </Text>
              </View>
              <View style={[styles.priceRow, styles.returnPriceRow]}>
                <Text style={styles.returnLabel}>평가 손익</Text>
                <View style={styles.returnValueRow}>
                  <Ionicons
                    name={isPositive ? 'trending-up' : 'trending-down'}
                    size={18}
                    color={isPositive ? COLORS.green : COLORS.red}
                  />
                  <Text
                    style={[
                      styles.returnValue,
                      { color: isPositive ? COLORS.green : COLORS.red },
                    ]}
                  >
                    {isPositive ? '+' : ''}
                    {formatPrice(returnAmount)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 수익률 차트 */}
            <View style={styles.section}>
              <ReturnChart returnRate={returnRate} />
            </View>
          </>
        )}

        {/* 구매 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>구매 정보</Text>
          {item.purchaseDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>구매 날짜</Text>
              <Text style={styles.infoValue}>{item.purchaseDate}</Text>
            </View>
          )}
          {item.note && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>메모</Text>
              <Text style={styles.infoValue}>{item.note}</Text>
            </View>
          )}
        </View>

        {/* 삭제 버튼 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={COLORS.red} />
            <Text style={styles.deleteButtonText}>컬렉션에서 삭제</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 이미지
  imageSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.card,
    marginBottom: SPACING.sm,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: RADIUS.card,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 시계 정보
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  brand: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
    marginBottom: 4,
  },
  model: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  ref: {
    fontSize: 14,
    color: COLORS.sub,
  },
  // 가격 비교
  priceSection: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  returnPriceRow: {
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
  // 구매 정보
  infoSection: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  // 버튼
  buttonSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.red,
  },
});
