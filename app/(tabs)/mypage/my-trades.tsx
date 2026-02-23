// 내 매물 목록 화면

import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/format';

const TRADE_STATUS_LABEL: Record<string, string> = {
  active: '판매중',
  reserved: '예약중',
  sold: '거래완료',
};

const TRADE_STATUS_COLOR: Record<string, string> = {
  active: COLORS.green,
  reserved: COLORS.orange,
  sold: COLORS.sub,
};

export default function MyTradesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { myTrades, myTradesLoading, fetchMyTrades } = useTradeStore();

  useEffect(() => {
    if (user) fetchMyTrades(user.id);
  }, []);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 매물</Text>
        <View style={{ width: 26 }} />
      </View>

      {myTradesLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={COLORS.sub} />
        </View>
      ) : myTrades.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="pricetag-outline" size={44} color={COLORS.border} />
          <Text style={styles.emptyTitle}>등록한 매물이 없습니다</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/trade/create')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>매물 등록하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {myTrades.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.tradeRow}
                onPress={() => router.push(`/trade/${item.id}`)}
                activeOpacity={0.7}
              >
                {/* 이미지 placeholder */}
                <View style={styles.imageBox}>
                  <Ionicons name="watch-outline" size={26} color={COLORS.sub} />
                  {/* 판매/구매 배지 */}
                  <View style={[
                    styles.typeBadge,
                    { backgroundColor: item.type === 'sell' ? COLORS.accent : COLORS.orange },
                  ]}>
                    <Text style={styles.typeBadgeText}>
                      {item.type === 'sell' ? '판매' : '구매'}
                    </Text>
                  </View>
                </View>

                {/* 우측 정보 */}
                <View style={styles.tradeInfo}>
                  <Text style={styles.tradeName} numberOfLines={1}>
                    {item.brand} {item.model}
                  </Text>
                  <Text style={styles.tradePrice}>{formatPrice(item.price)}</Text>
                  <View style={styles.tradeMetaRow}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: `${TRADE_STATUS_COLOR[item.status] ?? COLORS.sub}22` },
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: TRADE_STATUS_COLOR[item.status] ?? COLORS.sub },
                      ]}>
                        {TRADE_STATUS_LABEL[item.status] ?? item.status}
                      </Text>
                    </View>
                    <Text style={styles.tradeTime}>{formatRelativeTime(item.createdAt)}</Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
              </TouchableOpacity>
              {index < myTrades.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: 15,
    color: COLORS.sub,
  },
  ctaButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.button,
    paddingVertical: 11,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    padding: SPACING.lg,
  },
  tradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tradeInfo: {
    flex: 1,
    gap: 4,
  },
  tradeName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  tradePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  tradeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tradeTime: {
    fontSize: 11,
    color: COLORS.sub,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
