// 매물 상세 화면

import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { requireAuth } from '@/lib/authGuard';

// 시세 배지 색상
const BADGE_COLORS = {
  green: { bg: '#E8F8EE', text: COLORS.green },
  yellow: { bg: '#FFF4E6', text: COLORS.orange },
  red: { bg: '#FEF0F0', text: COLORS.red },
} as const;

export default function TradeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tradeItems, accessoryItems } = useTradeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { createOrGetRoom } = useChatStore();
  const { favoriteIds, toggleFavorite } = useFavoriteStore();

  // 시계와 용품 모두에서 검색
  const watchItem = tradeItems.find((t) => t.id === Number(id));
  const accessoryItem = accessoryItems.find((a) => a.id === Number(id));
  const isWatch = !!watchItem;
  const item = watchItem ?? accessoryItem;
  const isFav = favoriteIds.includes(item?.id ?? -1);

  if (!item) {
    return (
      <View style={styles.container}>
        <Header title="매물 상세" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>매물 정보를 찾을 수 없습니다</Text>
        </View>
      </View>
    );
  }

  const headerTitle = isWatch
    ? `${watchItem!.brand} ${watchItem!.model}`
    : accessoryItem!.title;

  // 시계 상세 정보 그리드
  const infoRows = isWatch
    ? [
        { label: '레퍼런스', value: watchItem!.ref },
        { label: '연식', value: watchItem!.year },
        { label: '컨디션', value: watchItem!.condition },
        { label: '구성품', value: watchItem!.kit },
        { label: '거래방법', value: watchItem!.method ?? '직거래' },
        { label: '지역', value: watchItem!.loc },
      ]
    : [
        { label: '카테고리', value: accessoryItem!.category },
        { label: '컨디션', value: accessoryItem!.condition },
        { label: '거래방법', value: accessoryItem!.method ?? '택배' },
      ];

  const handleAlert = (feature: string) => {
    Alert.alert('준비 중', `${feature} 기능은 다음 업데이트에서 제공됩니다.`);
  };

  // 채팅하기 — 로그인 확인 → 방 생성/조회 → 채팅 화면 이동
  const handleChatPress = async () => {
    if (!requireAuth(router, isLoggedIn, '채팅')) return;
    if (!watchItem?.userId) {
      Alert.alert('오류', '판매자 정보를 불러올 수 없습니다.');
      return;
    }
    const roomId = await createOrGetRoom(item.id, watchItem.userId);
    if (roomId) {
      router.push(`/chat/${roomId}`);
    }
  };

  // 본인 매물 여부
  const isMyPost = isLoggedIn && watchItem?.userId && user?.id === watchItem.userId;

  return (
    <View style={styles.container}>
      <Header title={headerTitle} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 이미지 갤러리 placeholder */}
        <View style={styles.imageGallery}>
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name={isWatch ? 'watch-outline' : 'cube-outline'}
              size={56}
              color={COLORS.sub}
            />
            <Text style={styles.imageHint}>사진 없음</Text>
          </View>
          {/* 페이지 인디케이터 */}
          <View style={styles.pageIndicator}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* 판매자 정보 */}
        <View style={styles.sellerRow}>
          <View style={styles.sellerAvatar}>
            <Ionicons name="person" size={20} color={COLORS.sub} />
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{item.author}</Text>
            <Text style={styles.sellerMeta}>
              Lv.{item.authorLevel ?? 1}
              {item.authorRating ? ` · ★${item.authorRating}` : ''}
            </Text>
          </View>
          <View style={styles.timeViews}>
            <Text style={styles.postTime}>{item.time}</Text>
            {item.views !== undefined && (
              <Text style={styles.viewCount}>조회 {item.views}</Text>
            )}
          </View>
        </View>

        {/* 가격 섹션 */}
        <View style={styles.priceSection}>
          <Text style={styles.detailPrice}>{formatPrice(item.price)}</Text>
          {isWatch && watchItem && (
            <View
              style={[
                styles.priceBadge,
                { backgroundColor: BADGE_COLORS[watchItem.badge].bg },
              ]}
            >
              <Text
                style={[
                  styles.priceBadgeText,
                  { color: BADGE_COLORS[watchItem.badge].text },
                ]}
              >
                {watchItem.badgeText}
              </Text>
            </View>
          )}
          {isWatch && watchItem && (
            <View style={styles.tradeTypeBadge}>
              <Text style={styles.tradeTypeText}>
                {watchItem.type === 'sell' ? '판매' : '구매'}
              </Text>
            </View>
          )}
        </View>

        {/* 상세 정보 그리드 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>상세 정보</Text>
          <View style={styles.infoGrid}>
            {infoRows.map((row) => (
              <View key={row.label} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 상세 설명 */}
        {item.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>상세 설명</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        )}

        {/* 하단 여백 (CTA 바 공간) */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 하단 고정 CTA 바 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => {
            if (!requireAuth(router, isLoggedIn, '관심 매물')) return;
            toggleFavorite(item.id);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={22}
            color={isFav ? COLORS.red : COLORS.text}
          />
        </TouchableOpacity>
        {isMyPost ? (
          <View style={[styles.chatButton, styles.chatButtonDisabled]}>
            <Text style={[styles.chatButtonText, { color: COLORS.sub }]}>내 매물입니다</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={handleChatPress}
            activeOpacity={0.8}
          >
            <Text style={styles.chatButtonText}>판매자에게 메시지</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
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

  // 이미지 갤러리
  imageGallery: {
    height: 280,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  imageHint: {
    fontSize: 12,
    color: COLORS.sub,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.text,
  },

  // 판매자 정보
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  sellerMeta: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 2,
  },
  timeViews: {
    alignItems: 'flex-end',
  },
  postTime: {
    fontSize: 12,
    color: COLORS.sub,
  },
  viewCount: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: 2,
  },

  // 가격
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.card,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  priceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tradeTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.tag,
  },
  tradeTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
  },

  // 상세 정보
  infoSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
  },
  infoItem: {
    width: '49.5%',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.sub,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  // 설명
  descriptionSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },

  // 하단 CTA
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    flex: 1,
    backgroundColor: COLORS.text,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    alignItems: 'center',
  },
  chatButtonDisabled: {
    backgroundColor: COLORS.tag,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
