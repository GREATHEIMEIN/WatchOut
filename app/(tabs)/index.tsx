// 홈 탭 화면 — v5 HomeScreen 기반

import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import { COLORS, SPACING, RADIUS } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import {
  MOCK_COMMUNITY_POSTS,
  MOCK_TRADE_ITEMS,
  MOCK_NEWS,
} from '@/lib/mockData';

// 섹션 타이틀 컴포넌트
const SectionTitle = ({ title, onMore }: { title: string; onMore?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onMore && (
      <TouchableOpacity onPress={onMore}>
        <Text style={styles.sectionMore}>더보기 →</Text>
      </TouchableOpacity>
    )}
  </View>
);

// 카테고리별 배지 색상
const getCategoryColor = (category: string) => {
  switch (category) {
    case '질문': return '#EEF4FF';
    case '후기': return '#E8F8EE';
    case '공지': return '#FEF0F0';
    default: return COLORS.tag;
  }
};

const getCategoryTextColor = (category: string) => {
  switch (category) {
    case '질문': return '#3B82F6';
    case '후기': return '#22C55E';
    case '공지': return COLORS.red;
    default: return COLORS.sub;
  }
};

// 빠른 메뉴 데이터
const QUICK_MENUS = [
  { icon: '💬', label: '자유게시판', color: '#EEF4FF', route: 'community' },
  { icon: '⌚', label: '내 컬렉션', color: '#FFF4E6', route: 'collection' },
  { icon: '💰', label: '즉시매입', color: '#E8F8EE', route: '/(tabs)/buyback' },
  { icon: '🤝', label: '시계거래', color: '#FEF0F0', route: '/(tabs)/trade' },
] as const;

export default function HomeScreen() {
  const router = useRouter();

  const handleQuickMenu = (route: string) => {
    if (route === 'community') {
      router.push('/(tabs)/community');
      return;
    }
    if (route === 'collection') {
      Alert.alert('준비 중', '다음 업데이트에서 만나요!');
      return;
    }
    router.push(route as '/(tabs)/buyback');
  };

  return (
    <View style={styles.container}>
      <Header title="WATCHOUT" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 빠른 메뉴 2x2 */}
        <View style={styles.quickMenuSection}>
          <View style={styles.quickMenuRow}>
            {QUICK_MENUS.slice(0, 2).map((menu) => (
              <TouchableOpacity
                key={menu.label}
                style={[styles.quickMenuItem, { backgroundColor: menu.color }]}
                onPress={() => handleQuickMenu(menu.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickMenuIcon}>{menu.icon}</Text>
                <Text style={styles.quickMenuLabel}>{menu.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.quickMenuRow}>
            {QUICK_MENUS.slice(2, 4).map((menu) => (
              <TouchableOpacity
                key={menu.label}
                style={[styles.quickMenuItem, { backgroundColor: menu.color }]}
                onPress={() => handleQuickMenu(menu.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickMenuIcon}>{menu.icon}</Text>
                <Text style={styles.quickMenuLabel}>{menu.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 커뮤니티 최신글 */}
        <SectionTitle title="커뮤니티 최신글" onMore={() => router.push('/(tabs)/community')} />
        <View style={styles.communityCard}>
          {MOCK_COMMUNITY_POSTS.slice(0, 3).map((post, index) => (
            <View key={post.id}>
              <TouchableOpacity
                style={styles.communityItem}
                onPress={() => router.push(`/community/${post.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                  <Text style={[styles.categoryText, { color: getCategoryTextColor(post.category) }]}>
                    {post.category}
                  </Text>
                </View>
                <Text style={styles.communityTitle} numberOfLines={1}>{post.title}</Text>
                <View style={styles.communityMeta}>
                  <Text style={styles.metaText}>{post.author}</Text>
                  <Text style={styles.metaText}>💬 {post.comments}</Text>
                  <Text style={styles.metaText}>❤️ {post.likes}</Text>
                  <Text style={styles.metaText}>{post.time}</Text>
                </View>
              </TouchableOpacity>
              {index < 2 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* 시계거래 최신 매물 */}
        <SectionTitle title="시계거래 최신 매물" onMore={() => router.push('/(tabs)/trade')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tradeScrollContent}
        >
          {MOCK_TRADE_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.tradeCard} activeOpacity={0.7}>
              {/* 시계 이미지 placeholder + 배지 */}
              <View style={styles.tradeImageBox}>
                <Ionicons name="watch-outline" size={28} color={COLORS.sub} />
                <View style={[
                  styles.tradeBadge,
                  { backgroundColor: item.type === 'sell' ? COLORS.accent : COLORS.orange },
                ]}>
                  <Text style={styles.tradeBadgeText}>
                    {item.type === 'sell' ? '판매' : '구매'}
                  </Text>
                </View>
              </View>
              <Text style={styles.tradeBrand} numberOfLines={1}>{item.brand} {item.model}</Text>
              <Text style={styles.tradeInfo}>{item.condition} · {item.year} · {item.loc}</Text>
              <Text style={styles.tradePrice}>{formatPrice(item.price)}</Text>
              <Text style={styles.tradeAuthor}>{item.author} · {item.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 시계 뉴스 */}
        <SectionTitle title="시계 뉴스" />
        <View style={styles.newsCard}>
          {MOCK_NEWS.map((news, index) => (
            <View key={news.id}>
              <View style={styles.newsItem}>
                <Text style={styles.newsTitle} numberOfLines={2}>{news.title}</Text>
                <Text style={styles.newsMeta}>{news.source} · {news.time}</Text>
              </View>
              {index < MOCK_NEWS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* 즉시매입 미니배너 */}
        <TouchableOpacity
          style={styles.miniBanner}
          onPress={() => router.push('/(tabs)/buyback')}
          activeOpacity={0.8}
        >
          <View style={styles.miniBannerLeft}>
            <Text style={styles.miniBannerIcon}>💰</Text>
            <View>
              <Text style={styles.miniBannerTitle}>찾아가서 최고가로 매입</Text>
              <Text style={styles.miniBannerSub}>출장방문 · 현장감정 · 즉시입금</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // 빠른 메뉴
  quickMenuSection: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  quickMenuRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickMenuItem: {
    flex: 1,
    borderRadius: RADIUS.card,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  quickMenuIcon: {
    fontSize: 22,
  },
  quickMenuLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionMore: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.sub,
  },
  // 커뮤니티
  communityCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  communityItem: {
    paddingVertical: SPACING.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  communityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  communityMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.sub,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  // 시계거래 매물 (수평 스크롤)
  tradeScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  tradeCard: {
    width: 200,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  tradeImageBox: {
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  tradeBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tradeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tradeBrand: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  tradeInfo: {
    fontSize: 11,
    color: COLORS.sub,
    marginBottom: 4,
  },
  tradePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  tradeAuthor: {
    fontSize: 10,
    color: COLORS.sub,
  },
  // 뉴스
  newsCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  newsItem: {
    paddingVertical: SPACING.sm,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  newsMeta: {
    fontSize: 11,
    color: COLORS.sub,
  },
  // 즉시매입 미니배너
  miniBanner: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  miniBannerIcon: {
    fontSize: 28,
  },
  miniBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  miniBannerSub: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 2,
  },
});
