// 홈 탭 화면 — SESSION 17 리디자인

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import NotificationBell from '@/components/common/NotificationBell';
import SparkLine from '@/components/price/SparkLine';
import { COLORS, SPACING, RADIUS } from '@/lib/constants';
import { formatPrice, formatPercent } from '@/lib/format';
import {
  MOCK_COMMUNITY_POSTS,
  MOCK_TRADE_ITEMS,
  MOCK_NEWS,
  MOCK_WATCHES,
} from '@/lib/mockData';
import type { WatchWithPrice, MockTradeItem, MockNews, MockCommunityPost } from '@/types';

// 빠른 액션 데이터
const QUICK_ACTIONS = [
  { emoji: '📊', label: '시세', route: '/(tabs)/price' },
  { emoji: '⌚', label: '내 컬렉션', route: '/collection' },
  { emoji: '🏷️', label: '사고/팔기', route: '/(tabs)/trade' },
  { emoji: '💬', label: '커뮤니티', route: '/(tabs)/community' },
] as const;

// 섹션 헤더
const SectionHeader = ({
  label,
  title,
  onMore,
}: {
  label: string;
  title: string;
  onMore?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {onMore && (
      <TouchableOpacity onPress={onMore} activeOpacity={0.7}>
        <Text style={styles.sectionMore}>더보기 →</Text>
      </TouchableOpacity>
    )}
  </View>
);

// 시세 카드
const PriceCard = ({ watch }: { watch: WatchWithPrice }) => {
  const isUp = watch.change >= 0;
  return (
    <TouchableOpacity style={styles.priceCard} activeOpacity={0.7}>
      <Text style={styles.priceCardBrand} numberOfLines={1}>{watch.brand}</Text>
      <Text style={styles.priceCardModel} numberOfLines={1}>{watch.model}</Text>
      <View style={styles.priceCardChart}>
        <SparkLine
          data={watch.history}
          width={80}
          height={28}
          color={isUp ? COLORS.green : COLORS.red}
        />
      </View>
      <Text style={styles.priceCardPrice}>{formatPrice(watch.price)}</Text>
      <View style={[styles.changeChip, { backgroundColor: isUp ? '#E8F8EE' : '#FEF0F0' }]}>
        <Text style={[styles.changeChipText, { color: isUp ? COLORS.green : COLORS.red }]}>
          {formatPercent(watch.change)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// 매물 리스트 행
const TradeListRow = ({ item, isLast }: { item: MockTradeItem; isLast: boolean }) => {
  const router = useRouter();
  return (
    <>
      <TouchableOpacity
        style={styles.tradeRow}
        onPress={() => router.push(`/trade/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.tradeRowImage}>
          <Ionicons name="watch-outline" size={22} color={COLORS.sub} />
        </View>
        <View style={styles.tradeRowInfo}>
          <Text style={styles.tradeRowTitle} numberOfLines={1}>
            {item.brand} {item.model}
          </Text>
          <Text style={styles.tradeRowMeta} numberOfLines={1}>
            {item.condition} · {item.year} · {item.loc}
          </Text>
        </View>
        <View style={styles.tradeRowRight}>
          <Text style={styles.tradeRowPrice}>{formatPrice(item.price)}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: item.type === 'sell' ? '#EEF4FF' : '#FFF4E6' },
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                { color: item.type === 'sell' ? COLORS.accent : COLORS.orange },
              ]}
            >
              {item.type === 'sell' ? '판매' : '구매'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );
};

// 뉴스 행
const NewsRow = ({ news, isLast }: { news: MockNews; isLast: boolean }) => (
  <>
    <View style={styles.newsRow}>
      <View style={styles.newsBadge}>
        <Text style={styles.newsBadgeText}>{news.source}</Text>
      </View>
      <Text style={styles.newsTitle} numberOfLines={2}>{news.title}</Text>
      <Text style={styles.newsMeta}>{news.time}</Text>
    </View>
    {!isLast && <View style={styles.divider} />}
  </>
);

// 커뮤니티 행
const CommunityRow = ({ post, isLast }: { post: MockCommunityPost; isLast: boolean }) => {
  const router = useRouter();
  return (
    <>
      <TouchableOpacity
        style={styles.communityRow}
        onPress={() => router.push(`/community/${post.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.communityRowTop}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{post.category}</Text>
          </View>
        </View>
        <Text style={styles.communityTitle} numberOfLines={1}>{post.title}</Text>
        <View style={styles.communityMeta}>
          <Text style={styles.communityMetaText}>{post.author}</Text>
          <Text style={styles.communityMetaText}>💬 {post.comments}</Text>
          <Text style={styles.communityMetaText}>❤️ {post.likes}</Text>
          <Text style={styles.communityMetaText}>{post.time}</Text>
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const handleQuickAction = (route: string) => {
    router.push(route as '/(tabs)/price');
  };

  return (
    <View style={styles.container}>
      <Header
        title="WATCHOUT"
        dark
        right={<NotificationBell color="#FFFFFF" />}
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickActionItem}
              onPress={() => handleQuickAction(action.route)}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIconBox}>
                <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MARKET 섹션 */}
        <SectionHeader
          label="MARKET"
          title="실시간 시세"
          onMore={() => router.push('/(tabs)/price')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceScrollContent}
        >
          {MOCK_WATCHES.slice(0, 5).map((watch) => (
            <PriceCard key={watch.id} watch={watch} />
          ))}
        </ScrollView>

        {/* 프리미엄 다크 배너 */}
        <View style={styles.darkBanner}>
          <Text style={styles.bannerLabel}>프리미엄 시계 서비스</Text>
          <Text style={styles.bannerHeadline}>즉시매입 · 교환거래</Text>
          <Text style={styles.bannerSub}>전문 감정사가 직접 방문합니다</Text>
          <View style={styles.bannerBtnRow}>
            <TouchableOpacity
              style={styles.bannerBtnPrimary}
              onPress={() => router.push('/(tabs)/buyback')}
              activeOpacity={0.85}
            >
              <Text style={styles.bannerBtnPrimaryText}>즉시매입 신청</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bannerBtnSecondary}
              onPress={() => router.push('/(tabs)/exchange')}
              activeOpacity={0.85}
            >
              <Text style={styles.bannerBtnSecondaryText}>교환거래 보기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MARKETPLACE 섹션 */}
        <SectionHeader
          label="MARKETPLACE"
          title="최신 매물"
          onMore={() => router.push('/(tabs)/trade')}
        />
        <View style={styles.listCard}>
          {MOCK_TRADE_ITEMS.slice(0, 3).map((item, i) => (
            <TradeListRow key={item.id} item={item} isLast={i === 2} />
          ))}
        </View>

        {/* NEWS 섹션 */}
        <SectionHeader label="NEWS" title="시계 뉴스" />
        <View style={styles.listCard}>
          {MOCK_NEWS.slice(0, 3).map((news, i) => (
            <NewsRow key={news.id} news={news} isLast={i === 2} />
          ))}
        </View>

        {/* COMMUNITY 섹션 */}
        <SectionHeader
          label="COMMUNITY"
          title="인기 게시글"
          onMore={() => router.push('/(tabs)/community')}
        />
        <View style={styles.listCard}>
          {MOCK_COMMUNITY_POSTS.slice(0, 3).map((post, i) => (
            <CommunityRow key={post.id} post={post} isLast={i === 2} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: 10,
  },
  quickActionItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  quickActionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F0F0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.gold,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  sectionMore: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },

  // 시세 카드 (수평 스크롤)
  priceScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: 12,
    paddingBottom: 4,
  },
  priceCard: {
    width: 140,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceCardBrand: {
    fontSize: 11,
    color: COLORS.sub,
    marginBottom: 2,
  },
  priceCardModel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  priceCardChart: {
    marginBottom: SPACING.sm,
  },
  priceCardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  changeChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeChipText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // 프리미엄 다크 배너
  darkBanner: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: '#0C0C14',
    borderRadius: 16,
    padding: SPACING.lg,
  },
  bannerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bannerHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: SPACING.base,
  },
  bannerBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bannerBtnPrimary: {
    flex: 1,
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    borderRadius: RADIUS.button,
    alignItems: 'center',
  },
  bannerBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerBtnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    borderRadius: RADIUS.button,
    alignItems: 'center',
  },
  bannerBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },

  // 공통 리스트 카드
  listCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.base,
  },

  // 매물 리스트 행
  tradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    gap: 12,
  },
  tradeRowImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeRowInfo: {
    flex: 1,
  },
  tradeRowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  tradeRowMeta: {
    fontSize: 11,
    color: COLORS.sub,
  },
  tradeRowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  tradeRowPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // 뉴스 행
  newsRow: {
    padding: SPACING.base,
    gap: 5,
  },
  newsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: 4,
  },
  newsBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gold,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
  },
  newsMeta: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: 2,
  },

  // 커뮤니티 행
  communityRow: {
    padding: SPACING.base,
  },
  communityRowTop: {
    marginBottom: 5,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldMuted,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gold,
  },
  communityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  communityMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  communityMetaText: {
    fontSize: 11,
    color: COLORS.sub,
  },
});
